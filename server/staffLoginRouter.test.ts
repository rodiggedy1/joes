import { describe, expect, it, vi } from "vitest";

const authenticateStaffWithPassword = vi.hoisted(() => vi.fn());
const createSessionToken = vi.hoisted(() => vi.fn());

vi.mock("./staffAuth", () => ({ authenticateStaffWithPassword }));
vi.mock("./_core/sdk", () => ({ sdk: { createSessionToken } }));

import { appRouter } from "./routers";
import { STAFF_COOKIE_NAME, STAFF_SESSION_MS } from "../shared/const";

const staffUser = {
  id: 14,
  openId: "staff_approved",
  name: "Good Joe Operations",
  email: "rohan@innclusive.com",
  phone: null,
  phoneVerifiedAt: null,
  loginMethod: "staff_password",
  role: "admin" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

describe("Good Joe staff login router", () => {
  it("writes only the separate staff session after approved credentials", async () => {
    authenticateStaffWithPassword.mockResolvedValue(staffUser);
    createSessionToken.mockResolvedValue("staff-session-token");
    const cookie = vi.fn();
    const caller = appRouter.createCaller({
      user: null,
      staffUser: null,
      req: { protocol: "https", headers: {} } as any,
      res: { cookie } as any,
    });

    await expect(caller.staff.login({ email: "rohan@innclusive.com", password: "a long operations passphrase" })).resolves.toEqual({ success: true });
    expect(createSessionToken).toHaveBeenCalledWith("staff_approved", expect.objectContaining({ expiresInMs: STAFF_SESSION_MS }));
    expect(cookie).toHaveBeenCalledWith(STAFF_COOKIE_NAME, "staff-session-token", expect.objectContaining({ httpOnly: true, maxAge: STAFF_SESSION_MS }));
  });

  it("returns a generic unauthorised response for an unverified password", async () => {
    authenticateStaffWithPassword.mockResolvedValue(null);
    const caller = appRouter.createCaller({
      user: null,
      staffUser: null,
      req: { protocol: "https", headers: {} } as any,
      res: {} as any,
    });
    await expect(caller.staff.login({ email: "rohan@innclusive.com", password: "an incorrect password" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
