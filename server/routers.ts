import { COOKIE_NAME } from "@shared/const";
import { instantBookingSchema } from "./bookingSchemas";
import { createBookingForCustomer, createBrowserBookingAccount } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import { bookAndStartAccount } from "./instantBookingAccount";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
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
  bookings: bookingsRouter,
  operations: operationsRouter,
});

export type AppRouter = typeof appRouter;
