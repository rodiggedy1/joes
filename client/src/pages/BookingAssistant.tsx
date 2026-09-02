/** Good Joe booking assistant: conversational guidance with immediate account access. */
import { FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getBookingPrefill } from "@/lib/bookingPrefill";
import { appointmentWindows, formatPreferredAppointment, formatPreferredDate, selectedAppointmentStart, type AppointmentWindow } from "@/lib/preferredAppointment";
import { PreferredAppointmentCalendar } from "@/components/PreferredAppointmentCalendar";

type Field = { label: string; options: string[] };
type Flow = { service: string; matches: string[]; startingPrice: number; time: string; detail: string; payment: string; fields: Field[] };
type ChatMessage = { kind: "guide" | "user"; text: string; id: number; flow?: Flow };

const flows: Flow[] = [
  { service: "Home cleaning", matches: ["clean", "carpet", "airbnb"], startingPrice: 189, time: "Tomorrow · 1–3 PM", detail: "Supplies included", payment: "Pay at booking", fields: [{ label: "Cleaning type", options: ["Standard reset", "Deep clean", "Move-in / move-out"] }, { label: "Home size", options: ["Studio / 1 bed", "2–3 bedrooms", "4+ bedrooms"] }] },
  { service: "TV mounting", matches: ["tv", "television", "soundbar", "mount"], startingPrice: 149, time: "Tomorrow · 1:00 PM", detail: "Wall and mount details reviewed", payment: "Pay at booking", fields: [{ label: "TV size", options: ["Up to 43 inches", "44–65 inches", "Over 65 inches"] }, { label: "Wall mount", options: ["I have one", "I need one", "Not sure"] }] },
  { service: "Furniture assembly", matches: ["furniture", "assembly", "assemble", "bed", "desk", "dresser"], startingPrice: 129, time: "Tomorrow · 3:00 PM", detail: "Item count and setup location confirmed", payment: "Pay at booking", fields: [{ label: "Item type", options: ["Bed or bedroom piece", "Desk or workspace", "Storage or shelving"] }, { label: "Item count", options: ["One item", "Two or three", "Four or more"] }] },
  { service: "Handyman visit", matches: ["handyman", "repair", "hanging", "shelf", "patch", "drywall", "hardware", "fixing"], startingPrice: 179, time: "Saturday · 9:30 AM", detail: "Two-hour service window", payment: "Approve final scope before charge", fields: [{ label: "Job type", options: ["Small repair", "Hanging or mounting", "Patch, caulk, or touch-up"] }, { label: "Job count", options: ["One task", "A short list", "A few rooms’ worth"] }] },
  { service: "Plumbing help", matches: ["plumb", "faucet", "drain", "toilet", "leak", "sink"], startingPrice: 169, time: "Tomorrow · 10:00 AM", detail: "Diagnostic visit", payment: "Approve work after diagnosis", fields: [{ label: "Issue", options: ["Faucet or fixture", "Drain issue", "Toilet issue"] }, { label: "Urgency", options: ["Today if possible", "This week", "Not urgent"] }] },
  { service: "Electrical & lighting", matches: ["electrical", "light", "outlet", "fixture", "switch", "fan"], startingPrice: 159, time: "Thursday · 2:00 PM", detail: "Installation details confirmed", payment: "Approve final scope before charge", fields: [{ label: "Project", options: ["Light fixture", "Outlet or switch", "Ceiling fan or device"] }, { label: "Equipment", options: ["I have it", "I need guidance", "Not sure"] }] },
  { service: "Interior painting", matches: ["paint", "painting", "wall color"], startingPrice: 219, time: "This week · Consultation", detail: "Written quote before payment", payment: "Quote first · no charge today", fields: [{ label: "Scope", options: ["Accent wall", "One room", "Multiple rooms"] }, { label: "Color", options: ["Chosen", "Need guidance", "Not yet chosen"] }] },
  { service: "Moving help", matches: ["move", "moving", "unload", "load", "couch", "truck"], startingPrice: 199, time: "Saturday · 11:00 AM", detail: "Two-person crew", payment: "Pay at booking", fields: [{ label: "Move size", options: ["A few items", "Studio / one room", "One to two rooms"] }, { label: "Help needed", options: ["Loading", "Unloading", "In-home moving"] }] },
  { service: "Lawn & yard care", matches: ["lawn", "yard", "mow", "trimming", "garden"], startingPrice: 99, time: "Friday · 9–11 AM", detail: "Routine yard visit", payment: "Pay at booking", fields: [{ label: "Service", options: ["Mowing", "Trimming", "Seasonal cleanup"] }, { label: "Yard size", options: ["Small", "Medium", "Large"] }] },
  { service: "Junk removal", matches: ["junk", "haul", "appliance", "garage", "couch"], startingPrice: 139, time: "Tomorrow · 4–6 PM", detail: "Final volume confirmed before pickup", payment: "Approve final volume before charge", fields: [{ label: "Load size", options: ["A few items", "Half a truck", "A full truck"] }, { label: "Item location", options: ["Curbside", "Garage / ground floor", "Upstairs"] }] },
  { service: "Pressure washing", matches: ["pressure", "driveway", "patio", "siding", "walkway"], startingPrice: 149, time: "Friday · 1–3 PM", detail: "Surface and access reviewed", payment: "Pay at booking", fields: [{ label: "Surface", options: ["Driveway", "Patio or deck", "Siding or walkway"] }, { label: "Area size", options: ["Small", "Medium", "Large"] }] },
];

