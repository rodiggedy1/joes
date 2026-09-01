/**
 * Good House Co. House Cleaning page: reuses the approved detail-page system with original cleaning-specific content and AI guidance.
 * Preserve the warm editorial surface, photo-led hero, and clear service-to-booking handoff.
 */
import { useState } from "react";
import { useLocation } from "wouter";
import BookingAssistant from "./BookingAssistant";
import "./handyman.css";
import "./handyman-overrides.css";

const commonJobs = [
  { icon: "⌇", title: "Home reset", copy: "A practical clean for the rooms you use every day, shaped around your routine.", request: "standard home cleaning" },
  { icon: "✦", title: "Deep cleaning", copy: "More attention for kitchens, bathrooms, buildup, and the places a regular reset misses.", request: "deep house cleaning" },
  { icon: "↔", title: "Move-day cleaning", copy: "A fresher start before move-in or a cleaner finish after you move out.", request: "move-in or move-out cleaning" },
  { icon: "◌", title: "Recurring upkeep", copy: "Set a regular rhythm to help the home stay in shape, week after week.", request: "recurring home cleaning" },
];

const faqItems = [
  ["What should I include in my request?", "A little context helps: the number of bedrooms and bathrooms, whether you need a routine or deep clean, and any rooms or surfaces you want to call out."],
  ["Can I ask for a recurring clean?", "Yes. Tell the Guide what cadence you have in mind—weekly, every other week, or something else—and the request can be shaped around it."],
  ["Should I mention pets or access details?", "Yes. Let the Guide know about pets, entry instructions, parking, or anything else that makes the visit go more smoothly."],
  ["What if I am not sure which cleaning type I need?", "Start with how the home feels and the result you are after. The Guide can help distinguish a routine reset from a deeper clean before you open the booking form."],
];

