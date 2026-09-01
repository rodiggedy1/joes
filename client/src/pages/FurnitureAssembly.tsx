/**
 * Good House Co. Furniture Assembly page: an original service-specific expression of the approved detail-page system.
 * Preserve the warm editorial home setting and conversational Guide-to-booking handoff.
 */
import { useState } from "react";
import { useLocation } from "wouter";
import BookingAssistant from "./BookingAssistant";
import "./handyman.css";
import "./handyman-overrides.css";

const commonJobs = [
  { icon: "▤", title: "Beds & bedroom", copy: "Frames, dressers, nightstands, and the pieces that make a room ready to use.", request: "bedroom furniture assembly" },
  { icon: "⌂", title: "Desks & workspaces", copy: "Desks, office chairs, shelving, and the practical pieces behind a more useful workday.", request: "desk and workspace assembly" },
  { icon: "▦", title: "Storage & shelving", copy: "Cabinets, bookcases, organizers, and new storage that needs a steady start.", request: "storage and shelving assembly" },
  { icon: "◒", title: "Outdoor pieces", copy: "Patio sets, grills, and seasonal furniture ready for the outdoor space.", request: "outdoor furniture assembly" },
];

const faqItems = [
  ["What should I include in my request?", "The product name or a photo of the box, the number of pieces, and the room where it will go are a helpful start."],
  ["Do I need to open the boxes first?", "Tell the Guide how the delivery arrived and what is still packed. It can keep that context with the request."],
  ["Can I put several pieces on the same request?", "Yes. Add the full list in your own words. The Guide can help make the scope clear before you open the booking form."],
  ["What if a part is missing or damaged?", "Mention it when you describe the job. The Guide can help determine whether it is useful to wait for the replacement part."],
];

