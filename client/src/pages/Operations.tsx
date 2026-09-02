/** Staff-only Good Joe Operations: genuine booking records, assignment, and workflow updates. */
import { trpc } from "@/lib/trpc";
import { AlertTriangle, CalendarDays, ChevronRight, CircleDollarSign, ClipboardList, LoaderCircle, LogOut, UserRoundCheck, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import "./portal.css";
import "./staffLogin.css";

const statusLabel: Record<string, string> = { requested: "Needs attention", scheduled: "Scheduled", in_progress: "In progress", completed: "Completed", cancelled: "Cancelled" };
function dateLabel(value: Date | null) { return value ? new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value)) : "Timing unconfirmed"; }
function currency(cents: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100); }

function StaffLogin() {
  const utils = trpc.useUtils();
  const login = trpc.staff.login.useMutation({ onSuccess: () => utils.staff.me.invalidate() });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return <main className="account-gate">
    <a className="portal-wordmark inverse" href="/">GOOD JOE <small>OPERATIONS</small></a>
    <div className="account-gate-card">
      <div className="portal-icon"><CircleDollarSign /></div>
      <div className="portal-eyebrow">Restricted workspace</div>
      <h1>Operations stays with your team.</h1>
      <p>Use your approved Good Joe Operations email and password.</p>
      <form className="ops-login-form" onSubmit={event => { event.preventDefault(); login.mutate({ email, password }); }}>
        <label><span>Work email</span><input type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} required /></label>
        <label><span>Password</span><input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} minLength={15} required /></label>
        {login.isError && <p role="alert">Your email or password could not be verified. Please try again.</p>}
        <button className="portal-primary" type="submit" disabled={login.isPending}>{login.isPending ? "Signing in…" : <>Sign in to Operations <ChevronRight /></>}</button>
      </form>
    </div>
  </main>;
}

