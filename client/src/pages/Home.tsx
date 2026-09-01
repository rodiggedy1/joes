/**
 * Design reference: Good House Co. keeps the original warm paper canvas, charcoal utility typography, lime actions, and AI booking flow.
 * Preserve the warm paper canvas, charcoal utility typography, lime actions, and AI booking flow.
 */
import { useEffect, useState } from "react";
import BookingAssistant from "./BookingAssistant";
import "./ServiceMoments.css";

type Quote = { service: string; price: number; time: string; detail: string };

function classify(text: string): Quote {
  const lower = text.toLowerCase();
  if (lower.includes("tv")) return { service: "TV mounting", price: 149, time: "Tomorrow · 1:00 PM", detail: "Up to 65 inches · customer-provided mount" };
  if (lower.includes("handyman") || lower.includes("repair")) return { service: "Handyman visit", price: 179, time: "Saturday · 9:30 AM", detail: "2-hour service window" };
  if (lower.includes("move")) return { service: "Move-out cleaning", price: 289, time: "Tomorrow · 9–11 AM", detail: "3 bed · 2 bath · supplies included" };
  if (lower.includes("deep")) return { service: "Deep house cleaning", price: 249, time: "Tomorrow · 9–11 AM", detail: "3 bed · 2 bath · supplies included" };
  return { service: "Home cleaning", price: 189, time: "Tomorrow · 1–3 PM", detail: "Standard service · supplies included" };
}

const serviceCards = [
  ["🧹", "House cleaning", "Standard, deep, move-in, move-out and recurring cleaning.", "home cleaning", "/services/cleaning"],
  ["🔨", "Handyman", "Small repairs, punch lists, hanging, patching and installations.", "a handyman repair", "/services/handyman"],
  ["📺", "TV mounting", "TVs, soundbars, shelves and clean cable-management setups.", "TV mounting"],
  ["🪑", "Furniture assembly", "Beds, desks, dressers, shelving and outdoor furniture.", "furniture assembly"],
  ["🌿", "Lawn & yard care", "Mowing, trimming, cleanup and routine outdoor maintenance.", "lawn and yard care"],
  ["🚚", "Moving help", "Loading, unloading, heavy lifting and in-home furniture moves.", "moving help"],
  ["🗑️", "Junk removal", "Furniture, appliances, garage cleanouts and unwanted items.", "junk removal"],
  ["💦", "Pressure washing", "Driveways, patios, walkways, siding and outdoor surfaces.", "pressure washing"],
];

