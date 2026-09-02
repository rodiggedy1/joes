import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function contextFor(user: TrpcContext["user"]): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Good Joe portal access", () => {
  it("does not expose booking history to an unauthenticated caller", async () => {
    const caller = appRouter.createCaller(contextFor(null));
    await expect(caller.bookings.mine()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("does not expose the operations queue to a customer account", async () => {
    const caller = appRouter.createCaller(contextFor({
      id: 7,
      openId: "customer-user",
      name: "Customer",
      email: "customer@example.com",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }));
    await expect(caller.operations.overview()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("does not accept a customer-session admin role in place of a dedicated staff session", async () => {
    const caller = appRouter.createCaller(contextFor({
      id: 8,
      openId: "preview-admin",
      name: "Preview Admin",
      email: "admin@example.com",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }));
    await expect(caller.operations.overview()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