export default function FurnitureAssembly() {
  const [, setLocation] = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [request, setRequest] = useState("I need help with furniture assembly.");
  const [heroText, setHeroText] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  function openGuide(prefill = "I need help with furniture assembly.") { setRequest(prefill); setChatOpen(true); }
  function startHeroRequest() { openGuide(heroText.trim() || "I need help with furniture assembly."); }

  return (
    <>
      <div className="site handyman-page assembly-page">
        <header className="handyman-header"><a href="/" className="brand brand-link" aria-label="Return to Good House Co. home page"><div className="logo"><svg className="brand-symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3l8.5 7.5v10H3.5z" /><path className="brand-door" d="M9.25 20.5v-6h5.5v6z" /></svg></div><div><strong>Good House Co.</strong><small>The good kind of help for home</small></div></a><nav className="nav" aria-label="Main navigation"><a href="/services">Services</a><a href="/#reviews">Reviews</a><a href="/#about">About</a></nav><button className="btn" onClick={() => openGuide()}>Book now</button></header>
        <main>
          <section className="handyman-hero"><div className="handyman-hero-copy"><div className="crumb"><button onClick={() => setLocation("/services")}>Services</button><span>/</span><span>Furniture Assembly</span></div><div className="eyebrow">Furniture Assembly</div><h1>Make the new piece<br /><em>feel like it belongs.</em></h1><p>From one box to a full room setup, start with what arrived and where it is going. The Good House Guide helps make the list clear.</p><div className="hero-task-row"><span>Common help:</span><button onClick={() => openGuide("I need a bed assembled.")}>Beds</button><button onClick={() => openGuide("I need a desk assembled.")}>Desks</button><button onClick={() => openGuide("I need shelving assembled.")}>Shelving</button></div></div><div className="handyman-hero-visual"><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/gKODCdVmloHaVFvn.jpg" alt="Furniture being carefully assembled in a bright room" /><div className="hero-image-caption"><span className="caption-mark">✦</span><span>Clear list. Ready room.</span></div></div><div className="handyman-guide-card"><div className="guide-card-top"><div><div className="eyebrow">Good House Guide</div><h2>What needs putting together?</h2></div><div className="guide-spark">✦</div></div><p>Ask a question or give us the short version. Open the booking form only when it feels right.</p><textarea value={heroText} onChange={(event) => setHeroText(event.target.value)} placeholder="Example: I have a new desk, chair, and two bookcases for a home office…" /><button className="btn wide" onClick={startHeroRequest}>Ask the Guide →</button><div className="guide-note"><span>◌</span> No form until you choose to book</div></div></section>
          <section className="handyman-intro"><div className="eyebrow">A room coming together</div><h2>Assembly help for the piece that has been waiting in its box.</h2><p>Choose a familiar place to begin, or describe the full setup in your own words and let the Guide help shape the request.</p></section>
          <section className="handyman-jobs" aria-label="Common furniture assembly services">{commonJobs.map((job, index) => <button className={`handyman-job job-${index + 1}`} key={job.title} onClick={() => openGuide(`I need help with ${job.request}.`)}><span className="job-icon">{job.icon}</span><span className="job-number">0{index + 1}</span><h3>{job.title}</h3><p>{job.copy}</p><span className="job-link">Start this request <b>→</b></span></button>)}</section>
          <section className="handyman-explainer"><div className="handyman-explainer-image"><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/QivtrPWsptdVQsSn.jpg" alt="Careful furniture assembly detail" /></div><div className="handyman-explainer-copy"><div className="eyebrow">Make the request useful</div><h2>The box, the room, and a short list are enough to begin.</h2><p>You do not need to inventory every bolt. A photo of the packaging and a sentence about what you are assembling gives the next step useful shape.</p><ul><li><span>01</span> What piece or pieces need assembly?</li><li><span>02</span> Where in the home will they go?</li><li><span>03</span> Are the boxes, hardware, and instructions already there?</li></ul><button className="text-action" onClick={() => openGuide("I want to describe the furniture I need assembled.")}>Tell the Guide about the pieces <b>→</b></button></div></section>
          <section className="handyman-fit"><div className="fit-head"><div className="eyebrow">A good fit when</div><h2>New furniture needs a steadier first day.</h2></div><div className="fit-grid"><div className="fit-card fit-yes"><span>Good House can help you start with</span><strong>Beds, desks, dressers, shelving, storage pieces, office furniture, patio sets, and a short list of newly delivered items.</strong></div><div className="fit-card fit-note"><span>Best to describe first</span><strong>Custom built-ins, structural furniture changes, missing major components, or a project that needs a specialist installer.</strong></div></div></section>
          <section className="handyman-steps"><div className="eyebrow">How booking works</div><h2>From a room full of boxes to a room you can use.</h2><div className="handyman-step-grid"><div><b>1</b><h3>Describe the pieces</h3><p>Write a short list or add what you know. The Guide helps organize it into a request without technical language.</p></div><div><b>2</b><h3>Open the right form</h3><p>When you are ready, the service details move with you into a booking form built for that kind of job.</p></div><div><b>3</b><h3>Review before checkout</h3><p>Check the scope and preferred time before continuing to the secure payment step.</p></div></div></section>
          <section className="handyman-faq" aria-labelledby="assembly-faq-title"><div className="faq-heading"><div className="eyebrow">Questions, answered</div><h2 id="assembly-faq-title">Before the boxes get opened.</h2><p>Start with what you can see. The Guide can help you decide which other details are useful before you open the form.</p><button className="btn secondary" onClick={() => openGuide("I have a question about furniture assembly.")}>Ask the Guide →</button></div><div className="faq-list">{faqItems.map(([question, answer], index) => <div className={`faq-item ${openFaq === index ? "is-open" : ""}`} key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{question}</span><b>{openFaq === index ? "−" : "+"}</b></button>{openFaq === index && <p>{answer}</p>}</div>)}</div></section>
          <section className="handyman-bottom-cta"><div><div className="eyebrow">Start where you are</div><h2>What is still in the box?</h2><p>A sentence is enough. The Good House Guide can help turn it into a useful next step.</p></div><button className="btn" onClick={() => openGuide("I need help with furniture assembly.")}>Describe the pieces →</button></section>
        </main>
        <footer><a href="/" className="brand brand-link"><div className="logo"><svg className="brand-symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3l8.5 7.5v10H3.5z" /><path className="brand-door" d="M9.25 20.5v-6h5.5v6z" /></svg></div><strong>Good House Co.</strong></a><span>The good kind of help for home</span><span>Furniture Assembly</span></footer>
      </div>
      <BookingAssistant open={chatOpen} requestText={request} onClose={() => setChatOpen(false)} />
    </>
  );
}