export default function Cleaning() {
  const [, setLocation] = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [request, setRequest] = useState("I need help with home cleaning.");
  const [heroText, setHeroText] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  function openGuide(prefill = "I need help with home cleaning.") { setRequest(prefill); setChatOpen(true); }
  function startHeroRequest() { openGuide(heroText.trim() || "I need help with home cleaning."); }

  return (
    <>
      <div className="site handyman-page cleaning-page">
        <header className="handyman-header">
          <a href="/" className="brand brand-link" aria-label="Return to Good House Co. home page"><div className="logo"><svg className="brand-symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3l8.5 7.5v10H3.5z" /><path className="brand-door" d="M9.25 20.5v-6h5.5v6z" /></svg></div><div><strong>Good House Co.</strong><small>The good kind of help for home</small></div></a>
          <nav className="nav" aria-label="Main navigation"><a href="/services">Services</a><a href="/#reviews">Reviews</a><a href="/#about">About</a></nav>
          <button className="btn" onClick={() => openGuide()}>Book now</button>
        </header>

        <main>
          <section className="handyman-hero">
            <div className="handyman-hero-copy"><div className="crumb"><button onClick={() => setLocation("/services")}>Services</button><span>/</span><span>House Cleaning</span></div><div className="eyebrow">House Cleaning</div><h1>A home that feels<br /><em>lighter to come back to.</em></h1><p>Tell us what kind of reset you need. The Good House Guide can help you make the request clear, then open a booking form when you&apos;re ready.</p><div className="hero-task-row"><span>Common help:</span><button onClick={() => openGuide("I need a routine home cleaning.")}>Routine reset</button><button onClick={() => openGuide("I need a deep home cleaning.")}>Deep clean</button><button onClick={() => openGuide("I need a move-out cleaning.")}>Move-day</button></div></div>
            <div className="handyman-hero-visual"><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/kFPXzMVzLEjILOqX.jpg" alt="A home being thoughtfully refreshed" /><div className="hero-image-caption"><span className="caption-mark">✦</span><span>Clear request. Lighter home.</span></div></div>
            <div className="handyman-guide-card"><div className="guide-card-top"><div><div className="eyebrow">Good House Guide</div><h2>How can we reset the home?</h2></div><div className="guide-spark">✦</div></div><p>Ask a question or give us the short version. Open the booking form only when it feels right.</p><textarea value={heroText} onChange={(event) => setHeroText(event.target.value)} placeholder="Example: I need a deep clean for a three-bedroom home before family visits…" /><button className="btn wide" onClick={startHeroRequest}>Ask the Guide →</button><div className="guide-note"><span>◌</span> No form until you choose to book</div></div>
          </section>

          <section className="handyman-intro"><div className="eyebrow">A reset that fits the moment</div><h2>Cleaning help for the work that lets a home breathe again.</h2><p>Choose a familiar kind of clean to begin, or tell the Guide how the home feels and what you want it ready for.</p></section>
          <section className="handyman-jobs" aria-label="Common cleaning services">{commonJobs.map((job, index) => <button className={`handyman-job job-${index + 1}`} key={job.title} onClick={() => openGuide(`I need help with ${job.request}.`)}><span className="job-icon">{job.icon}</span><span className="job-number">0{index + 1}</span><h3>{job.title}</h3><p>{job.copy}</p><span className="job-link">Start this request <b>→</b></span></button>)}</section>

          <section className="handyman-explainer"><div className="handyman-explainer-image"><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/CdDvqrnAnIAXKxrL.jpg" alt="A thoughtful kitchen cleaning detail" /></div><div className="handyman-explainer-copy"><div className="eyebrow">Make the request useful</div><h2>The helpful details are probably already on your mind.</h2><p>You do not need a room-by-room spreadsheet. A few plain-language details make it easier to match the request to the home and the kind of reset you want.</p><ul><li><span>01</span> Is this a routine reset, a deep clean, or move-day help?</li><li><span>02</span> How many bedrooms and bathrooms are involved?</li><li><span>03</span> Is there one room or detail you want to prioritize?</li></ul><button className="text-action" onClick={() => openGuide("I want to describe what kind of home cleaning I need.")}>Tell the Guide about the home <b>→</b></button></div></section>

          <section className="handyman-fit"><div className="fit-head"><div className="eyebrow">A good fit when</div><h2>The home needs a reset, not a reinvention.</h2></div><div className="fit-grid"><div className="fit-card fit-yes"><span>Good House can help you start with</span><strong>Routine cleaning, deeper refreshes, move-day resets, and a recurring rhythm that fits your household.</strong></div><div className="fit-card fit-note"><span>Best to describe first</span><strong>Specialty restoration, hazardous conditions, exterior work, or a project that needs a licensed specialist.</strong></div></div></section>

          <section className="handyman-steps"><div className="eyebrow">How booking works</div><h2>From “the house needs help” to a plan.</h2><div className="handyman-step-grid"><div><b>1</b><h3>Describe the reset</h3><p>Use everyday language. The Guide helps turn the moment into a service request without making you sort through menus.</p></div><div><b>2</b><h3>Open the right form</h3><p>When you are ready, the booking form carries the service details forward so you do not have to start again.</p></div><div><b>3</b><h3>Review before checkout</h3><p>Check the cleaning type, home details, and preferred time before continuing to the secure payment step.</p></div></div></section>

          <section className="handyman-faq" aria-labelledby="cleaning-faq-title"><div className="faq-heading"><div className="eyebrow">Questions, answered</div><h2 id="cleaning-faq-title">Before you ask for a reset.</h2><p>Start with what you know. The Guide can help you work out the rest before you open a booking form.</p><button className="btn secondary" onClick={() => openGuide("I have a question about home cleaning.")}>Ask the Guide →</button></div><div className="faq-list">{faqItems.map(([question, answer], index) => <div className={`faq-item ${openFaq === index ? "is-open" : ""}`} key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{question}</span><b>{openFaq === index ? "−" : "+"}</b></button>{openFaq === index && <p>{answer}</p>}</div>)}</div></section>
          <section className="handyman-bottom-cta"><div><div className="eyebrow">Start where you are</div><h2>What would make home feel easier this week?</h2><p>A sentence is enough. The Good House Guide can help make the next step clear.</p></div><button className="btn" onClick={() => openGuide("I need help with home cleaning this week.")}>Describe the home →</button></section>
        </main>
        <footer><a href="/" className="brand brand-link"><div className="logo"><svg className="brand-symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3l8.5 7.5v10H3.5z" /><path className="brand-door" d="M9.25 20.5v-6h5.5v6z" /></svg></div><strong>Good House Co.</strong></a><span>The good kind of help for home</span><span>House Cleaning</span></footer>
      </div>
      <BookingAssistant open={chatOpen} requestText={request} onClose={() => setChatOpen(false)} />
    </>
  );
}
