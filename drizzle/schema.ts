import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 32 }),
  phoneVerifiedAt: timestamp("phone_verified_at"),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Credentials are restricted to approved internal Operations users. Customer
 * browser accounts never receive a credential row and can never gain staff
 * access through this table.
 */
export const staffCredentials = mysqlTable("staff_credentials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 512 }).notNull(),
  failedLoginCount: int("failed_login_count").default(0).notNull(),
  lockedUntil: timestamp("locked_until"),
  passwordChangedAt: timestamp("password_changed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type StaffCredential = typeof staffCredentials.$inferSelect;

/**
 * A customer-owned service request. Monetary values are stored in integer cents,
 * and scheduledFor is kept as a UTC timestamp for timezone-safe presentation.
 */
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  bookingCode: varchar("booking_code", { length: 32 }).notNull().unique(),
  customerId: int("customer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  service: varchar("service", { length: 120 }).notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  customerRequest: text("customer_request").notNull(),
  status: mysqlEnum("status", ["requested", "scheduled", "in_progress", "completed", "cancelled"])
    .default("requested")
    .notNull(),
  paymentStatus: mysqlEnum("payment_status", ["pending", "authorized", "paid", "refunded"])
    .default("pending")
    .notNull(),
  scheduledFor: timestamp("scheduled_for"),
  timeWindow: varchar("time_window", { length: 80 }),
  address: text("address"),
  quotedCents: int("quoted_cents").notNull(),
  providerName: varchar("provider_name", { length: 160 }),
  providerEta: varchar("provider_eta", { length: 80 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

/**
 * Immutable human-readable milestones for a booking. Customers receive only their
 * own timeline; staff can manage all timelines through protected operations views.
 */
export const bookingEvents = mysqlTable("booking_events", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  actor: mysqlEnum("actor", ["customer", "system", "staff"]).default("system").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  detail: text("detail"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
export type BookingEvent = typeof bookingEvents.$inferSelect;
