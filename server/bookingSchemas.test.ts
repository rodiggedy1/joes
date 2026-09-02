import { describe, expect, it } from "vitest";
import { bookingStatusSchema, createBookingSchema, instantBookingSchema, operationsBookingUpdateSchema, staffLoginSchema } from "./bookingSchemas";

describe("Good Joe booking input contracts", () => {
  it("accepts a complete account-owned booking request", () => {
    const result = createBookingSchema.safeParse({
      service: "Pressure washing",
      title: "Patio and walkway refresh",
      customerRequest: "Can someone pressure wash the patio?",
      timeWindow: "Fri, Sep 4 · Afternoon (2:00–5:00 PM)",
      scheduledFor: new Date("2026-09-04T14:00:00"),
      quotedCents: 14900,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid customer requests and impossible price data", () => {
    expect(createBookingSchema.safeParse({ service: "", title: "", customerRequest: "", quotedCents: -1 }).success).toBe(false);
    expect(createBookingSchema.safeParse({ service: "Picture hanging", title: "Picture hanging request", customerRequest: "Hang a picture", quotedCents: 12900 }).success).toBe(false);
  });

  it("accepts an instant booking account only with a usable mobile number", () => {
    const completeBooking = {
      service: "Handyman visit",
      title: "Handyman visit request",
      customerRequest: "Job type: Small repair.",
      timeWindow: "Thu, Sep 3 · Afternoon (2:00–5:00 PM)",
      scheduledFor: new Date("2026-09-03T14:00:00"),
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

  it("accepts approved Operations passwords with 10 or more characters", () => {
    expect(staffLoginSchema.safeParse({ email: "rohan@innclusive.com", password: "1234567890" }).success).toBe(true);
    expect(staffLoginSchema.safeParse({ email: "rohan@innclusive.com", password: "123456789" }).success).toBe(false);
  });
});
