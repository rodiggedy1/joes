import { describe, expect, it } from "vitest";
import { bookingStatusSchema, createBookingSchema, instantBookingSchema, operationsBookingUpdateSchema } from "./bookingSchemas";

describe("Good Joe booking input contracts", () => {
  it("accepts a complete account-owned booking request", () => {
    const result = createBookingSchema.safeParse({
      service: "Pressure washing",
      title: "Patio and walkway refresh",
      customerRequest: "Can someone pressure wash the patio?",
      timeWindow: "Friday · 1–3 PM",
      quotedCents: 14900,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid customer requests and impossible price data", () => {
    expect(createBookingSchema.safeParse({ service: "", title: "", customerRequest: "", quotedCents: -1 }).success).toBe(false);
  });

  it("accepts an instant booking account only with a usable mobile number", () => {
    const completeBooking = {
      service: "Handyman visit",
      title: "Handyman visit request",
      customerRequest: "Job type: Small repair.",
      timeWindow: "Tomorrow · 10 AM",
      address: "123 Example Street",
      quotedCents: 17900,
      customerName: "Taylor Jordan",
      mobilePhone: "(415) 555-0123",
    };
    expect(instantBookingSchema.safeParse(completeBooking).success).toBe(true);
    expect(instantBookingSchema.safeParse({ ...completeBooking, mobilePhone: "123" }).success).toBe(false);
  });

  it("limits operational updates to recognised statuses and real changes", () => {
    expect(bookingStatusSchema.safeParse("in_progress").success).toBe(true);
    expect(bookingStatusSchema.safeParse("paid_out").success).toBe(false);
    expect(operationsBookingUpdateSchema.safeParse({ bookingId: 12 }).success).toBe(false);
    expect(operationsBookingUpdateSchema.safeParse({ bookingId: 12, status: "scheduled" }).success).toBe(true);
  });
});
