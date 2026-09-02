import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { firstBookableDate, getCalendarGrid, isBookablePreferredDate, isSameCalendarDate } from "@/lib/preferredAppointment";
import "./PreferredAppointmentCalendar.css";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type PreferredAppointmentCalendarProps = {
  value: Date | null;
  onChange: (date: Date) => void;
};

export function PreferredAppointmentCalendar({ value, onChange }: PreferredAppointmentCalendarProps) {
  const minimumDate = useMemo(() => firstBookableDate(), []);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(minimumDate.getFullYear(), minimumDate.getMonth(), 1));
  const grid = useMemo(() => getCalendarGrid(visibleMonth), [visibleMonth]);
  const previousMonth = () => setVisibleMonth(current => new Date(current.getFullYear(), current.getMonth() - 1, 1));
  const nextMonth = () => setVisibleMonth(current => new Date(current.getFullYear(), current.getMonth() + 1, 1));
  const previousMonthEnd = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 0);

  return <section className="preferred-calendar" aria-label="Choose a preferred appointment date">
    <div className="preferred-calendar-head">
      <div><span>Choose a date</span><strong>{new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(visibleMonth)}</strong></div>
      <div className="preferred-calendar-nav"><button type="button" aria-label="Previous month" onClick={previousMonth} disabled={!isBookablePreferredDate(previousMonthEnd)}><ChevronLeft /></button><button type="button" aria-label="Next month" onClick={nextMonth}><ChevronRight /></button></div>
    </div>
    <div className="preferred-calendar-weekdays" aria-hidden="true">{weekdayLabels.map(day => <span key={day}>{day}</span>)}</div>
    <div className="preferred-calendar-grid">{grid.map(date => {
      const isOutsideMonth = date.getMonth() !== visibleMonth.getMonth();
      const isBookable = isBookablePreferredDate(date);
      const isSelected = isSameCalendarDate(value, date);
      return <button key={date.toISOString()} type="button" disabled={!isBookable} onClick={() => onChange(date)} className={`preferred-calendar-day${isOutsideMonth ? " outside" : ""}${isSelected ? " selected" : ""}`} aria-pressed={isSelected} aria-label={new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(date)}>{date.getDate()}</button>;
    })}</div>
  </section>;
}
