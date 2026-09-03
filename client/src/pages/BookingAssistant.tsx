/** Good Joe booking assistant: conversational guidance with immediate account access. */
import { FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getBookingPrefill } from "@/lib/bookingPrefill";
import { appointmentWindows, formatPreferredAppointment, formatPreferredDate, selectedAppointmentStart, type AppointmentWindow } from "@/lib/preferredAppointment";
import { PreferredAppointmentCalendar } from "@/components/PreferredAppointmentCalendar";
import type { BookableServiceName } from "@shared/bookableServices";
import { calculateBookingEstimate } from "@shared/bookingPricing";

type Field = { label: string; options?: string[]; type?: "select" | "text"; placeholder?: string };
type Flow = { service: BookableServiceName; matches: string[]; startingPrice: number; time: string; detail: string; payment: string; fields: Field[] };
type ChatMessage = { kind: "guide" | "user"; text: string; id: number; flow?: Flow };

export const bookingFlows: Flow[] = [
  { service: "Home cleaning", matches: ["clean", "carpet", "airbnb"], startingPrice: 149, time: "Tomorrow · 1–3 PM", detail: "Small-home standard clean", payment: "Final scope confirmed before payment", fields: [{ label: "Bedrooms", options: ["Studio / 1 bedroom", "2 bedrooms", "3 bedrooms", "4+ bedrooms"] }, { label: "Bathrooms", options: ["1 bathroom", "2 bathrooms", "3+ bathrooms"] }, { label: "Planned service time", options: ["3 hours", "3.5 hours", "4 hours", "4.5+ hours"] }, { label: "Cleaning type", options: ["Standard reset", "Deep clean", "Move-in / move-out"] }] },
  { service: "TV mounting", matches: ["tv", "television", "soundbar", "mount"], startingPrice: 149, time: "Tomorrow · 1:00 PM", detail: "One TV on a standard drywall wall", payment: "Final scope confirmed before payment", fields: [{ label: "TV count", options: ["One TV", "Two TVs", "Three or more"] }, { label: "TV size", options: ["Up to 43 inches", "44–65 inches", "Over 65 inches"] }, { label: "Wall & mount", options: ["Drywall and I have a mount", "Drywall and I need a mount", "Brick, stone, tile, or not sure"] }] },
  { service: "Furniture assembly", matches: ["furniture", "assembly", "assemble", "bed", "desk", "dresser"], startingPrice: 119, time: "Tomorrow · 3:00 PM", detail: "Small or standard item · two-hour minimum", payment: "Final scope confirmed before payment", fields: [{ label: "Small item count", options: ["0", "1", "2–3", "4+"] }, { label: "Medium item count", options: ["0", "1", "2–3", "4+"] }, { label: "Large item count", options: ["0", "1", "2+"] }, { label: "Planned service time", options: ["2 hours", "2.5 hours", "3 hours", "3.5+ hours"] }, { label: "Additional purchase or haul", options: ["No", "Yes"] }] },
  { service: "Picture hanging", matches: ["picture", "mirror", "frame", "artwork"], startingPrice: 99, time: "Tomorrow · 3:00 PM", detail: "Up to two small standard-height items", payment: "Final scope confirmed before payment", fields: [{ label: "Small item count", options: ["0", "1–2", "3–5", "6+"] }, { label: "Large or heavy item count", options: ["0", "1", "2+"] }, { label: "Shelves to install", options: ["No", "1 shelf", "2+ shelves"] }, { label: "Ladder height", options: ["No ladder", "6 ft ladder", "10 ft ladder"] }, { label: "Planned service time", options: ["2 hours", "2.5 hours", "3 hours", "3.5+ hours"] }] },
  { service: "Minor home repairs", matches: ["minor home repair", "minor repairs", "small home repair", "small repair"], startingPrice: 129, time: "Saturday · 9:30 AM", detail: "One small repair · two-hour service minimum", payment: "Final scope confirmed before payment", fields: [{ label: "Repair type", options: ["Door, drawer, or hardware", "Patch, caulk, or touch-up", "Small household fix"] }, { label: "Task count", options: ["One repair", "Two or three repairs", "Several unrelated repairs"] }, { label: "Parts or hardware", options: ["I have them", "I need guidance", "Not sure"] }] },
  { service: "Handyman visit", matches: ["handyman", "repair", "hanging", "shelf", "patch", "drywall", "hardware", "fixing"], startingPrice: 129, time: "Saturday · 9:30 AM", detail: "Small repair · two-hour service minimum", payment: "Final scope confirmed before payment", fields: [{ label: "What needs help?", type: "text", placeholder: "Describe the repair, install, or household task" }, { label: "How many tasks?", options: ["One task", "Two or three tasks", "Several unrelated tasks"] }, { label: "Parts or hardware", options: ["I have them", "I need guidance", "Not sure"] }, { label: "Planned service time", options: ["2 hours", "2.5 hours", "3 hours", "3.5+ hours"] }] },
  { service: "Plumbing help", matches: ["plumb", "faucet", "drain", "toilet", "leak", "sink"], startingPrice: 159, time: "Tomorrow · 10:00 AM", detail: "Minor diagnostic or repair visit", payment: "Final scope confirmed before payment", fields: [{ label: "Issue", options: ["Faucet or fixture", "Drain issue", "Toilet issue"] }, { label: "Access", options: ["Shutoff and plumbing are accessible", "Access is limited", "Not sure"] }, { label: "Urgency", options: ["Today if possible", "This week", "Not urgent"] }] },
  { service: "Electrical & lighting", matches: ["electrical", "light", "outlet", "fixture", "switch", "fan"], startingPrice: 149, time: "Thursday · 2:00 PM", detail: "One existing-access fixture or switch task", payment: "Final scope confirmed before payment", fields: [{ label: "Light fixtures", options: ["0", "1", "2", "3+"] }, { label: "Dimmers or switches", options: ["0", "1", "2", "3+"] }, { label: "Ceiling fans", options: ["0", "1", "2+"] }, { label: "Ladder height", options: ["No ladder", "6 ft ladder", "10 ft ladder"] }, { label: "Wiring access", options: ["Existing wiring is accessible", "Not sure", "New wiring or panel work"] }, { label: "Planned service time", options: ["2 hours", "2.5 hours", "3 hours", "3.5+ hours"] }] },
  { service: "Interior painting", matches: ["paint", "painting", "wall color"], startingPrice: 199, time: "This week · Consultation", detail: "Paint-ready touch-up or one standard accent wall", payment: "Final scope confirmed before payment", fields: [{ label: "Project type", options: ["Touch-ups", "One accent wall", "Room or multiple rooms"] }, { label: "Paint & prep", options: ["Paint is ready and wall is sound", "I need paint guidance", "Patching, prep, or wallpaper removal"] }, { label: "Access", options: ["Standard wall height", "Ceiling or trim included", "High access or furniture moving"] }] },
  { service: "Moving help", matches: ["move", "moving", "unload", "load", "couch", "truck"], startingPrice: 119, time: "Saturday · 11:00 AM", detail: "One helper per hour · two-hour minimum · no truck", payment: "Final scope confirmed before payment", fields: [{ label: "Help needed", options: ["Load my truck", "Unload my truck", "Move items inside my home"] }, { label: "Helpers", options: ["1 helper", "2 helpers", "3 helpers"] }, { label: "Duration", options: ["2 hours", "2.5 hours", "3 hours", "3.5+ hours"] }, { label: "Certificate of insurance", options: ["No", "Yes"] }, { label: "Boxes or materials", options: ["No", "Yes"] }, { label: "Building access", options: ["Ground floor / easy access", "Stairs or elevator", "Long carry or special item"] }] },
  { service: "Lawn & yard care", matches: ["lawn", "yard", "mow", "trimming", "garden"], startingPrice: 49, time: "Friday · 9–11 AM", detail: "Small maintained lawn · mow, edge, and blow", payment: "Final scope confirmed before payment", fields: [{ label: "Yard size", options: ["Small", "Medium", "Large"] }, { label: "Service", options: ["Mow, edge, and blow", "Trimming or weeding", "Seasonal cleanup"] }, { label: "Condition", options: ["Regularly maintained", "Overgrown", "Not sure"] }] },
  { service: "Junk removal", matches: ["junk", "haul", "appliance", "garage", "couch"], startingPrice: 129, time: "Tomorrow · 4–6 PM", detail: "Small curbside or one-eighth truckload pickup", payment: "Final scope confirmed before payment", fields: [{ label: "Load size", options: ["A few items / one-eighth truck", "Quarter to half truck", "More than half a truck"] }, { label: "Pickup location", options: ["Curbside", "Garage / ground floor", "Stairs or elevator"] }, { label: "Items", options: ["Household items", "Furniture or mattress", "Appliance, electronics, or other"] }] },
  { service: "Pressure washing", matches: ["pressure", "driveway", "patio", "siding", "walkway"], startingPrice: 99, time: "Friday · 1–3 PM", detail: "Small ground-level patio or walkway", payment: "Final scope confirmed before payment", fields: [{ label: "Area", options: ["Patio or walkway", "Driveway", "Siding, deck, or porch"] }, { label: "Size", options: ["Small", "Medium", "Large or multiple areas"] }, { label: "Access", options: ["Ground level with outdoor water", "No outdoor water", "Two stories, roof, or delicate surface"] }] },
];

