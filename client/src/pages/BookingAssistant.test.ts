import { describe, expect, it } from "vitest";
import { bookingFlows, findBookingFlow } from "./BookingAssistant";

describe("Good Joe booking price book", () => {
  it("maps an Interior Painting request to the approved $199 small-project entry", () => {
    const flow = findBookingFlow("I need one accent wall painted");

    expect(flow).toMatchObject({
      service: "Interior painting",
      startingPrice: 199,
      detail: "Paint-ready touch-up or one standard accent wall",
    });
    expect(flow?.fields.map(field => field.label)).toEqual(["Project type", "Paint & prep", "Access"]);
  });

  it("maps moving requests to labor-only help with no truck", () => {
    const flow = findBookingFlow("I need help loading my truck");

    expect(flow).toMatchObject({
      service: "Moving help",
      startingPrice: 119,
      detail: "One helper per hour · two-hour minimum · no truck",
    });
    expect(flow?.fields.map(field => field.label)).toEqual(["Help needed", "Helpers", "Duration", "Move size"]);
  });

  it("keeps every approved service price and scope-choice set in the checkout catalog", () => {
    expect(bookingFlows.map(flow => ({
      service: flow.service,
      price: flow.startingPrice,
      fields: flow.fields.map(field => field.label),
    }))).toEqual([
      { service: "Home cleaning", price: 149, fields: ["Cleaning type", "Home size", "Bathrooms"] },
      { service: "TV mounting", price: 149, fields: ["TV count", "TV size", "Wall & mount"] },
      { service: "Furniture assembly", price: 119, fields: ["Item type", "Item size", "Item count"] },
      { service: "Picture hanging", price: 99, fields: ["Items to hang", "Wall type", "Access"] },
      { service: "Minor home repairs", price: 129, fields: ["Repair type", "Task count", "Parts or hardware"] },
      { service: "Handyman visit", price: 129, fields: ["Job type", "Job count", "Parts or hardware"] },
      { service: "Plumbing help", price: 159, fields: ["Issue", "Access", "Urgency"] },
      { service: "Electrical & lighting", price: 149, fields: ["Project", "Item count", "Access"] },
      { service: "Interior painting", price: 199, fields: ["Project type", "Paint & prep", "Access"] },
      { service: "Moving help", price: 119, fields: ["Help needed", "Helpers", "Duration", "Move size"] },
      { service: "Lawn & yard care", price: 49, fields: ["Yard size", "Service", "Condition"] },
      { service: "Junk removal", price: 129, fields: ["Load size", "Pickup location", "Items"] },
      { service: "Pressure washing", price: 99, fields: ["Area", "Size", "Access"] },
    ]);
  });

  it("resolves the account-card phrases to their distinct backend-supported flows", () => {
    expect(findBookingFlow("I need help with picture hanging.")?.service).toBe("Picture hanging");
    expect(findBookingFlow("I need help with minor home repairs.")?.service).toBe("Minor home repairs");
  });
});
