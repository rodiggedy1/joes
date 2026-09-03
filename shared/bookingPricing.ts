import type { BookableServiceName } from "./bookableServices";

export type ScopePriceAdjustment = {
  cents: number;
  requiresReview?: boolean;
};

export type BookingPriceRule = {
  baseCents: number;
  baseLabel: string;
  adjustments: Record<string, Record<string, ScopePriceAdjustment>>;
};

export type BookingEstimate = {
  estimatedCents: number;
  requiresReview: boolean;
  lineItems: Array<{ label: string; cents: number }>;
};

const rule = (baseCents: number, baseLabel: string, adjustments: BookingPriceRule["adjustments"]): BookingPriceRule => ({ baseCents, baseLabel, adjustments });

export const bookingPriceRules: Record<BookableServiceName, BookingPriceRule> = {
  "Home cleaning": rule(14_900, "Standard 1-bed / 1-bath clean", {
    "Cleaning type": { "Standard reset": { cents: 0 }, "Deep clean": { cents: 7_500 }, "Move-in / move-out": { cents: 12_500, requiresReview: true } },
    "Home size": { "Studio / 1 bed": { cents: 0 }, "2–3 bedrooms": { cents: 7_500 }, "4+ bedrooms": { cents: 15_000, requiresReview: true } },
    Bathrooms: { "One bathroom": { cents: 0 }, "Two bathrooms": { cents: 2_500 }, "Three or more": { cents: 5_000, requiresReview: true } },
  }),
  "TV mounting": rule(14_900, "One TV on standard drywall", {
    "TV count": { "One TV": { cents: 0 }, "Two TVs": { cents: 11_900 }, "Three or more": { cents: 23_800, requiresReview: true } },
    "TV size": { "Up to 43 inches": { cents: 0 }, "44–65 inches": { cents: 2_500 }, "Over 65 inches": { cents: 6_000, requiresReview: true } },
    "Wall & mount": { "Drywall and I have a mount": { cents: 0 }, "Drywall and I need a mount": { cents: 3_500 }, "Brick, stone, tile, or not sure": { cents: 9_000, requiresReview: true } },
  }),
  "Furniture assembly": rule(11_900, "One small or standard item", {
    "Item type": { "Bed or bedroom piece": { cents: 2_500 }, "Desk or workspace": { cents: 0 }, "Storage or shelving": { cents: 3_500 } },
    "Item size": { "Small / standard": { cents: 0 }, "Large or complex": { cents: 8_000 }, "Not sure": { cents: 5_000, requiresReview: true } },
    "Item count": { "One item": { cents: 0 }, "Two or three": { cents: 11_900 }, "Four or more": { cents: 23_800, requiresReview: true } },
  }),
  "Picture hanging": rule(9_900, "One small standard-height item", {
    "Items to hang": { "One small item": { cents: 0 }, "Two or three small items": { cents: 2_000 }, "Large or heavy item": { cents: 7_000, requiresReview: true } },
    "Wall type": { "Standard drywall": { cents: 0 }, "Plaster, brick, tile, or not sure": { cents: 6_000, requiresReview: true }, "I need the right hardware": { cents: 2_500 } },
    Access: { "Reachable from the floor": { cents: 0 }, "A ladder is needed": { cents: 4_000 }, "High ceiling or stairwell": { cents: 10_000, requiresReview: true } },
  }),
  "Minor home repairs": rule(12_900, "One small repair", {
    "Repair type": { "Door, drawer, or hardware": { cents: 0 }, "Patch, caulk, or touch-up": { cents: 2_000 }, "Small household fix": { cents: 1_500 } },
    "Task count": { "One repair": { cents: 0 }, "Two or three repairs": { cents: 6_500 }, "Several unrelated repairs": { cents: 15_000, requiresReview: true } },
    "Parts or hardware": { "I have them": { cents: 0 }, "I need guidance": { cents: 0, requiresReview: true }, "Not sure": { cents: 0, requiresReview: true } },
  }),
  "Handyman visit": rule(12_900, "Two-hour handyman visit", {
    "Job type": { "Small repair": { cents: 0 }, "Hanging or mounting": { cents: 0 }, "Patch, caulk, or touch-up": { cents: 2_000 } },
    "Job count": { "One task": { cents: 0 }, "A short list": { cents: 6_500 }, "Several unrelated jobs": { cents: 15_000, requiresReview: true } },
    "Parts or hardware": { "I have them": { cents: 0 }, "I need guidance": { cents: 0, requiresReview: true }, "Not sure": { cents: 0, requiresReview: true } },
  }),
  "Plumbing help": rule(15_900, "Minor diagnostic or repair visit", {
    Issue: { "Faucet or fixture": { cents: 0 }, "Drain issue": { cents: 3_000 }, "Toilet issue": { cents: 4_000 } },
    Access: { "Shutoff and plumbing are accessible": { cents: 0 }, "Access is limited": { cents: 3_500, requiresReview: true }, "Not sure": { cents: 0, requiresReview: true } },
    Urgency: { "Today if possible": { cents: 7_500, requiresReview: true }, "This week": { cents: 0 }, "Not urgent": { cents: 0 } },
  }),
  "Electrical & lighting": rule(14_900, "One existing-access fixture or switch", {
    Project: { "Light fixture": { cents: 0 }, "Outlet or switch": { cents: 0 }, "Ceiling fan or device": { cents: 5_000 } },
    "Item count": { "One item": { cents: 0 }, "Two items": { cents: 9_000 }, "Three or more": { cents: 18_000, requiresReview: true } },
    Access: { "Existing wiring is accessible": { cents: 0 }, "I need a ladder or am not sure": { cents: 5_000, requiresReview: true }, "New wiring or panel work": { cents: 0, requiresReview: true } },
  }),
  "Interior painting": rule(19_900, "Paint-ready touch-up or one accent wall", {
    "Project type": { "Touch-ups": { cents: 0 }, "One accent wall": { cents: 0 }, "Room or multiple rooms": { cents: 0, requiresReview: true } },
    "Paint & prep": { "Paint is ready and wall is sound": { cents: 0 }, "I need paint guidance": { cents: 0, requiresReview: true }, "Patching, prep, or wallpaper removal": { cents: 0, requiresReview: true } },
    Access: { "Standard wall height": { cents: 0 }, "Ceiling or trim included": { cents: 0, requiresReview: true }, "High access or furniture moving": { cents: 0, requiresReview: true } },
  }),
  "Moving help": rule(23_800, "One helper for two hours · no truck", {
    "Help needed": { "Load my truck": { cents: 0 }, "Unload my truck": { cents: 0 }, "Move items inside my home": { cents: 0 } },
    Helpers: { "One helper": { cents: 0 }, "Two helpers": { cents: 23_800 }, "Three helpers": { cents: 47_600, requiresReview: true } },
    Duration: { "Two hours": { cents: 0 }, "Three hours": { cents: 11_900 }, "Four or more hours": { cents: 23_800, requiresReview: true } },
    "Move size": { "A few items": { cents: 0 }, "Studio / one room": { cents: 0 }, "One to two rooms": { cents: 0, requiresReview: true } },
  }),
  "Lawn & yard care": rule(4_900, "Small maintained lawn · mow, edge, and blow", {
    "Yard size": { Small: { cents: 0 }, Medium: { cents: 2_500 }, Large: { cents: 6_000, requiresReview: true } },
    Service: { "Mow, edge, and blow": { cents: 0 }, "Trimming or weeding": { cents: 4_000 }, "Seasonal cleanup": { cents: 7_500, requiresReview: true } },
    Condition: { "Regularly maintained": { cents: 0 }, Overgrown: { cents: 5_000, requiresReview: true }, "Not sure": { cents: 0, requiresReview: true } },
  }),
  "Junk removal": rule(12_900, "Small curbside pickup", {
    "Load size": { "A few items / one-eighth truck": { cents: 0 }, "Quarter to half truck": { cents: 12_000 }, "More than half a truck": { cents: 25_000, requiresReview: true } },
    "Pickup location": { Curbside: { cents: 0 }, "Garage / ground floor": { cents: 2_500 }, "Stairs or elevator": { cents: 6_000 } },
    Items: { "Household items": { cents: 0 }, "Furniture or mattress": { cents: 3_500 }, "Appliance, electronics, or other": { cents: 0, requiresReview: true } },
  }),
  "Pressure washing": rule(9_900, "Small ground-level patio or walkway", {
    Area: { "Patio or walkway": { cents: 0 }, Driveway: { cents: 5_000 }, "Siding, deck, or porch": { cents: 8_000, requiresReview: true } },
    Size: { Small: { cents: 0 }, Medium: { cents: 5_000 }, "Large or multiple areas": { cents: 12_000, requiresReview: true } },
    Access: { "Ground level with outdoor water": { cents: 0 }, "No outdoor water": { cents: 4_000, requiresReview: true }, "Two stories, roof, or delicate surface": { cents: 0, requiresReview: true } },
  }),
};

export function calculateBookingEstimate(service: BookableServiceName, selections: Record<string, string>): BookingEstimate {
  const priceRule = bookingPriceRules[service];
  const lineItems: BookingEstimate["lineItems"] = [{ label: priceRule.baseLabel, cents: priceRule.baseCents }];
  let estimatedCents = priceRule.baseCents;
  let requiresReview = false;

  for (const [field, selection] of Object.entries(selections)) {
    const adjustment = priceRule.adjustments[field]?.[selection];
    if (!adjustment) continue;
    estimatedCents += adjustment.cents;
    requiresReview ||= Boolean(adjustment.requiresReview);
    if (adjustment.cents) lineItems.push({ label: selection, cents: adjustment.cents });
  }

  return { estimatedCents, requiresReview, lineItems };
}
