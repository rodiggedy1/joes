import { describe, expect, it } from "vitest";
import { bookableServiceNames } from "./bookableServices";
import { bookingPriceRules, calculateBookingEstimate } from "./bookingPricing";

describe("Good Joe scope-based booking estimates", () => {
  it("keeps a published base estimate for every supported service", () => {
    expect(Object.keys(bookingPriceRules).sort()).toEqual([...bookableServiceNames].sort());
    for (const service of bookableServiceNames) {
      expect(calculateBookingEstimate(service, {}).estimatedCents).toBe(bookingPriceRules[service].baseCents);
    }
  });

  it("adds disclosed scope adjustments to a normal customer estimate", () => {
    const estimate = calculateBookingEstimate("TV mounting", {
      "TV count": "Two TVs",
      "TV size": "44–65 inches",
      "Wall & mount": "Drywall and I need a mount",
    });
    expect(estimate.estimatedCents).toBe(32_800);
    expect(estimate.requiresReview).toBe(false);
    expect(estimate.lineItems.map(item => item.label)).toEqual(["One TV on standard drywall", "Two TVs", "44–65 inches", "Drywall and I need a mount"]);
  });

  it("calculates labor-only moving by helpers and hours without implying a truck is included", () => {
    const estimate = calculateBookingEstimate("Moving help", {
      "Help needed": "Load my truck",
      Helpers: "Two helpers",
      Duration: "Three hours",
      "Move size": "Studio / one room",
    });
    expect(estimate.estimatedCents).toBe(59_500);
    expect(estimate.requiresReview).toBe(false);
  });

  it("keeps complex painting and licensed-work scope in review instead of representing it as a final price", () => {
    const painting = calculateBookingEstimate("Interior painting", {
      "Project type": "Room or multiple rooms",
      "Paint & prep": "Patching, prep, or wallpaper removal",
      Access: "High access or furniture moving",
    });
    const electrical = calculateBookingEstimate("Electrical & lighting", {
      Project: "Light fixture",
      "Item count": "One item",
      Access: "New wiring or panel work",
    });
    expect(painting.estimatedCents).toBe(19_900);
    expect(painting.requiresReview).toBe(true);
    expect(electrical.estimatedCents).toBe(14_900);
    expect(electrical.requiresReview).toBe(true);
  });
});
