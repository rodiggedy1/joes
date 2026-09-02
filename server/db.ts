import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { Booking, BookingEvent, InsertUser, User, bookingEvents, bookings, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "phone", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (user.phoneVerifiedAt !== undefined) {
      values.phoneVerifiedAt = user.phoneVerifiedAt;
      updateSet.phoneVerifiedAt = user.phoneVerifiedAt;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createBrowserBookingAccount(input: { name: string; phone: string }): Promise<User> {
  const openId = `customer_${crypto.randomUUID().replace(/-/g, "")}`;
  await upsertUser({
    openId,
    name: input.name,
    phone: input.phone,
    email: null,
    loginMethod: "booking_browser",
    lastSignedIn: new Date(),
  });
  const user = await getUserByOpenId(openId);
  if (!user) throw new Error("Customer account could not be created");
  return user;
}

export type BookingWithEvents = {
  booking: Booking;
  events: BookingEvent[];
};

export type OperationsBooking = BookingWithEvents & {
  customerName: string | null;
  customerEmail: string | null;
};

type NewBooking = {
  service: string;
  title: string;
  customerRequest: string;
  timeWindow?: string | null;
  scheduledFor?: Date | null;
  address?: string | null;
  quotedCents: number;
};

function bookingCode() {
  return `GJ-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

async function bookingEventsFor(bookingId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db.select().from(bookingEvents).where(eq(bookingEvents.bookingId, bookingId)).orderBy(desc(bookingEvents.createdAt));
}

export async function createBookingForCustomer(customerId: number, input: NewBooking): Promise<BookingWithEvents> {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const inserted = await db.insert(bookings).values({
    bookingCode: bookingCode(),
    customerId,
    service: input.service,
    title: input.title,
    customerRequest: input.customerRequest,
    scheduledFor: input.scheduledFor ?? new Date(Date.now() + 86_400_000),
    timeWindow: input.timeWindow ?? null,
    address: input.address ?? null,
    quotedCents: input.quotedCents,
    status: "requested",
    paymentStatus: "pending",
  }).$returningId();

  const bookingId = inserted[0]?.id;
  if (!bookingId) throw new Error("Booking could not be created");

  await db.insert(bookingEvents).values({
    bookingId,
    actor: "system",
    title: "Booking saved to your account",
    detail: "Good Joe received your request and is preparing the next step.",
  });

  const booking = await getBookingForCustomer(customerId, bookingId);
  if (!booking) throw new Error("Booking could not be loaded");
  return booking;
}

export async function getBookingForCustomer(customerId: number, bookingId: number): Promise<BookingWithEvents | null> {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const rows = await db.select().from(bookings).where(and(eq(bookings.id, bookingId), eq(bookings.customerId, customerId))).limit(1);
  const booking = rows[0];
  if (!booking) return null;
  return { booking, events: await bookingEventsFor(booking.id) };
}

export async function listBookingsForCustomer(customerId: number): Promise<BookingWithEvents[]> {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const rows = await db.select().from(bookings).where(eq(bookings.customerId, customerId)).orderBy(desc(bookings.createdAt));
  return Promise.all(rows.map(async booking => ({ booking, events: await bookingEventsFor(booking.id) })));
}

export async function requestRescheduleForCustomer(customerId: number, bookingId: number) {
  const booking = await getBookingForCustomer(customerId, bookingId);
  if (!booking) return null;
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(bookingEvents).values({
    bookingId,
    actor: "customer",
    title: "Reschedule requested",
    detail: "A Good Joe coordinator will follow up with new timing options.",
  });
  return getBookingForCustomer(customerId, bookingId);
}

export async function cancelBookingForCustomer(customerId: number, bookingId: number) {
  const booking = await getBookingForCustomer(customerId, bookingId);
  if (!booking || ["completed", "cancelled"].includes(booking.booking.status)) return null;
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(bookings).set({ status: "cancelled" }).where(and(eq(bookings.id, bookingId), eq(bookings.customerId, customerId)));
  await db.insert(bookingEvents).values({
    bookingId,
    actor: "customer",
    title: "Booking cancelled",
    detail: "Your request has been cancelled. No payment is captured by this prototype.",
  });
  return getBookingForCustomer(customerId, bookingId);
}

export async function listOperationsBookings(): Promise<OperationsBooking[]> {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const rows = await db.select({ booking: bookings, customerName: users.name, customerEmail: users.email })
    .from(bookings)
    .innerJoin(users, eq(bookings.customerId, users.id))
    .orderBy(desc(bookings.createdAt));
  return Promise.all(rows.map(async row => ({
    booking: row.booking,
    customerName: row.customerName,
    customerEmail: row.customerEmail,
    events: await bookingEventsFor(row.booking.id),
  })));
}

export async function updateBookingForOperations(input: {
  bookingId: number;
  status?: Booking["status"];
  providerName?: string | null;
  providerEta?: string | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const existing = await db.select().from(bookings).where(eq(bookings.id, input.bookingId)).limit(1);
  if (!existing[0]) return null;

  const changes: Partial<typeof bookings.$inferInsert> = {};
  if (input.status !== undefined) changes.status = input.status;
  if (input.providerName !== undefined) changes.providerName = input.providerName;
  if (input.providerEta !== undefined) changes.providerEta = input.providerEta;
  if (Object.keys(changes).length > 0) await db.update(bookings).set(changes).where(eq(bookings.id, input.bookingId));

  if (input.status !== undefined) {
    await db.insert(bookingEvents).values({
      bookingId: input.bookingId,
      actor: "staff",
      title: `Status updated to ${input.status.replace("_", " ")}`,
      detail: "Good Joe operations updated this booking.",
    });
  }
  if (input.providerName !== undefined && input.providerName) {
    await db.insert(bookingEvents).values({
      bookingId: input.bookingId,
      actor: "staff",
      title: "Provider assignment updated",
      detail: `${input.providerName}${input.providerEta ? ` · ${input.providerEta}` : ""}`,
    });
  }
  return listOperationsBookings();
}
