import { TRPCError } from "@trpc/server";
import { cancelBookingForCustomer, createBookingForCustomer, getBookingForCustomer, listBookingsForCustomer, requestRescheduleForCustomer } from "../db";
import { createBookingSchema } from "../bookingSchemas";
import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { calculateBookingEstimate } from "../../shared/bookingPricing";

export const bookingsRouter = router({
  mine: protectedProcedure.query(({ ctx }) => listBookingsForCustomer(ctx.user.id)),
  byId: protectedProcedure.input(z.object({ bookingId: z.number().int().positive() })).query(async ({ ctx, input }) => {
    const booking = await getBookingForCustomer(ctx.user.id, input.bookingId);
    if (!booking) throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
    return booking;
  }),
  create: protectedProcedure.input(createBookingSchema).mutation(({ ctx, input }) => {
    const estimate = calculateBookingEstimate(input.service, input.scopeSelections);
    return createBookingForCustomer(ctx.user.id, {
      ...input,
      quotedCents: estimate.estimatedCents,
      estimateRequiresReview: estimate.requiresReview,
    });
  }),
  requestReschedule: protectedProcedure.input(z.object({ bookingId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const booking = await requestRescheduleForCustomer(ctx.user.id, input.bookingId);
    if (!booking) throw new TRPCError({ code: "NOT_FOUND", message: "This booking cannot be rescheduled" });
    return booking;
  }),
  cancel: protectedProcedure.input(z.object({ bookingId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const booking = await cancelBookingForCustomer(ctx.user.id, input.bookingId);
    if (!booking) throw new TRPCError({ code: "NOT_FOUND", message: "This booking cannot be cancelled" });
    return booking;
  }),
});
