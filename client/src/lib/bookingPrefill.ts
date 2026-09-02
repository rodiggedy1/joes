export type BookingPrefillUser = {
  name: string | null;
  phone: string | null;
} | null;

export type BookingPrefillHistory = Array<{
  booking: { address: string | null };
}>;

/**
 * Builds non-destructive defaults for a returning customer's next booking.
 * The caller only uses a value when the customer has not already typed one.
 */
export function getBookingPrefill(user: BookingPrefillUser, history: BookingPrefillHistory) {
  const mostRecentAddress = history.find(item => Boolean(item.booking.address?.trim()))?.booking.address?.trim();

  return {
    name: user?.name?.trim() || "",
    phone: user?.phone?.trim() || "",
    address: mostRecentAddress || "",
  };
}
