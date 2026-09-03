import { describe, expect, it } from "vitest";
import { findBookingFlow } from "@/pages/BookingAssistant";
import { popularQuickRequests } from "./popularRequests";

describe("popularQuickRequests", () => {
  it("uses natural inserts that resolve to their supported Good Joe booking flows", () => {
    expect(popularQuickRequests).toHaveLength(12);

    for (const request of popularQuickRequests) {
      expect(findBookingFlow(request.message)?.service).toBe(request.service);
    }
  });
});
