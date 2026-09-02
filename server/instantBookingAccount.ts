import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { User } from "../drizzle/schema";
import type { BookingWithEvents } from "./db";
import type { z } from "zod";
import type { instantBookingSchema } from "./bookingSchemas";
import type { TrpcContext } from "./_core/context";

type InstantBookingInput = z.infer<typeof instantBookingSchema>;

type CustomerSessionContext = Pick<TrpcContext, "user" | "req" | "res">;

type InstantBookingDependencies = {
  createCustomer: (input: { name: string; phone: string }) => Promise<User>;
  createBooking: (customerId: number, input: InstantBookingInput) => Promise<BookingWithEvents>;
  createSessionToken: (openId: string, options: { name: string }) => Promise<string>;
  cookieOptions: (request: CustomerSessionContext["req"]) => Record<string, unknown>;
};

export function normalizeMobilePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 ? `+1${digits}` : `+${digits}`;
}

export async function bookAndStartAccount(
  context: CustomerSessionContext,
  input: InstantBookingInput,
  dependencies: InstantBookingDependencies,
) {
  const customer = context.user ?? await dependencies.createCustomer({
    name: input.customerName,
    phone: normalizeMobilePhone(input.mobilePhone),
  });
  const booking = await dependencies.createBooking(customer.id, input);

  if (!context.user) {
    const sessionToken = await dependencies.createSessionToken(customer.openId, {
      name: customer.name ?? "Good Joe customer",
    });
    context.res.cookie(COOKIE_NAME, sessionToken, {
      ...dependencies.cookieOptions(context.req),
      maxAge: ONE_YEAR_MS,
    });
  }

  return { booking, user: customer };
}
