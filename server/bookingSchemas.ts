import { z } from "zod";

export const bookingStatusSchema = z.enum(["requested", "scheduled", "in_progress", "completed", "cancelled"]);

export const createBookingSchema = z.object({
  service: z.string().trim().min(2).max(120),
  title: z.string().trim().min(2).max(180),
  customerRequest: z.string().trim().min(2).max(2_000),
  timeWindow: z.string().trim().min(2).max(80).nullable().optional(),
  scheduledFor: z.date().nullable().optional(),
  address: z.string().trim().max(1_000).nullable().optional(),
  quotedCents: z.number().int().positive().max(5_000_000),
});

const mobilePhoneSchema = z.string().trim().refine(value => {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}, "Enter a valid mobile number");

export const instantBookingSchema = createBookingSchema.extend({
  customerName: z.string().trim().min(2).max(160),
  mobilePhone: mobilePhoneSchema,
});

export const operationsBookingUpdateSchema = z.object({
  bookingId: z.number().int().positive(),
  status: bookingStatusSchema.optional(),
  providerName: z.string().trim().min(2).max(160).nullable().optional(),
  providerEta: z.string().trim().min(2).max(80).nullable().optional(),
}).refine(input => input.status !== undefined || input.providerName !== undefined || input.providerEta !== undefined, {
  message: "Provide at least one booking update",
});
