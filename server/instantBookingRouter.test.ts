import { describe, expect, it, vi } from "vitest";
import type { User } from "../drizzle/schema";

const createBrowserBookingAccount = vi.hoisted(() => vi.fn());
const createBookingForCustomer = vi.hoisted(() => vi.fn());
const createSessionToken = vi.hoisted(() => vi.fn());

vi.mock("./db", async importOriginal => ({
  ...(await importOriginal<typeof import("./db")>()),
  createBrowserBookingAccount,
  createBookingForCustomer,
}));
vi.mock("./_core/sdk", () => ({ sdk: { createSessionToken } }));

import { appRouter } from "./routers";

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

describe("auth.bookAndStartAccount", () => {
  it("creates the immediate customer account, saves its booking, and writes a session cookie", async () => {
    createBrowserBookingAccount.mockResolvedValue(customer);
    createBookingForCustomer.mockResolvedValue({ booking: { id: 99, bookingCode: "GJ-TEST" }, events: [] });
    createSessionToken.mockResolvedValue("signed-browser-session");
    const cookie = vi.fn();
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: { cookie } as any,
    });

    const result = await caller.auth.bookAndStartAccount({
      service: "Handyman visit",
      title: "Handyman visit request",
      customerRequest: "Job type: Small repair.",
      timeWindow: "Tomorrow · 10 AM",
      address: "123 Example Street",
      quotedCents: 17900,
      customerName: "Taylor Jordan",
      mobilePhone: "(415) 555-0123",
    });

    expect(createBrowserBookingAccount).toHaveBeenCalledWith({ name: "Taylor Jordan", phone: "+14155550123" });
    expect(createBookingForCustomer).toHaveBeenCalledWith(42, expect.objectContaining({ service: "Handyman visit" }));
    expect(createSessionToken).toHaveBeenCalledWith("customer_browser_session", { name: "Taylor Jordan" });
    expect(cookie).toHaveBeenCalledWith(expect.any(String), "signed-browser-session", expect.objectContaining({ httpOnly: true, maxAge: expect.any(Number) }));
    expect(result.user.id).toBe(42);
  });
});
