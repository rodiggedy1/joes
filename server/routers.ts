import { COOKIE_NAME, STAFF_COOKIE_NAME, STAFF_SESSION_MS } from "@shared/const";
import { instantBookingSchema, staffLoginSchema } from "./bookingSchemas";
import { createBookingForCustomer, createBrowserBookingAccount } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import { bookAndStartAccount } from "./instantBookingAccount";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { authenticateStaffWithPassword } from "./staffAuth";
import { bookingsRouter } from "./routers/bookings";
import { operationsRouter } from "./routers/operations";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    bookAndStartAccount: publicProcedure.input(instantBookingSchema).mutation(({ ctx, input }) => bookAndStartAccount(ctx, input, {
      createCustomer: createBrowserBookingAccount,
      createBooking: createBookingForCustomer,
      createSessionToken: sdk.createSessionToken.bind(sdk),
      cookieOptions: getSessionCookieOptions,
    })),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  staff: router({
    me: publicProcedure.query(opts => opts.ctx.staffUser),
    login: publicProcedure.input(staffLoginSchema).mutation(async ({ ctx, input }) => {
      const staffUser = await authenticateStaffWithPassword(input);
      if (!staffUser) throw new TRPCError({ code: "UNAUTHORIZED", message: "Your email or password could not be verified." });
      const token = await sdk.createSessionToken(staffUser.openId, { expiresInMs: STAFF_SESSION_MS, name: staffUser.name ?? "Good Joe Operations" });
      ctx.res.cookie(STAFF_COOKIE_NAME, token, { ...getSessionCookieOptions(ctx.req), maxAge: STAFF_SESSION_MS });
      return { success: true } as const;
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(STAFF_COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  bookings: bookingsRouter,
  operations: operationsRouter,
});

export type AppRouter = typeof appRouter;
