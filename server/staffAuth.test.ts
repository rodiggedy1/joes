import { describe, expect, it, vi } from "vitest";
import { authenticateStaffWithPassword, hashStaffPassword, verifyStaffPassword } from "./staffAuth";

const user = { id: 9, openId: "staff_test", name: "Operations", email: "rohan@innclusive.com", phone: null, phoneVerifiedAt: null, loginMethod: "staff_password", role: "admin" as const, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() };

describe("Good Joe staff password authentication", () => {
  it("stores passwords as salted hashes and verifies only the correct password", async () => {
    const hash = await hashStaffPassword("goodjoe123");
    expect(hash).not.toContain("goodjoe123");
    await expect(verifyStaffPassword("goodjoe123", hash)).resolves.toBe(true);
    await expect(verifyStaffPassword("different password phrase", hash)).resolves.toBe(false);
  });

  it("returns an admin only after a valid password and clears prior failures", async () => {
    const dependencies = {
      ensureInitialStaffAdmin: vi.fn(),
      findStaffCredentialByEmail: vi.fn().mockResolvedValue({ credential: { id: 3, email: "rohan@innclusive.com", passwordHash: "hash", failedLoginCount: 0, lockedUntil: null }, user }),
      recordStaffLoginFailure: vi.fn(),
      resetStaffLoginFailures: vi.fn(),
      hashPassword: vi.fn().mockResolvedValue("unused"),
      verifyPassword: vi.fn().mockResolvedValue(true),
      now: () => new Date("2026-09-02T00:00:00Z"),
    };
    const result = await authenticateStaffWithPassword({ email: " ROHAN@INNCLUSIVE.COM ", password: "a long operations passphrase" }, dependencies);
    expect(result).toEqual(user);
    expect(dependencies.findStaffCredentialByEmail).toHaveBeenCalledWith("rohan@innclusive.com");
    expect(dependencies.resetStaffLoginFailures).toHaveBeenCalledWith(3);
  });

  it("keeps failures generic and locks the credential after the fifth unsuccessful attempt", async () => {
    const dependencies = {
      ensureInitialStaffAdmin: vi.fn(),
      findStaffCredentialByEmail: vi.fn().mockResolvedValue({ credential: { id: 3, email: "rohan@innclusive.com", passwordHash: "hash", failedLoginCount: 4, lockedUntil: null }, user }),
      recordStaffLoginFailure: vi.fn(),
      resetStaffLoginFailures: vi.fn(),
      hashPassword: vi.fn().mockResolvedValue("unused"),
      verifyPassword: vi.fn().mockResolvedValue(false),
      now: () => new Date("2026-09-02T00:00:00Z"),
    };
    await expect(authenticateStaffWithPassword({ email: "rohan@innclusive.com", password: "an incorrect password" }, dependencies)).resolves.toBeNull();
    expect(dependencies.recordStaffLoginFailure).toHaveBeenCalledWith(3, new Date("2026-09-02T00:15:00Z"), 5);
  });
});
