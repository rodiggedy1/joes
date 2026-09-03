import { beforeEach, describe, expect, it, vi } from "vitest";
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
  beforeEach(() => vi.clearAllMocks());

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
      quotedCents: 100,
      scopeSelections: { "Job type": "Patch, caulk, or touch-up", "Job count": "A short list", "Parts or hardware": "I have them" },
      customerName: "Taylor Jordan",
      mobilePhone: "(415) 555-0123",
    });

    expect(createBrowserBookingAccount).toHaveBeenCalledWith({ name: "Taylor Jordan", phone: "+14155550123" });
    expect(createBookingForCustomer).toHaveBeenCalledWith(42, expect.objectContaining({
      service: "Handyman visit",
      quotedCents: 21_400,
      estimateRequiresReview: false,
    }));
    expect(createSessionToken).toHaveBeenCalledWith("customer_browser_session", { name: "Taylor Jordan" });
    expect(cookie).toHaveBeenCalledWith(expect.any(String), "signed-browser-session", expect.objectContaining({ httpOnly: true, maxAge: expect.any(Number) }));
    expect(result.user.id).toBe(42);
  });

  it("recalculates an authenticated customer estimate instead of accepting a client total", async () => {
    createBookingForCustomer.mockResolvedValue({ booking: { id: 100, bookingCode: "GJ-RETURNING" }, events: [] });
    const caller = appRouter.createCaller({ user: customer, staffUser: null, req: { protocol: "https", headers: {} } as any, res: {} as any });

    await caller.bookings.create({
      service: "TV mounting",
      title: "TV mounting request",
      customerRequest: "One standard TV.",
      address: "123 Example Street",
      quotedCents: 1,
      scopeSelections: { "TV count": "Two TVs", "TV size": "44–65 inches", "Wall & mount": "Drywall and I need a mount" },
    });

    expect(createBookingForCustomer).toHaveBeenCalledWith(42, expect.objectContaining({
      service: "TV mounting",
      quotedCents: 32_800,
      estimateRequiresReview: false,
    }));
  });
});
