/**
 * Design reference: faithful React transcription of the user-supplied Joe's Home Services demo.
 * Preserve the warm paper canvas, charcoal utility typography, lime actions, and AI booking flow.
 */
import { FormEvent, useEffect, useRef, useState } from "react";

type Quote = { service: string; price: number; time: string; detail: string };
type ChatMessage = { kind: "intro"; text: string } | { kind: "user"; text: string; id: number } | { kind: "quote"; quote: Quote; id: number };

const initialMessage: ChatMessage = { kind: "intro", text: "Hey! 👋 Tell me what you need done. I can check pricing and availability right here." };

function classify(text: string): Quote {
  const lower = text.toLowerCase();
  if (lower.includes("tv")) return { service: "TV mounting", price: 149, time: "Tomorrow · 1:00 PM", detail: "Up to 65 inches · customer-provided mount" };
  if (lower.includes("handyman") || lower.includes("repair")) return { service: "Handyman visit", price: 179, time: "Saturday · 9:30 AM", detail: "2-hour service window" };
  if (lower.includes("move")) return { service: "Move-out cleaning", price: 289, time: "Tomorrow · 9–11 AM", detail: "3 bed · 2 bath · supplies included" };
  if (lower.includes("deep")) return { service: "Deep house cleaning", price: 249, time: "Tomorrow · 9–11 AM", detail: "3 bed · 2 bath · supplies included" };
  return { service: "Home cleaning", price: 189, time: "Tomorrow · 1–3 PM", detail: "Standard service · supplies included" };
}

const serviceCards = [
  ["🧹", "House cleaning", "Routine care, deeper resets, and move-day cleaning."],
  ["🔨", "Handyman", "Fixes, punch lists, hanging, patching, and installations."],
  ["📺", "TV mounting", "Screen mounting, soundbars, and cleaner cable setups."],
  ["🪑", "Furniture assembly", "Beds, desks, shelving, and just-delivered furniture."],
  ["🌿", "Lawn & yard care", "Mowing, trimming, cleanup, and simple outdoor upkeep."],
  ["🚚", "Moving help", "Loading, unloading, and in-home furniture moving."],
];