const guideIntro = "Hey! I can answer questions about services, timing, and how booking works. When you’re ready, I’ll open the right booking form.";
function findFlow(text: string) { const query = text.toLowerCase(); return flows.find(flow => flow.matches.some(match => query.includes(match))); }
function replyFor(text: string, flow?: Flow) { if (flow) return `${flow.service} starts at $${flow.startingPrice}. ${flow.detail}. Ask anything, or book when you’re ready.`; if (/(insured|insurance)/.test(text.toLowerCase())) return "Before taking payment live, you’ll want to publish verified coverage details and terms here."; return "I can help you think through the job, explain the booking process, or open the right service form when you’re ready."; }

export default function BookingAssistant({ open, requestText, onClose }: { open: boolean; requestText: string; onClose: () => void }) {
  const { isAuthenticated, user } = useAuth();
  const utils = trpc.useUtils();
  const bookingHistory = trpc.bookings.mine.useQuery(undefined, { enabled: isAuthenticated, staleTime: 60_000 });
  const messagesRef = useRef<HTMLDivElement>(null);
  const messageId = useRef(1);
  const [entry, setEntry] = useState("");
  const [selectedFlow, setSelectedFlow] = useState<Flow>(flows[0]);
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
    const flow = findFlow(text);
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
  const ready = selectedFlow.fields.every(field => answers[field.label]) && preferredDate && preferredWindow && answers.Address && (isAuthenticated || (answers.Name && answers.Phone));
  const payload = () => ({
    service: selectedFlow.service,
    title: `${selectedFlow.service} request`,
    customerRequest: `${selectedFlow.fields.map(field => `${field.label}: ${answers[field.label]}`).join(" · ")}. Preferred appointment: ${selectedAppointment}.`,
    timeWindow: selectedAppointment || null,
    scheduledFor: preferredDate && preferredWindow ? selectedAppointmentStart(preferredDate, preferredWindow) : null,
    address: answers.Address,
    quotedCents: selectedFlow.startingPrice * 100,
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
            {selectedFlow.fields.map(field => <label key={field.label}><span>{field.label}</span><select value={answers[field.label] ?? ""} onChange={event => setAnswers({ ...answers, [field.label]: event.target.value })}><option value="">Choose one</option>{field.options.map(option => <option key={option}>{option}</option>)}</select></label>)}
            <label className="booking-address"><span>Service address</span><input value={answers.Address ?? ""} onChange={event => setAnswers({ ...answers, Address: event.target.value })} autoComplete="street-address" placeholder="Street address" /></label>
            <div className="appointment-field"><div className="appointment-field-head"><span>Preferred appointment</span><small>We’ll confirm this window before dispatch.</small></div><PreferredAppointmentCalendar value={preferredDate} onChange={date => { setPreferredDate(date); setReviewed(false); }} /><div className="appointment-window-grid" role="group" aria-label="Choose a preferred time window">{appointmentWindows.map(window => <button type="button" key={window.id} className={preferredWindow?.id === window.id ? "selected" : ""} onClick={() => { setPreferredWindow(window); setReviewed(false); }} aria-pressed={preferredWindow?.id === window.id}><strong>{window.label}</strong><span>{window.detail}</span></button>)}</div>{preferredDate && <p className="appointment-selection">Preferred: <strong>{formatPreferredDate(preferredDate)}{preferredWindow ? ` · ${preferredWindow.label}` : ""}</strong></p>}</div>
            {!isAuthenticated && <><label><span>Your name</span><input value={answers.Name ?? ""} onChange={event => setAnswers({ ...answers, Name: event.target.value })} autoComplete="name" placeholder="Name" /></label><label><span>Mobile number</span><input type="tel" value={answers.Phone ?? ""} onChange={event => setAnswers({ ...answers, Phone: event.target.value })} autoComplete="tel" inputMode="tel" placeholder="(555) 555-5555" /></label></>}
          </div>
          {isAuthenticated && <p className="checkout-note">Booking to <strong>{user?.name || "your Good Joe account"}</strong>. Your saved details are ready; you can update the service address for this visit.</p>}
          {reviewed && <div className="checkout-summary"><div><span>Preferred appointment</span><strong>{selectedAppointment}</strong></div>{selectedFlow.fields.map(field => <div key={field.label}><span>{field.label}</span><strong>{answers[field.label]}</strong></div>)}</div>}
          <div className="checkout-total"><span>Starting at</span><strong>${selectedFlow.startingPrice}</strong><small>{selectedFlow.payment}</small></div>
          {reviewed ? <button className="btn wide" type="button" onClick={save} disabled={saving}>{saving ? "Saving your booking…" : "Book & open my account →"}</button> : <button className="btn wide" disabled={!ready}>Review booking →</button>}
          {!isAuthenticated && <p className="checkout-note">Your booking opens your Good Joe account immediately. Your selected appointment is a preference until Good Joe confirms it.</p>}
          {bookingError && <p className="checkout-error">We couldn’t save this booking. Please try again.</p>}
        </form>
      </aside>
    </div>
  </>;
}