export default function Operations() {
  const utils = trpc.useUtils();
  const staffSession = trpc.staff.me.useQuery();
  const logout = trpc.staff.logout.useMutation({ onSuccess: () => utils.staff.me.invalidate() });
  const overview = trpc.operations.overview.useQuery(undefined, { enabled: staffSession.data?.role === "admin" });
  const update = trpc.operations.update.useMutation({ onSuccess: () => utils.operations.overview.invalidate() });
  const [filter, setFilter] = useState<"all" | "attention" | "unassigned" | "scheduled" | "progress">("all");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [providerName, setProviderName] = useState("");
  const [providerEta, setProviderEta] = useState("");
  const records = overview.data?.bookings ?? [];
  const filtered = useMemo(() => records.filter(item => filter === "all" || filter === "attention" && item.booking.status === "requested" && !item.booking.providerName || filter === "unassigned" && !item.booking.providerName && !["completed", "cancelled"].includes(item.booking.status) || filter === "scheduled" && item.booking.status === "scheduled" || filter === "progress" && item.booking.status === "in_progress"), [filter, records]);
  const selected = filtered.find(item => item.booking.bookingCode === selectedCode) ?? filtered[0] ?? null;
  useEffect(() => { if (selected && selected.booking.bookingCode !== selectedCode) setSelectedCode(selected.booking.bookingCode); }, [selected, selectedCode]);
  useEffect(() => { setProviderName(selected?.booking.providerName ?? ""); setProviderEta(selected?.booking.providerEta ?? ""); }, [selected?.booking.id]);

  if (staffSession.isLoading) return <main className="portal-loading">Loading Good Joe Operations…</main>;
  if (!staffSession.data) return <StaffLogin />;
  if (staffSession.data.role !== "admin") return <main className="account-gate"><a className="portal-wordmark inverse" href="/">GOOD JOE <small>OPERATIONS</small></a><div className="account-gate-card"><div className="portal-icon"><AlertTriangle /></div><div className="portal-eyebrow">Access restricted</div><h1>This workspace is for Good Joe staff.</h1><p>This staff session is not authorised for Operations.</p></div></main>;

  const counts = overview.data?.counts ?? { all: 0, needsAttention: 0, unassigned: 0, scheduled: 0, inProgress: 0 };
  const stats = [{ key: "attention" as const, label: "Needs attention", value: counts.needsAttention, icon: AlertTriangle }, { key: "unassigned" as const, label: "Unassigned", value: counts.unassigned, icon: Users }, { key: "scheduled" as const, label: "Scheduled", value: counts.scheduled, icon: CalendarDays }, { key: "progress" as const, label: "In progress", value: counts.inProgress, icon: LoaderCircle }, { key: "all" as const, label: "All jobs", value: counts.all, icon: ClipboardList }];
  return <main className="ops-shell"><header className="ops-topbar"><a className="ops-brand" href="/"><span>☺</span><b>GOOD JOE</b><small>OPERATIONS</small></a><div><button onClick={() => logout.mutate()} aria-label="Sign out"><LogOut /></button></div></header><section className="ops-body"><div className="ops-intro"><div><div className="portal-eyebrow">LIVE ACCOUNT DATA</div><h1>Your operations, in focus.</h1><p>Booking records appear here after customers create an account and save their requests.</p></div><a className="ops-new" href="/">+ New request</a></div><div className="ops-stats">{stats.map(stat => <button className={filter === stat.key ? "active" : ""} key={stat.key} onClick={() => setFilter(stat.key)}><stat.icon /><span>{stat.label}</span><strong>{stat.value}</strong></button>)}</div>{overview.isLoading ? <div className="ops-loading">Loading current booking records…</div> : <div className="ops-grid"><section className="ops-queue"><header><div><span>JOB QUEUE</span><h2>{filter === "all" ? "All jobs" : statusLabel[filter === "attention" ? "requested" : filter === "progress" ? "in_progress" : filter]}</h2></div><span>{filtered.length} shown</span></header>{filtered.length === 0 ? <div className="ops-empty"><ClipboardList /><h3>No bookings here yet.</h3><p>New Good Joe customer requests will appear in this queue.</p></div> : filtered.map(item => <button className={selected?.booking.id === item.booking.id ? "ops-job active" : "ops-job"} key={item.booking.id} onClick={() => setSelectedCode(item.booking.bookingCode)}><div><span>{item.booking.service} · {item.booking.bookingCode}</span><strong>{item.booking.title}</strong><p>{item.customerName || "Customer"} · {dateLabel(item.booking.scheduledFor)}</p></div><div><em className={`status-pill status-${item.booking.status}`}>{statusLabel[item.booking.status]}</em><b>{currency(item.booking.quotedCents)}</b></div></button>)}</section><section className="ops-detail">{selected ? <><header className="ops-detail-header"><div><span>JOB {selected.booking.bookingCode} · {selected.booking.service}</span><h2>{selected.booking.title}</h2><p>{selected.customerName || "Customer account"}{selected.customerEmail ? ` · ${selected.customerEmail}` : ""}<br />{selected.booking.address || "Address not collected"} · {dateLabel(selected.booking.scheduledFor)}</p></div><em className={`status-pill status-${selected.booking.status}`}>{statusLabel[selected.booking.status]}</em></header><div className="ops-detail-grid"><article><span>CUSTOMER REQUEST</span><p>“{selected.booking.customerRequest}”</p></article><article><span>GOOD JOE STATUS</span><p>{selected.booking.providerName ? `${selected.booking.providerName} is assigned${selected.booking.providerEta ? ` · ${selected.booking.providerEta}` : ""}.` : "No provider has been assigned yet."}</p></article></div><div className="ops-money"><article><span>CUSTOMER TOTAL</span><strong>{currency(selected.booking.quotedCents)}</strong></article><article><span>PAYMENT</span><strong>{selected.booking.paymentStatus === "pending" ? "Pending" : selected.booking.paymentStatus}</strong></article><article><span>ASSIGNMENT</span><strong>{selected.booking.providerName ? "Assigned" : "Open"}</strong></article></div><div className="ops-assignment"><div><span>GOOD JOE PRO</span><strong>{selected.booking.providerName || "No one assigned yet"}</strong><p>{selected.booking.providerEta || "Set a provider and arrival note when ready."}</p></div><div><input value={providerName} onChange={event => setProviderName(event.target.value)} placeholder="Provider name" /><input value={providerEta} onChange={event => setProviderEta(event.target.value)} placeholder="ETA or note" /><button onClick={() => update.mutate({ bookingId: selected.booking.id, providerName: providerName || null, providerEta: providerEta || null })} disabled={update.isPending}><UserRoundCheck /> Save assignment</button></div></div><div className="ops-status-actions"><span>UPDATE WORKFLOW</span><div>{(["requested", "scheduled", "in_progress", "completed"] as const).map(status => <button key={status} className={selected.booking.status === status ? "selected" : ""} disabled={update.isPending} onClick={() => update.mutate({ bookingId: selected.booking.id, status })}>{status === "in_progress" ? "In progress" : status.charAt(0).toUpperCase() + status.slice(1)}</button>)}</div></div><div className="ops-timeline"><span>TIMELINE</span>{selected.events.map(event => <div key={event.id}><i /><p><strong>{event.title}</strong>{event.detail && <small>{event.detail}</small>}</p><time>{new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(event.createdAt))}</time></div>)}</div></> : <div className="ops-empty ops-detail-empty"><CircleDollarSign /><h3>Select a booking to work with it.</h3><p>Customer requests, timing, assignment and status updates stay together here.</p></div>}</section></div>}</section></main>;
}