const categories = ["Carpet cleaning", "Window cleaning", "Interior painting", "Gutter cleaning", "Appliance help", "Pest control", "Plumbing", "Electrical", "HVAC", "Smart home setup", "Pool care", "Garage door"];

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [embedInput, setEmbedInput] = useState("");
  const [pageInput, setPageInput] = useState("");
  const [pageQuote, setPageQuote] = useState<Quote | null>(null);
  const [pageReserved, setPageReserved] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [bookedQuotes, setBookedQuotes] = useState<number[]>([]);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(1);

  useEffect(() => { if (chatOpen) window.setTimeout(() => chatInputRef.current?.focus(), 0); }, [chatOpen]);
  useEffect(() => { if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight; }, [messages]);
  useEffect(() => {
    const requestedService = new URLSearchParams(window.location.search).get("service");
    if (!requestedService) return;
    setChatOpen(true);
    setChatInput(`I need help with ${requestedService}.`);
    window.history.replaceState(null, "", "/");
  }, []);

  function nextId() { const id = messageIdRef.current; messageIdRef.current += 1; return id; }
  function openChat(prefill = "") { setChatOpen(true); if (prefill) setChatInput(prefill); }
  function appendQuote(text: string) { setMessages((current) => [...current, { kind: "quote", quote: classify(text), id: nextId() }]); }
  function addUser(text: string) { setMessages((current) => [...current, { kind: "user", text, id: nextId() }]); }

  function submitChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
    addUser(text);
    setChatInput("");
    window.setTimeout(() => appendQuote(text), 250);
  }

  function askEmbedded() {
    const text = embedInput.trim();
    if (!text) return;
    openChat();
    addUser(text);
    appendQuote(text);
  }

  function askBookingPage() {
    const text = pageInput.trim();
    if (!text) return;
    setPageQuote(classify(text));
    setPageReserved(false);
  }

  return (
    <>
      <div className="site">
        <header>
          <div className="brand"><div className="logo">J</div><div><strong>Joe&apos;s Home Services</strong><small>Cleaning · Handyman · Home Care</small></div></div>
          <div className="nav"><a href="/services">Services</a><span>Reviews</span><span>About</span></div>
          <button className="btn" onClick={() => openChat()}>Book now</button>
        </header>
        <section className="hero">
          <div className="hero-copy">
            <div className="pill">Home help, made clearer</div>
            <h1>Your home,<br />handled.</h1>
            <p>Describe the job once. We&apos;ll help turn it into a clear request, a useful scope, and the next step when you&apos;re ready.</p>
            <div className="actions"><button className="btn" onClick={() => openChat()}>Describe your job ✨</button><a className="btn secondary" href="/services">Browse services</a></div>
            <div className="trust hero-trust"><span><b>01</b> Describe it naturally</span><span><b>02</b> Clarify the details</span><span><b>03</b> Choose your next step</span></div>
          </div>
          <div className="embed">
            <div className="eyebrow">Start with the job</div><h2>What needs doing?</h2><p>Skip the long form. Describe it in your own words.</p>
            <textarea value={embedInput} onChange={(event) => setEmbedInput(event.target.value)} className="inputbox" placeholder="Example: I need a deep clean for my 3 bedroom house tomorrow morning..." />
            <button className="btn wide" onClick={askEmbedded}>Turn this into a request →</button>
            <div className="chips"><button className="chip" onClick={() => setEmbedInput("Deep clean my 3 bedroom house tomorrow morning")}>Deep cleaning</button><button className="chip" onClick={() => setEmbedInput("Mount my 65 inch TV tomorrow")}>TV mounting</button><button className="chip" onClick={() => setEmbedInput("I need a handyman Saturday morning")}>Handyman</button></div>
          </div>
        </section>
        <section className="home-story"><div className="story-image"><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/BClOvCghntZBcfpv.jpg" alt="A bright, neatly reset living room" /></div><div className="story-copy"><div className="eyebrow">A home that feels lighter</div><h2>The best help removes more than a task.</h2><p>Start with what is getting in your way. Cleaning, repairs, setup, or an entire moving-day list—we&apos;ll help make the request clear.</p><button className="text-action" onClick={() => openChat("I need help getting my home back in order.")}>Describe your list <b>→</b></button></div></section>
        <section className="services-intro" id="services"><div><div className="eyebrow">Start where it feels closest</div><h2>Three good ways to get momentum.</h2></div><p>Choose a familiar outcome, then tell us the detail that makes the job yours. Every path still starts with a simple request.</p></section>
        <section className="featured-services">
          <article className="feature-card feature-reset"><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/BClOvCghntZBcfpv.jpg" alt="A warm, professionally reset living room" /><div><div className="eyebrow">01 · Reset the home</div><h3>Bring the room back to calm.</h3><p>Regular cleaning, deeper resets, and move-day care shaped around your space.</p><button className="text-action" onClick={() => openChat("I need help with home cleaning.")}>Explore cleaning <b>→</b></button></div></article>
          <article className="feature-card feature-fix"><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/EuEtqbnSdvkPYbHT.jpg" alt="A technician carefully aligning a shelf" /><div><div className="eyebrow">02 · Fix the list</div><h3>Small jobs deserve a clear finish.</h3><p>From hardware and hanging to patching and punch lists, start with what needs attention.</p><button className="text-action" onClick={() => openChat("I need help with a home repair.")}>Explore handyman help <b>→</b></button></div></article>
          <article className="feature-card feature-setup"><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/OJVsFGkNGMJxOPzJ.jpg" alt="A finished television installation in a warm living room" /><div><div className="eyebrow">03 · Set up the room</div><h3>Make the space work the way you planned.</h3><p>TV mounting, furniture assembly, and the practical finishing details that make home easier.</p><button className="text-action" onClick={() => openChat("I need help setting up a room.")}>Explore setup help <b>→</b></button></div></article>
        </section>
        <section className="directory-shortcut">{serviceCards.map(([icon, title, copy]) => <a href={`/services`} className="service" key={title}><span className="arrow">↗</span><div className="icon">{icon}</div><h3>{title}</h3><p>{copy}</p></a>)}<a className="directory-link" href="/services"><span>Full service directory</span><b>Browse all services →</b></a></section>
        <section className="booking-journey"><div className="journey-heading"><div className="eyebrow">One request. A clearer path.</div><h2>Here&apos;s what happens after you press send.</h2><p>No service menus to decode. No repeat explanation. Just the information needed to move the job forward.</p></div><div className="journey-example"><div className="request-line"><span>Your words</span><strong>“I need a TV mounted in my living room.”</strong></div><div className="journey-arrow">↓</div><div className="journey-result"><span>Clearer request</span><strong>TV mounting</strong><p>Room details, screen size, and the right next step—kept in one conversation.</p></div><button className="btn" onClick={() => openChat("I need a TV mounted in my living room.")}>Start your request →</button></div></section>
        <section className="coverage"><div className="coverage-head"><div><div className="eyebrow">The rest of the list</div><h2>There&apos;s more where that came from.</h2></div><p>For specific jobs, browse the full directory. For the hard-to-name ones, start by explaining what is happening.</p></div><div className="category-pills">{categories.map((category) => <a href="/services" key={category}>{category}</a>)}<span className="more">+ something else</span></div></section>
        <section className="final-cta"><div><div className="eyebrow">When you&apos;re ready</div><h2>What&apos;s on your list?</h2><p>Write it the way you&apos;d say it. We&apos;ll help turn it into a useful request.</p></div><button className="btn" onClick={() => openChat()}>Describe your job ✨</button></section>
        <footer><div className="brand"><div className="logo">J</div><strong>Joe&apos;s Home Services</strong></div><span>Cleaning · Handyman · Home Care</span><span>Request-first booking</span></footer>
      </div>
      <div className="note">Demo prototype · pricing, availability and payment details are simulated.</div>
      <button className="float" onClick={() => openChat()}><span>✨</span> Book with AI</button>
      <div className={`chat${chatOpen ? " open" : ""}`}>
        <div className="chat-head"><div className="agent"><div className="spark">✨</div><div><strong>Joe&apos;s AI</strong><div className="online"><b>●</b> Ready to book</div></div></div><button className="x" aria-label="Close chat" onClick={() => setChatOpen(false)}>×</button></div>
        <div className="messages" ref={messagesRef}>{messages.map((message) => {
          if (message.kind === "intro") return <div className="bubble ai" key="intro">{message.text}</div>;
          if (message.kind === "user") return <div className="bubble user" key={message.id}>{message.text}</div>;
          const held = bookedQuotes.includes(message.id);
          return <div key={message.id}><div className="bubble ai">I found an opening that matches what you asked for.</div><div className="quote"><div className="eyebrow">Available</div><div className="quote-top"><div><strong>{message.quote.service}</strong><div className="quote-detail">{message.quote.detail}</div></div><div className="price">${message.quote.price}</div></div><div className="slot">📅 {message.quote.time}</div><button className="btn wide" disabled={held} onClick={() => setBookedQuotes((current) => [...current, message.id])}>{held ? "✓ Time held — next: details" : `Continue — $${message.quote.price}`}</button></div></div>;
        })}</div>
        <form className="chat-form" onSubmit={submitChat}><input ref={chatInputRef} value={chatInput} onChange={(event) => setChatInput(event.target.value)} className="chat-input" placeholder="Tell me what you need..." /><button className="send" aria-label="Send request">↑</button></form>
      </div>
      <div className={`modal${modalOpen ? " open" : ""}`} onClick={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
        <div className="booking-page"><div className="book-top"><div className="brand"><div className="logo">J</div><strong>Joe&apos;s Home Services</strong></div><button className="btn secondary" onClick={() => setModalOpen(false)}>Back to website</button></div><div className="center"><div className="spark">✨</div><h2>What do you need done?</h2><p>Tell me in your own words. I&apos;ll take care of the rest.</p><textarea value={pageInput} onChange={(event) => setPageInput(event.target.value)} className="inputbox" placeholder="I need..." /><button className="btn wide" onClick={askBookingPage}>Get price &amp; availability →</button>{pageQuote && <div className="result show"><div className="quote"><div className="eyebrow">Best available option</div><div className="quote-top"><div><strong className="page-service">{pageQuote.service}</strong><div className="page-detail">{pageQuote.time}<br />{pageQuote.detail}</div></div><div className="price">${pageQuote.price}</div></div><button className="btn wide" disabled={pageReserved} onClick={() => setPageReserved(true)}>{pageReserved ? "✓ Reserved — next: payment" : "Book this time →"}</button></div></div>}<p className="secure-note">Private request &nbsp; · &nbsp; Review before you book</p></div></div>
      </div>
    </>
  );
}
