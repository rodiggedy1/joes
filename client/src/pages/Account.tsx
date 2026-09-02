/** Customer-facing Good Joe account: private booking history, timing, and safe request actions. */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Armchair, ArrowRight, CalendarClock, ChevronRight, ClipboardList, CreditCard, ImageIcon, LampDesk, LogOut, MapPin, MessageCircle, PaintRoller, Plus, ShieldCheck, Sparkles, Trash2, Truck, Tv, Waves, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import "./portal.css";
import "./accountDiscovery.css";

const statusCopy: Record<string, string> = { requested: "Request received", scheduled: "Scheduled", in_progress: "In progress", completed: "Completed", cancelled: "Cancelled" };
function formatDate(value: Date | null) { return value ? new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value)) : "Timing to be confirmed"; }
function currency(cents: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100); }

const additionalServices = [
  { label: "Furniture assembly", description: "Beds, desks & more", icon: Armchair, request: "furniture assembly", tone: "" },
  { label: "Picture hanging", description: "Art, mirrors & shelves", icon: ImageIcon, request: "picture hanging", tone: "" },
  { label: "Minor home repairs", description: "Small fixes around the house", icon: Wrench, request: "minor home repairs", tone: "" },
  { label: "Cleaning", description: "One-time or recurring", icon: Sparkles, request: "home cleaning", tone: "cleaning" },
  { label: "TV mounting", description: "Screens, soundbars & setup", icon: Tv, request: "TV mounting", tone: "" },
  { label: "Plumbing help", description: "Faucets, drains & toilets", icon: Wrench, request: "plumbing help", tone: "" },
  { label: "Electrical & lighting", description: "Fixtures, switches & fans", icon: LampDesk, request: "electrical lighting", tone: "" },
  { label: "Interior painting", description: "Accent walls & rooms", icon: PaintRoller, request: "interior painting", tone: "" },
  { label: "Moving help", description: "Loading, lifting & unloading", icon: Truck, request: "moving help", tone: "" },
  { label: "Lawn & yard care", description: "Mowing, trimming & cleanup", icon: Waves, request: "lawn yard care", tone: "" },
  { label: "Junk removal", description: "Hauling & cleanouts", icon: Trash2, request: "junk removal", tone: "" },
  { label: "Pressure washing", description: "Patios, driveways & walks", icon: Waves, request: "pressure washing", tone: "" },
];

