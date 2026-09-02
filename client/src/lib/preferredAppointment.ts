export type AppointmentWindow = {
  id: "morning" | "midday" | "afternoon" | "evening";
  label: string;
  detail: string;
  startHour: number;
};

export const appointmentWindows: AppointmentWindow[] = [
  { id: "morning", label: "Morning", detail: "8:00–11:00 AM", startHour: 8 },
  { id: "midday", label: "Midday", detail: "11:00 AM–2:00 PM", startHour: 11 },
  { id: "afternoon", label: "Afternoon", detail: "2:00–5:00 PM", startHour: 14 },
  { id: "evening", label: "Evening", detail: "5:00–7:00 PM", startHour: 17 },
];

function calendarDate(year: number, month: number, day: number) {
  return new Date(year, month, day, 12, 0, 0, 0);
}

export function startOfCalendarDay(value: Date) {
  return calendarDate(value.getFullYear(), value.getMonth(), value.getDate());
}

export function firstBookableDate(now = new Date()) {
  const nextDay = startOfCalendarDay(now);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay;
}

export function lastBookableDate(now = new Date()) {
  const lastDay = firstBookableDate(now);
  lastDay.setDate(lastDay.getDate() + 55);
  return lastDay;
}

export function isBookablePreferredDate(date: Date, now = new Date()) {
  const candidate = startOfCalendarDay(date).getTime();
  return candidate >= firstBookableDate(now).getTime() && candidate <= lastBookableDate(now).getTime();
}

export function getCalendarGrid(month: Date) {
  const firstDay = calendarDate(month.getFullYear(), month.getMonth(), 1);
  const gridStart = new Date(firstDay);
  gridStart.setDate(gridStart.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
}

export function isSameCalendarDate(first: Date | null, second: Date | null) {
  if (!first || !second) return false;
  return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
}

export function formatPreferredDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(date);
}

export function formatPreferredAppointment(date: Date, window: AppointmentWindow) {
  return `${formatPreferredDate(date)} · ${window.label} (${window.detail})`;
}

/** Stores the selected local window as a real UTC instant, while the display remains local to the customer. */
export function selectedAppointmentStart(date: Date, window: AppointmentWindow) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), window.startHour, 0, 0, 0);
}
