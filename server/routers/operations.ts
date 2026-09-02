import { listOperationsBookings, updateBookingForOperations } from "../db";
import { operationsBookingUpdateSchema } from "../bookingSchemas";
import { adminProcedure, router } from "../_core/trpc";

export const operationsRouter = router({
  overview: adminProcedure.query(async () => {
    const bookings = await listOperationsBookings();
    return {
      bookings,
      counts: {
        all: bookings.length,
        needsAttention: bookings.filter(item => item.booking.status === "requested" && !item.booking.providerName).length,
        unassigned: bookings.filter(item => !item.booking.providerName && item.booking.status !== "completed" && item.booking.status !== "cancelled").length,
        scheduled: bookings.filter(item => item.booking.status === "scheduled").length,
        inProgress: bookings.filter(item => item.booking.status === "in_progress").length,
      },
    };
  }),
  update: adminProcedure.input(operationsBookingUpdateSchema).mutation(async ({ input }) => {
    const bookings = await updateBookingForOperations(input);
    if (!bookings) throw new Error("Booking not found");
    return bookings;
  }),
});