export default function Account() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const utils = trpc.useUtils();
  const [expandedBookingId, setExpandedBookingId] = useState<number | null>(null);
  const bookingsQuery = trpc.bookings.mine.useQuery(undefined, { enabled: isAuthenticated });
  const reschedule = trpc.bookings.requestReschedule.useMutation({ onSuccess: () => utils.bookings.mine.invalidate() });
  const cancel = trpc.bookings.cancel.useMutation({ onSuccess: () => utils.bookings.mine.invalidate() });
  const bookings = bookingsQuery.data ?? [];
  const nextBooking = useMemo(() => bookings.find(item => ["requested", "scheduled", "in_progress"].includes(item.booking.status)), [bookings]);

  if (loading) return <main className="portal-loading">Loading your Good Joe account…</main>;
  if (!isAuthenticated) return <main className="account-gate"><a className="portal-wordmark" href="/">GOOD JOE</a><div className="account-gate-card"><div className="portal-icon"><ShieldCheck /></div><div className="portal-eyebrow">Your Good Joe account</div><h1>Every home job, in one calm place.</h1><p>Your account opens automatically when you complete a booking. For now, return on the same device to keep your request, timing, and updates together.</p><a className="portal-primary" href="/">Book a service <ChevronRight /></a><a href="/">Back to Good Joe</a></div></main>;

  return <main className="portal-shell account-shell">
    <style>{`.details-chevron{transition:transform .18s cubic-bezier(.23,1,.32,1)}.details-chevron.open{transform:rotate(90deg)}.booking-details{border-top:1px solid #e8e3da;background:#fff}.booking-details-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.7fr);gap:26px;padding:21px 24px 17px}.booking-details-head span{display:block;color:#65764c;font-size:10px;font-weight:850;letter-spacing:.1em}.booking-details-head h4{margin:5px 0 0;font-size:17px;letter-spacing:-.04em}.booking-details-head>p{margin:0;color:#4f504a;font-size:13px;line-height:1.55}.booking-event-list{padding:0 24px 22px}.booking-event{display:grid;grid-template-columns:8px minmax(0,1fr) auto;gap:10px;padding:11px 0;border-top:1px solid #eee9df}.booking-event i{width:8px;height:8px;margin-top:4px;border-radius:50%;background:#536b4b}.booking-event strong{display:block;font-size:13px}.booking-event p{margin:3px 0 0;color:#77776e;font-size:12px;line-height:1.45}.booking-event time{color:#77776e;font-size:11px;white-space:nowrap}.booking-event-empty{margin:0;padding-top:14px;border-top:1px solid #eee9df;color:#77776e;font-size:13px}@media(max-width:700px){.booking-details-head{grid-template-columns:1fr;gap:11px;padding:18px}.booking-event-list{padding:0 18px 18px}.booking-event{grid-template-columns:8px 1fr}.booking-event time{grid-column:2;font-size:10px}}`}</style>
    <header className="portal-topbar"><a className="portal-wordmark" href="/">GOOD JOE</a><nav><a href="/">Home</a><a className="active" href="/account">My bookings</a>{user?.role === "admin" && <a href="/operations">Operations</a>}</nav><div className="portal-profile"><span>{user?.name?.split(" ")[0] || "My account"}</span><button onClick={logout} aria-label="Sign out"><LogOut /></button></div></header>
    <section className="account-hero"><div><div className="portal-eyebrow">MY HOME · GOOD JOE</div><h1>Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.</h1><p>Your home requests, timing, and updates are all here.</p></div><a className="portal-primary" href="/"><Plus /> Start a new request</a></section>
    <section className="account-summary">{[{ label: "Active bookings", value: bookings.filter(item => !["completed", "cancelled"].includes(item.booking.status)).length, icon: ClipboardList }, { label: "Next visit", value: nextBooking ? formatDate(nextBooking.booking.scheduledFor).split(",")[0] : "—", icon: CalendarClock }, { label: "Account access", value: user?.loginMethod === "booking_browser" ? "This device" : "Secure", icon: ShieldCheck }].map(item => <div className="account-stat" key={item.label}><item.icon /><div><span>{item.label}</span><strong>{item.value}</strong></div></div>)}</section>
    <section className="account-discovery" aria-labelledby="account-discovery-heading"><div className="section-heading"><div><div className="portal-eyebrow">MORE JOE CAN HANDLE</div><h2 id="account-discovery-heading">What else can we take off your list?</h2></div></div><div className="account-discovery-grid">{additionalServices.map(service => <a className="account-discovery-card" href={`/?service=${encodeURIComponent(service.request)}`} key={service.label}><div className={`account-discovery-icon ${service.tone}`}><service.icon /></div><div className="account-discovery-copy"><strong>{service.label}</strong><p>{service.description}</p><span>Get started <ArrowRight /></span></div></a>)}</div></section>
    <section className="account-section"><div className="section-heading"><div><div className="portal-eyebrow">YOUR BOOKINGS</div><h2>Everything you’ve asked Joe to handle.</h2></div>{bookings.length > 0 && <span className="record-count">{bookings.length} {bookings.length === 1 ? "booking" : "bookings"}</span>}</div>{bookingsQuery.isLoading ? <div className="portal-empty"><Sparkles /><p>Loading your booking history…</p></div> : bookings.length === 0 ? <div className="portal-empty account-empty"><div className="portal-icon"><ClipboardList /></div><h3>Your booking history starts here.</h3><p>When you book with Good Joe, the service, timing, and updates will appear in this account.</p><a className="portal-primary" href="/">Tell Joe what you need <ChevronRight /></a></div> : <div className="account-bookings">{bookings.map(({ booking, events }) => {
      const detailsOpen = expandedBookingId === booking.id;
      const isPendingConfirmation = booking.status === "requested";
      return <article className="account-booking" key={booking.id}>
        <div className="booking-card-top"><div><div className="booking-service">{booking.service}</div><h3>{booking.title}</h3><span className={`status-pill status-${booking.status}`}>{statusCopy[booking.status]}</span></div><div className="booking-price"><span>Starting at</span><strong>{currency(booking.quotedCents)}</strong></div></div>
        <div className="booking-grid"><div><CalendarClock /><span>{isPendingConfirmation ? "PREFERRED APPOINTMENT" : "WHEN"}</span><strong>{formatDate(booking.scheduledFor)}</strong><p>{isPendingConfirmation ? `${booking.timeWindow || "Your preferred time"} · awaiting confirmation` : booking.timeWindow || "We’ll confirm your service window soon."}</p></div><div><MapPin /><span>LOCATION</span><strong>{booking.address || "Address requested before arrival"}</strong><p>{booking.providerName ? `${booking.providerName} is assigned` : "Joe is matching the right professional."}</p></div><div><CreditCard /><span>PAYMENT</span><strong>{booking.paymentStatus === "paid" ? "Paid" : "No payment captured"}</strong><p>{booking.paymentStatus === "pending" ? "Prototype checkout is not a charge." : "Your receipt is kept with this booking."}</p></div></div>
        <div className="booking-card-bottom"><div className="booking-last-event"><span className="timeline-dot" />{events[0]?.title || "Booking saved"}</div><div className="booking-actions">{!["completed", "cancelled"].includes(booking.status) && <button onClick={() => reschedule.mutate({ bookingId: booking.id })} disabled={reschedule.isPending}>Request another time</button>}{!["completed", "cancelled"].includes(booking.status) && <button className="danger-link" onClick={() => cancel.mutate({ bookingId: booking.id })} disabled={cancel.isPending}>Cancel request</button>}<button type="button" aria-expanded={detailsOpen} aria-controls={`booking-${booking.bookingCode}`} onClick={() => setExpandedBookingId(detailsOpen ? null : booking.id)}>{detailsOpen ? "Hide details" : "Details"} <ChevronRight className={detailsOpen ? "details-chevron open" : "details-chevron"} /></button></div></div>
        {detailsOpen && <section className="booking-details" id={`booking-${booking.bookingCode}`}><div className="booking-details-head"><div><span>BOOKING {booking.bookingCode}</span><h4>Request timeline</h4></div><p>{booking.customerRequest}</p></div><div className="booking-event-list">{events.length ? events.map(event => <div className="booking-event" key={event.id}><i /><div><strong>{event.title}</strong>{event.detail && <p>{event.detail}</p>}</div><time>{formatDate(event.createdAt)}</time></div>) : <p className="booking-event-empty">Updates will appear here as Good Joe prepares your service.</p>}</div></section>}
      </article>;
    })}</div>}</section>
    <section className="account-help"><div className="portal-icon"><MessageCircle /></div><div><h3>Need to change something?</h3><p>Ask Joe in plain language. Your account keeps the whole request together.</p></div><a href="/">Ask Joe <ChevronRight /></a></section>
  </main>;
}
