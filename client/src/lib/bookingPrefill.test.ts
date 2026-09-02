import { describe, expect, it } from "vitest";
import { getBookingPrefill } from "./bookingPrefill";

describe("getBookingPrefill", () => {
  it("uses the signed-in customer contact details and most recent usable booking address", () => {
    expect(getBookingPrefill(
      { name: "Taylor Jordan", phone: "+14155550123" },
      [{ booking: { address: "  " } }, { booking: { address: "123 Example Street" } }],
    )).toEqual({ name: "Taylor Jordan", phone: "+14155550123", address: "123 Example Street" });
  });

  it("keeps fields empty for a customer without saved profile or address data", () => {
    expect(getBookingPrefill(null, [])).toEqual({ name: "", phone: "", address: "" });
  });
});
