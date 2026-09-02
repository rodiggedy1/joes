import { describe, expect, it } from "vitest";
import { appointmentWindows, firstBookableDate, formatPreferredAppointment, getCalendarGrid, isBookablePreferredDate, selectedAppointmentStart } from "./preferredAppointment";

describe("preferred appointment calendar", () => {
  const now = new Date(2026, 8, 1, 9, 0, 0);

  it("allows tomorrow through the bounded preferred-appointment horizon but not today or dates beyond it", () => {
    expect(isBookablePreferredDate(new Date(2026, 8, 1), now)).toBe(false);
    expect(isBookablePreferredDate(firstBookableDate(now), now)).toBe(true);
    expect(isBookablePreferredDate(new Date(2026, 9, 27), now)).toBe(true);
    expect(isBookablePreferredDate(new Date(2026, 9, 28), now)).toBe(false);
  });

  it("builds a six-week calendar grid and retains the selected time window in the persisted instant", () => {
    const grid = getCalendarGrid(new Date(2026, 8, 1));
    const appointment = selectedAppointmentStart(new Date(2026, 8, 10), appointmentWindows[2]);
    expect(grid).toHaveLength(42);
    expect(grid[0]?.getDay()).toBe(0);
    expect(appointment.getHours()).toBe(14);
    expect(formatPreferredAppointment(new Date(2026, 8, 10), appointmentWindows[2])).toContain("Afternoon");
  });
});