const guideIntro = "Hey! I can answer questions about services, timing, and how booking works. When you’re ready, I’ll open the right booking form.";
export function findBookingFlow(text: string) { const query = text.toLowerCase(); return bookingFlows.find(flow => flow.matches.some(match => query.includes(match))); }
function replyFor(text: string, flow?: Flow) { if (flow) return `${flow.service} starts at $${flow.startingPrice}. ${flow.detail}. Ask anything, or book when you’re ready.`; if (/(insured|insurance)/.test(text.toLowerCase())) return "Before taking payment live, you’ll want to publish verified coverage details and terms here."; return "I can help you think through the job, explain the booking process, or open the right service form when you’re ready."; }

export default function BookingAssistant({ open, requestText, onClose }: { open: boolean; requestText: string; onClose: () => void }) {
  const { isAuthenticated, user } = useAuth();
  const utils = trpc.useUtils();
  const bookingHistory = trpc.bookings.mine.useQuery(undefined, { enabled: isAuthenticated, staleTime: 60_000 });
  const messagesRef = useRef<HTMLDivElement>(null);
  const messageId = useRef(1);
  const [entry, setEntry] = useState("");
  const [selectedFlow, setSelectedFlow] = useState<Flow>(bookingFlows[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([{ kind: "guide", text: guideIntro, id: 0 }]);
  const [formOpen, setFormOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reviewed, setReviewed] = useState(false);
  const [preferredDate, setPreferredDate] = useState<Date | null>(null);
  const [preferredWindow, setPreferredWindow] = useState<AppointmentWindow | null>(null);

  const finishBooking = async () => {
    await utils.auth.me.invalidate();
    await utils.bookings.mine.invalidate();
    window.location.assign("/account");
  };
  const createBooking = trpc.bookings.create.useMutation({ onSuccess: finishBooking });
  const bookAndStartAccount = trpc.auth.bookAndStartAccount.useMutation({ onSuccess: finishBooking });
  const saving = createBooking.isPending || bookAndStartAccount.isPending;
  const bookingError = createBooking.error || bookAndStartAccount.error;
  const savedBookingDetails = getBookingPrefill(user ?? null, bookingHistory.data ?? []);

  const nextId = () => messageId.current++;
  const beginConversation = (text: string) => {
    const flow = findBookingFlow(text);
    if (flow) setSelectedFlow(flow);
    setEntry("");
    setMessages([{ kind: "guide", text: guideIntro, id: 0 }, { kind: "user", text, id: nextId() }, { kind: "guide", text: replyFor(text, flow), id: nextId(), flow }]);
  };
  useEffect(() => {
    if (!open) return;
    setFormOpen(false);
    setReviewed(false);
    setAnswers({});
    setPreferredDate(null);
    setPreferredWindow(null);
    if (requestText) beginConversation(requestText);
    else setMessages([{ kind: "guide", text: guideIntro, id: 0 }]);
  }, [open, requestText]);
  useEffect(() => { if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight; }, [messages]);
  useEffect(() => {
    if (!formOpen || !isAuthenticated) return;
    setAnswers(current => ({
      ...current,
      Name: current.Name || savedBookingDetails.name,
      Phone: current.Phone || savedBookingDetails.phone,
      Address: current.Address || savedBookingDetails.address,
    }));
  }, [formOpen, isAuthenticated, savedBookingDetails.address, savedBookingDetails.name, savedBookingDetails.phone]);

  const openForm = (flow: Flow) => {
    setSelectedFlow(flow);
    setAnswers({});
    setReviewed(false);
    setPreferredDate(null);
    setPreferredWindow(null);
    setFormOpen(true);
  };
  const selectedAppointment = preferredDate && preferredWindow ? formatPreferredAppointment(preferredDate, preferredWindow) : "";
  const scopeSelections = Object.fromEntries(selectedFlow.fields.flatMap(field => answers[field.label] ? [[field.label, answers[field.label]]] : []));
  const estimate = calculateBookingEstimate(selectedFlow.service, scopeSelections);
  const ready = selectedFlow.fields.every(field => answers[field.label]) && preferredDate && preferredWindow && answers.Address && (isAuthenticated || (answers.Name && answers.Phone));
  const payload = () => ({
    service: selectedFlow.service,
    title: `${selectedFlow.service} request`,
    customerRequest: `${selectedFlow.fields.map(field => `${field.label}: ${answers[field.label]}`).join(" · ")}. Preferred appointment: ${selectedAppointment}.`,
    timeWindow: selectedAppointment || null,
    scheduledFor: preferredDate && preferredWindow ? selectedAppointmentStart(preferredDate, preferredWindow) : null,
    address: answers.Address,
    quotedCents: estimate.estimatedCents,
    scopeSelections,
  });
  const save = () => {
    const booking = payload();
    if (isAuthenticated) {
      createBooking.mutate(booking);
      return;
    }
    bookAndStartAccount.mutate({ ...booking, customerName: answers.Name, mobilePhone: answers.Phone });
  };

  return <>
    <div className={`chat${open ? " open" : ""}`}>
      <div className="chat-head"><div className="agent"><div className="spark">✨</div><div><strong>Good Joe Guide</strong><div className="online"><b>●</b> Here to help, not rush</div></div></div><button className="x" aria-label="Close chat" onClick={() => { setFormOpen(false); onClose(); }}>×</button></div>
      <div className="messages" ref={messagesRef}>{messages.map(message => message.kind === "user" ? <div className="bubble user" key={message.id}>{message.text}</div> : <div className="chat-guide" key={message.id}><div className="bubble ai">{message.text}</div>{message.flow && <button className="book-service-link" onClick={() => openForm(message.flow!)}>Book {message.flow.service} <span>→</span></button>}</div>)}</div>
      <form className="chat-form" onSubmit={(event: FormEvent) => { event.preventDefault(); if (entry.trim()) beginConversation(entry.trim()); }}><input className="chat-input" value={entry} onChange={event => setEntry(event.target.value)} placeholder="Ask a question or describe the job..." /><button className="send" aria-label="Send message">↑</button></form>
    </div>
    <div className={`checkout-scrim${formOpen ? " open" : ""}`} onClick={() => setFormOpen(false)}>
      <aside className="checkout-panel" aria-label="Booking form" onClick={event => event.stopPropagation()}>
        <div className="checkout-head"><div><div className="eyebrow">Book this service</div><h2>{selectedFlow.service}</h2></div><button className="x" onClick={() => setFormOpen(false)} aria-label="Close booking form">×</button></div>
        <div className="checkout-status"><span>1</span><b>Details</b><i /><span>2</span><b>Review</b><i /><span>3</span><b>My account</b></div>
        <form className="booking-form" onSubmit={event => { event.preventDefault(); if (ready) setReviewed(true); }}>
          <div className="booking-form-fields">
            {selectedFlow.fields.map(field => <label key={field.label}><span>{field.label}</span>{field.type === "text" ? <textarea className="booking-textarea" value={answers[field.label] ?? ""} onChange={event => setAnswers({ ...answers, [field.label]: event.target.value })} placeholder={field.placeholder} /> : <select value={answers[field.label] ?? ""} onChange={event => setAnswers({ ...answers, [field.label]: event.target.value })}><option value="">Choose one</option>{field.options?.map(option => <option key={option}>{option}</option>)}</select>}</label>)}
            <label className="booking-address"><span>Service address</span><input value={answers.Address ?? ""} onChange={event => setAnswers({ ...answers, Address: event.target.value })} autoComplete="street-address" placeholder="Street address" /></label>
            <div className="appointment-field"><div className="appointment-field-head"><span>Preferred appointment</span><small>We’ll confirm this window before dispatch.</small></div><PreferredAppointmentCalendar value={preferredDate} onChange={date => { setPreferredDate(date); setReviewed(false); }} /><div className="appointment-window-grid" role="group" aria-label="Choose a preferred time window">{appointmentWindows.map(window => <button type="button" key={window.id} className={preferredWindow?.id === window.id ? "selected" : ""} onClick={() => { setPreferredWindow(window); setReviewed(false); }} aria-pressed={preferredWindow?.id === window.id}><strong>{window.label}</strong><span>{window.detail}</span></button>)}</div>{preferredDate && <p className="appointment-selection">Preferred: <strong>{formatPreferredDate(preferredDate)}{preferredWindow ? ` · ${preferredWindow.label}` : ""}</strong></p>}</div>
            {!isAuthenticated && <><label><span>Your name</span><input value={answers.Name ?? ""} onChange={event => setAnswers({ ...answers, Name: event.target.value })} autoComplete="name" placeholder="Name" /></label><label><span>Mobile number</span><input type="tel" value={answers.Phone ?? ""} onChange={event => setAnswers({ ...answers, Phone: event.target.value })} autoComplete="tel" inputMode="tel" placeholder="(555) 555-5555" /></label></>}
          </div>
          {isAuthenticated && <p className="checkout-note">Booking to <strong>{user?.name || "your Good Joe account"}</strong>. Your saved details are ready; you can update the service address for this visit.</p>}
          {reviewed && <div className="checkout-summary"><div><span>Preferred appointment</span><strong>{selectedAppointment}</strong></div>{selectedFlow.fields.map(field => <div key={field.label}><span>{field.label}</span><strong>{answers[field.label]}</strong></div>)}</div>}
          <div className={`checkout-total ${estimate.requiresReview ? "needs-review" : ""}`}><span>{estimate.requiresReview ? "Estimate · review required" : "Estimated total"}</span><strong>${(estimate.estimatedCents / 100).toFixed(0)}</strong><small>{estimate.requiresReview ? "This scope needs a Good Joe review before a final price or appointment is confirmed." : "Based on your selected scope. Good Joe confirms the final price before payment."}</small>{estimate.lineItems.length > 1 && <div className="estimate-lines">{estimate.lineItems.slice(1).map(item => <span key={item.label}>{item.label}<b>+${(item.cents / 100).toFixed(0)}</b></span>)}</div>}</div>
          {reviewed ? <button className="btn wide" type="button" onClick={save} disabled={saving}>{saving ? "Saving your booking…" : "Book & open my account →"}</button> : <button className="btn wide" disabled={!ready}>Review booking →</button>}
          {!isAuthenticated && <p className="checkout-note">Your booking opens your Good Joe account immediately. Your selected appointment is a preference until Good Joe confirms it.</p>}
          {bookingError && <p className="checkout-error">We couldn’t save this booking. Please try again.</p>}
        </form>
      </aside>
    </div>
  </>;
}
