import { describe, expect, it, vi } from "vitest";
import type { User } from "../drizzle/schema";
import { bookAndStartAccount, normalizeMobilePhone } from "./instantBookingAccount";

const customer: User = {
  id: 42,
  openId: "customer_browser_session",
  name: "Taylor Jordan",
  email: null,
  phone: "+14155550123",
  phoneVerifiedAt: null,
  loginMethod: "booking_browser",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const input = {
  service: "Handyman visit",
  title: "Handyman visit request",
  customerRequest: "Job type: Small repair.",
  timeWindow: "Tomorrow · 10 AM",
  address: "123 Example Street",
  quotedCents: 17900,
  customerName: "Taylor Jordan",
  mobilePhone: "(415) 555-0123",
};

describe("instant Good Joe booking account", () => {
  it("creates a browser-bound customer, saves the booking under that customer, and issues a session", async () => {
    const createCustomer = vi.fn().mockResolvedValue(customer);
    const createBooking = vi.fn().mockResolvedValue({ booking: { id: 99 }, events: [] });
    const createSessionToken = vi.fn().mockResolvedValue("signed-customer-session");
    const cookie = vi.fn();

    const result = await bookAndStartAccount(
      { user: null, req: {}, res: { cookie } } as any,
      input,
      { createCustomer, createBooking, createSessionToken, cookieOptions: () => ({ httpOnly: true }) },
    );

    expect(createCustomer).toHaveBeenCalledWith({ name: "Taylor Jordan", phone: "+14155550123" });
    expect(createBooking).toHaveBeenCalledWith(42, input);
    expect(createSessionToken).toHaveBeenCalledWith("customer_browser_session", { name: "Taylor Jordan" });
    expect(cookie).toHaveBeenCalledWith(expect.any(String), "signed-customer-session", expect.objectContaining({ httpOnly: true }));
    expect(result.user.id).toBe(42);
  });

  it("reuses an existing account and does not replace its session", async () => {
    const createCustomer = vi.fn();
    const createBooking = vi.fn().mockResolvedValue({ booking: { id: 100 }, events: [] });
    const createSessionToken = vi.fn();
    const cookie = vi.fn();

    await bookAndStartAccount(
      { user: customer, req: {}, res: { cookie } } as any,
      input,
      { createCustomer, createBooking, createSessionToken, cookieOptions: () => ({}) },
    );

    expect(createCustomer).not.toHaveBeenCalled();
    expect(createBooking).toHaveBeenCalledWith(42, input);
    expect(createSessionToken).not.toHaveBeenCalled();
    expect(cookie).not.toHaveBeenCalled();
    expect(normalizeMobilePhone("415.555.0123")).toBe("+14155550123");
  });
});