const categories = ["Carpet cleaning", "Window cleaning", "Interior painting", "Gutter cleaning", "Appliance help", "Pest control", "Plumbing", "Electrical", "HVAC", "Smart home setup", "Pool care", "Garage door"];

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatRequest, setChatRequest] = useState("");
  const [embedInput, setEmbedInput] = useState("");
  const [pageInput, setPageInput] = useState("");
  const [pageQuote, setPageQuote] = useState<Quote | null>(null);
  const [pageReserved, setPageReserved] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  function openChat(prefill = "") { setChatRequest(prefill); setChatOpen(true); }
  useEffect(() => { const service = new URLSearchParams(window.location.search).get("service"); if (!service) return; openChat(`I need help with ${service}.`); window.history.replaceState(null, "", "/"); }, []);

  function askEmbedded() {
    const text = embedInput.trim();
    if (!text) return;
    openChat(text);
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
          <div className="brand"><div className="logo"><svg className="brand-symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3l8.5 7.5v10H3.5z" /><path className="brand-door" d="M9.25 20.5v-6h5.5v6z" /></svg></div><div><strong>Good House Co.</strong><small>The good kind of help for home</small></div></div>
          <div className="nav"><a href="/services">Services</a><span>Reviews</span><span>About</span></div>
          <button className="btn" onClick={() => openChat()}>Book now</button>
        </header>
        <section className="hero">
          <div>
            <div className="pill">★★★★★ 4.9 · 800+ happy customers</div>
            <h1>Your home,<br />handled.</h1>
            <p>Professional home help without the phone tag. Tell us what you need and Good House can price it, find a time, and get you booked.</p>
            <div className="actions"><button className="btn" onClick={() => openChat()}>Get price &amp; availability ✨</button><a className="btn secondary" href="/services">View services</a></div>
            <div className="trust"><span>✓ Insured professionals</span><span>✓ Easy rescheduling</span><span>✓ Secure payment</span></div>
          </div>
          <div className="embed">
            <div className="eyebrow">Option 2 · Good House Guide</div><h2>What can we help with?</h2><p>Ask a question or describe the job. When you&apos;re ready, the right booking form is one click away.</p>
            <textarea value={embedInput} onChange={(event) => setEmbedInput(event.target.value)} className="inputbox" placeholder="Example: I need a deep clean for my 3 bedroom house tomorrow morning..." />
            <button className="btn wide" onClick={askEmbedded}>Ask Good House →</button>
            <div className="chips"><button className="chip" onClick={() => setEmbedInput("Deep clean my 3 bedroom house tomorrow morning")}>Deep cleaning</button><button className="chip" onClick={() => setEmbedInput("Mount my 65 inch TV tomorrow")}>TV mounting</button><button className="chip" onClick={() => setEmbedInput("I need a handyman Saturday morning")}>Handyman</button></div>
          </div>
        </section>
        <section className="services-intro" id="services"><div className="eyebrow">Popular services</div><h2>One place for the jobs around your home.</h2><p>From recurring upkeep to the random thing that needs fixing today. Tell Good House what you need and we&apos;ll guide you from request to booked.</p></section>
        <section className="services">{serviceCards.map(([icon, title, copy, request, detailPath]) => detailPath ? <a className="service service-link" key={title} href={detailPath} aria-label={`Explore ${title}`}><span className="arrow">↗</span><span className="icon">{icon}</span><h3>{title}</h3><p>{copy}</p></a> : <button className="service service-link" key={title} onClick={() => openChat(`I need help with ${request}.`)} aria-label={`Book ${title}`}><span className="arrow">↗</span><span className="icon">{icon}</span><h3>{title}</h3><p>{copy}</p></button>)}</section>
        <section className="home-story-additive"><div className="home-story-image"><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/BClOvCghntZBcfpv.jpg" alt="A bright, neatly reset living room" /></div><div className="home-story-copy"><div className="eyebrow">A home that feels lighter</div><h2>The best help removes more than a task.</h2><p>Start with what is getting in your way. Cleaning, repairs, setup, or an entire moving-day list—we&apos;ll help make the request clear.</p><button className="story-action" onClick={() => openChat("I need help getting my home back in order.")}>Describe your list <b>→</b></button></div></section>
        <section className="anything"><div><div className="eyebrow">Don’t see it?</div><h3>Just ask. That’s the point.</h3><p>Describe the job in your own words. If it’s something we can get handled, Good House will take it from there.</p></div><button className="btn" onClick={() => openChat()}>Tell us what you need →</button></section>
        <section className="dedicated-strip"><div><div className="eyebrow">Option 3 · Dedicated booking page</div><h2>A booking link that goes anywhere.</h2><p>Use it in Google Business Profile, Instagram, SMS, ads, QR codes or email. The customer lands directly in the AI booking experience.</p></div><button className="btn secondary" onClick={() => setModalOpen(true)}>Open booking page →</button></section>
        <section className="experience"><div><div className="eyebrow">A better way to book</div><h2>No searching. No calling around. No quote chase.</h2><p>You shouldn’t need five tabs and three callbacks to get one thing done. Good House turns a simple request into a clear scope, an available time and a booking.</p><button className="btn try-button" onClick={() => openChat()}>Try it now ✨</button></div><div className="promise-list"><div className="promise"><div className="promise-num">1</div><div><strong>Say what you need</strong><span>Type naturally — “deep clean tomorrow,” “mount my 65-inch TV,” or “I need help moving a couch.”</span></div></div><div className="promise"><div className="promise-num">2</div><div><strong>Get a real path to booked</strong><span>We collect the details that matter, match the job and show the next available option.</span></div></div><div className="promise"><div className="promise-num">3</div><div><strong>One confirmation. Done.</strong><span>Review the scope, time and price in one place. Then book securely and get updates automatically.</span></div></div></div></section>
        <section className="booking-journey-additive"><div className="journey-intro"><div className="eyebrow">One request. A clearer path.</div><h2>Here&apos;s what happens after you press send.</h2><p>No service menus to decode. No repeat explanation. Just the information needed to move the job forward.</p></div><div className="journey-flow"><div className="journey-card"><span>Your words</span><strong>“I need a TV mounted in my living room.”</strong></div><div className="journey-arrow">↓</div><div className="journey-card"><span>Clearer request</span><strong>TV mounting</strong><p>Room details, screen size, and the right next step—kept in one conversation.</p></div><button className="btn" onClick={() => openChat("I need a TV mounted in my living room.")}>Start your request →</button></div></section>
        <section className="service-moments" aria-labelledby="service-moments-title">
          <div className="service-moments-head"><div className="eyebrow">The Good House approach</div><h2 id="service-moments-title">A little more order, before the work begins.</h2><p>This is what a well-shaped request looks like: one clear need, one useful next step, and less to keep in your head.</p></div>
          <div className="moment-stage">
            <article className="moment-card moment-card-left"><div className="moment-copy"><span>01 · Start simple</span><h3>Describe the moment that needs help.</h3><p>One sentence is plenty to begin.</p></div><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/BClOvCghntZBcfpv.jpg" alt="A calm, orderly living room" /></article>
            <article className="moment-card moment-card-center"><div className="moment-copy"><span>02 · Get oriented</span><h3>See the right next step.</h3><p>The guide keeps the details in one place.</p></div><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/EuEtqbnSdvkPYbHT.jpg" alt="A home repair detail" /></article>
            <article className="moment-card moment-card-right"><div className="moment-copy"><span>03 · Book when ready</span><h3>Open the form only when it helps.</h3><p>Choose a time once the job is clear.</p></div><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/OJVsFGkNGMJxOPzJ.jpg" alt="A finished television setup in a home" /></article>
            <div className="moment-fade" aria-hidden="true" />
          </div>
          <div className="moment-status"><span className="moment-status-dot" aria-hidden="true" /> <strong>Good House Guide</strong><span>Clarity first. Booking when you&apos;re ready.</span><button onClick={() => openChat()}>Ask a question <b>→</b></button></div>
        </section>
        <section className="coverage"><div className="coverage-head"><div><div className="eyebrow">More ways we can help</div><h2>Your home has a long to-do list.</h2></div><p>Good House is built around the way people actually ask for help — by describing the problem, not hunting through a directory.</p></div><div className="category-pills">{categories.map((category) => <span key={category}>{category}</span>)}<span className="more">+ whatever’s next</span></div></section>
        <section className="how" id="how"><div className="eyebrow">How it works</div><h2>From “I need help” to booked.</h2><div className="steps"><div><b>1</b><h3>Tell us what you need</h3><p>Describe the job naturally. The assistant turns it into a clear service request.</p></div><div><b>2</b><h3>Pick a real opening</h3><p>Choose from available dates and times — no phone tag or waiting for quotes.</p></div><div><b>3</b><h3>Confirm &amp; relax</h3><p>Review the scope and price, pay securely, and get updates through completion.</p></div></div></section>
        <section className="proof"><div><strong>4.9/5</strong><span>average rating</span></div><div><strong>800+</strong><span>happy customers</span></div><div><strong>60 sec</strong><span>typical booking time</span></div></section>
        <section className="final-cta"><div><div className="eyebrow">Ready when you are</div><h2>What do you need done?</h2><p>Skip the forms and phone calls. Tell the AI and get a price and available time.</p></div><button className="btn" onClick={() => openChat()}>Book with AI ✨</button></section>
        <footer><div className="brand"><div className="logo"><svg className="brand-symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3l8.5 7.5v10H3.5z" /><path className="brand-door" d="M9.25 20.5v-6h5.5v6z" /></svg></div><strong>Good House Co.</strong></div><span>The good kind of help for home</span><span>Secure booking · Insured professionals</span></footer>
      </div>
      <div className="note">Good House Co. prototype · pricing, availability and payment details are simulated.</div>
      <button className="float" onClick={() => openChat()}><span>✨</span> Book with AI</button>
      <BookingAssistant open={chatOpen} requestText={chatRequest} onClose={() => setChatOpen(false)} />
      <div className={`modal${modalOpen ? " open" : ""}`} onClick={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
        <div className="booking-page"><div className="book-top"><div className="brand"><div className="logo"><svg className="brand-symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3l8.5 7.5v10H3.5z" /><path className="brand-door" d="M9.25 20.5v-6h5.5v6z" /></svg></div><strong>Good House Co.</strong></div><button className="btn secondary" onClick={() => setModalOpen(false)}>Back to website</button></div><div className="center"><div className="spark">✨</div><h2>What do you need done?</h2><p>Tell me in your own words. I&apos;ll take care of the rest.</p><textarea value={pageInput} onChange={(event) => setPageInput(event.target.value)} className="inputbox" placeholder="I need..." /><button className="btn wide" onClick={askBookingPage}>Get price &amp; availability →</button>{pageQuote && <div className="result show"><div className="quote"><div className="eyebrow">Best available option</div><div className="quote-top"><div><strong className="page-service">{pageQuote.service}</strong><div className="page-detail">{pageQuote.time}<br />{pageQuote.detail}</div></div><div className="price">${pageQuote.price}</div></div><button className="btn wide" disabled={pageReserved} onClick={() => setPageReserved(true)}>{pageReserved ? "✓ Reserved — next: payment" : "Book this time →"}</button></div></div>}<p className="secure-note">🔒 Secure &nbsp; · &nbsp; ✓ Insured &nbsp; · &nbsp; ★ 4.9 rated</p></div></div>
      </div>
    </>
  );
}
