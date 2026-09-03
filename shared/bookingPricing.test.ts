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
      Helpers: "2 helpers",
      Duration: "3 hours",
      "Certificate of insurance": "No",
      "Boxes or materials": "No",
      "Building access": "Ground floor / easy access",
    });
    expect(estimate.estimatedCents).toBe(59_500);
    expect(estimate.requiresReview).toBe(false);
  });

  it("prices the refined Handy-structured count and duration inputs without changing published minimums", () => {
    const furniture = calculateBookingEstimate("Furniture assembly", {
      "Small item count": "2–3",
      "Medium item count": "0",
      "Large item count": "0",
      "Planned service time": "2 hours",
      "Additional purchase or haul": "No",
    });
    const cleaning = calculateBookingEstimate("Home cleaning", {
      Bedrooms: "2 bedrooms",
      Bathrooms: "2 bathrooms",
      "Planned service time": "3.5 hours",
      "Cleaning type": "Standard reset",
    });
    const hanging = calculateBookingEstimate("Picture hanging", {
      "Small item count": "3–5",
      "Large or heavy item count": "0",
      "Shelves to install": "No",
      "Ladder height": "6 ft ladder",
      "Planned service time": "2 hours",
    });
    const handyman = calculateBookingEstimate("Handyman visit", {
      "What needs help?": "Rehang a loose cabinet door.",
      "How many tasks?": "Two or three tasks",
      "Parts or hardware": "I have them",
      "Planned service time": "2.5 hours",
    });
    const electrical = calculateBookingEstimate("Electrical & lighting", {
      "Light fixtures": "2",
      "Dimmers or switches": "0",
      "Ceiling fans": "0",
      "Ladder height": "No ladder",
      "Wiring access": "Existing wiring is accessible",
      "Planned service time": "2 hours",
    });

    expect(furniture.estimatedCents).toBe(16_900);
    expect(cleaning.estimatedCents).toBe(23_900);
    expect(hanging.estimatedCents).toBe(16_900);
    expect(handyman.estimatedCents).toBe(22_900);
    expect(electrical.estimatedCents).toBe(21_900);
    expect([furniture, cleaning, hanging, handyman, electrical].every(estimate => !estimate.requiresReview)).toBe(true);
  });

  it("keeps complex painting and licensed-work scope in review instead of representing it as a final price", () => {
    const painting = calculateBookingEstimate("Interior painting", {
      "Project type": "Room or multiple rooms",
      "Paint & prep": "Patching, prep, or wallpaper removal",
      Access: "High access or furniture moving",
    });
    const electrical = calculateBookingEstimate("Electrical & lighting", {
      "Light fixtures": "1",
      "Dimmers or switches": "0",
      "Ceiling fans": "0",
      "Ladder height": "No ladder",
      "Wiring access": "New wiring or panel work",
      "Planned service time": "2 hours",
    });
    expect(painting.estimatedCents).toBe(19_900);
    expect(painting.requiresReview).toBe(true);
    expect(electrical.estimatedCents).toBe(14_900);
    expect(electrical.requiresReview).toBe(true);
  });
});
