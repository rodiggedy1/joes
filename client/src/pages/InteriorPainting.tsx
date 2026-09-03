import React, { useState } from "react";
import { useLocation } from "wouter";
import BookingAssistant from "./BookingAssistant";
import "./handyman.css";
import "./handyman-overrides.css";

const commonProjects = [
  {
    icon: "◐",
    title: "Paint touch-ups",
    copy: "Small scuffs, nicks, and the places a room needs to feel finished again.",
    request: "interior paint touch-ups",
  },
  {
    icon: "▰",
    title: "Accent wall",
    copy: "A focused change of color for the wall that makes the room feel different.",
    request: "an interior accent wall painted",
  },
  {
    icon: "□",
    title: "A room refresh",
    copy: "Start with the room, the walls, and what you would like to look different.",
    request: "an interior room painting project",
  },
  {
    icon: "⌁",
    title: "Trim & detail work",
    copy: "Doors, baseboards, trim, and the small finish work that completes the room.",
    request: "interior trim and door painting",
  },
];

const faqItems = [
  [
    "What does painting start at?",
    "Small paint-ready touch-ups and a standard accent wall start at $199. Larger rooms, ceilings, trim, preparation, specialty finishes, or more than one wall are reviewed before the final price is confirmed.",
  ],
  [
    "Should I have paint already?",
    "Tell us whether you have chosen and purchased paint. The initial $199 small-project starting point assumes customer-supplied paint; the Guide keeps any paint or material questions in the request.",
  ],
  [
    "Can you paint a whole room?",
    "Yes. Start with the room and the walls you want changed. A whole-room request is reviewed before scheduling so preparation, trim, ceiling work, access, and the right amount of labor are clear.",
  ],
  [
    "What details make the request easier to quote?",
    "A photo, approximate room size, number of walls, ceiling height, and whether there are repairs or furniture to move are all useful. You do not need to know paint terminology to begin.",
  ],
];

export default function InteriorPainting() {
  const [, setLocation] = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [request, setRequest] = useState("I need help with an interior painting project.");
  const [heroText, setHeroText] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  function openGuide(prefill = "I need help with an interior painting project.") {
    setRequest(prefill);
    setChatOpen(true);
  }

  function startHeroRequest() {
    openGuide(heroText.trim() || "I need help with an interior painting project.");
  }

  return (
    <>
      <div className="site handyman-page painting-page">
        <header className="handyman-header">
          <a href="/" className="brand brand-link" aria-label="Return to Good Joe home page">
            <div className="logo"><svg className="brand-symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3l8.5 7.5v10H3.5z" /><path className="brand-door" d="M9.25 20.5v-6h5.5v6z" /></svg></div>
            <div><strong>Good Joe</strong><small>The good kind of help for home</small></div>
          </a>
          <nav className="nav" aria-label="Main navigation"><a href="/services">Services</a><a href="/#reviews">Reviews</a><a href="/#about">About</a></nav>
          <button className="btn" onClick={() => openGuide()}>Book now</button>
        </header>

        <main>
          <section className="handyman-hero">
            <div className="handyman-hero-copy">
              <div className="crumb"><button onClick={() => setLocation("/services")}>Services</button><span>/</span><span>Interior Painting</span></div>
              <div className="eyebrow">Interior Painting</div>
              <h1>Fresh color.<br /><em>A room that feels new.</em></h1>
              <p>Start with the wall, room, or small detail that has been waiting for a reset. Good Joe helps turn it into a clear painting request before you choose a time.</p>
              <div className="hero-task-row"><span>Starts from $199:</span><button onClick={() => openGuide("I need interior paint touch-ups.")}>Touch-ups</button><button onClick={() => openGuide("I need an accent wall painted.")}>Accent wall</button><button onClick={() => openGuide("I need an interior room painting project.")}>Room refresh</button></div>
            </div>
            <div className="handyman-hero-visual">
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/OsmyHploqzJwJpQd.jpg" alt="Professional preparing a bright interior room for painting" />
              <div className="hero-image-caption"><span className="caption-mark">✦</span><span>Clear scope. Fresh finish.</span></div>
            </div>
            <div className="handyman-guide-card">
              <div className="guide-card-top"><div><div className="eyebrow">Good Joe Guide</div><h2>What could use a fresh coat?</h2></div><div className="guide-spark">✦</div></div>
              <p>Tell us what you see. We will keep the room, paint, preparation, and timing details together when you are ready to book.</p>
              <textarea value={heroText} onChange={event => setHeroText(event.target.value)} placeholder="Example: I want to paint one accent wall in the bedroom and touch up a few scuffs…" />
              <button className="btn wide" onClick={startHeroRequest}>Ask the Guide →</button>
              <div className="guide-note"><span>◌</span> Small projects from $199</div>
            </div>
          </section>

          <section className="handyman-intro">
            <div className="eyebrow">A considered fresh start</div>
            <h2>Painting help for the parts of a room you are ready to see differently.</h2>
            <p>Paint-ready touch-ups and a standard accent wall start at $199. Larger rooms and more involved finishes are reviewed first, so the final scope is clear before the appointment is confirmed.</p>
          </section>

          <section className="handyman-jobs" aria-label="Common interior painting projects">
            {commonProjects.map((project, index) => (
              <button className={`handyman-job job-${index + 1}`} key={project.title} onClick={() => openGuide(`I need help with ${project.request}.`)}>
                <span className="job-icon">{project.icon}</span><span className="job-number">0{index + 1}</span><h3>{project.title}</h3><p>{project.copy}</p><span className="job-link">Start this request <b>→</b></span>
              </button>
            ))}
          </section>

          <section className="handyman-explainer">
            <div className="handyman-explainer-image"><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/TrUJosFNIoPbWYDk.jpg" alt="Interior room with a thoughtfully painted wall" /></div>
            <div className="handyman-explainer-copy">
              <div className="eyebrow">Make the request useful</div><h2>A photo and a few room details go a long way.</h2>
              <p>You do not need to know the right paint finish or the exact square footage. Start with what you want to change and we will make the next step easier to understand.</p>
              <ul><li><span>01</span> Is this a touch-up, accent wall, one room, or several rooms?</li><li><span>02</span> Do you already have paint, and will trim or ceilings be included?</li><li><span>03</span> Are there repairs, furniture, or high places that need attention first?</li></ul>
              <button className="text-action" onClick={() => openGuide("I want to describe an interior painting project.")}>Tell the Guide about the room <b>→</b></button>
            </div>
          </section>

          <section className="handyman-fit">
            <div className="fit-head"><div className="eyebrow">A good fit when</div><h2>A small change of color could make the room feel finished.</h2></div>
            <div className="fit-grid"><div className="fit-card fit-yes"><span>Good Joe can help you start with</span><strong>Paint touch-ups, accent walls, paint-ready small projects, trim, doors, and room-refresh requests.</strong></div><div className="fit-card fit-note"><span>Best to describe first</span><strong>Whole-home work, more than one wall, ceilings, trim packages, prep or patching, high access, wallpaper removal, and specialty finishes.</strong></div></div>
          </section>

          <section className="handyman-steps"><div className="eyebrow">How booking works</div><h2>From the change you have in mind to a clear preferred appointment.</h2><div className="handyman-step-grid"><div><b>1</b><h3>Describe the room</h3><p>Share the wall, room, or detail you want refreshed. A photo helps, but a sentence is enough to begin.</p></div><div><b>2</b><h3>Review the scope</h3><p>Small paint-ready projects begin at $199. Larger or more involved work is reviewed before Good Joe confirms the final price.</p></div><div><b>3</b><h3>Choose your preference</h3><p>Pick a preferred date and time window. Good Joe confirms the final scope and appointment before the work is scheduled.</p></div></div></section>

          <section className="handyman-faq" aria-labelledby="painting-faq-title"><div className="faq-heading"><div className="eyebrow">Questions, answered</div><h2 id="painting-faq-title">Before the room gets a new color.</h2><p>Start with the detail you have. Good Joe can keep the rest of the request clear before you book.</p><button className="btn secondary" onClick={() => openGuide("I have a question about interior painting.")}>Ask the Guide →</button></div><div className="faq-list">{faqItems.map(([question, answer], index) => <div className={`faq-item ${openFaq === index ? "is-open" : ""}`} key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{question}</span><b>{openFaq === index ? "−" : "+"}</b></button>{openFaq === index && <p>{answer}</p>}</div>)}</div></section>

          <section className="handyman-bottom-cta"><div><div className="eyebrow">Start where you are</div><h2>Which room is ready for a different feel?</h2><p>A sentence is enough. Good Joe can help make the painting request practical and clear.</p></div><button className="btn" onClick={() => openGuide("I need help with interior painting.")}>Describe the project →</button></section>
        </main>

        <footer><a href="/" className="brand brand-link"><div className="logo"><svg className="brand-symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3l8.5 7.5v10H3.5z" /><path className="brand-door" d="M9.25 20.5v-6h5.5v6z" /></svg></div><strong>Good Joe</strong></a><span>The good kind of help for home</span><span>Interior Painting</span></footer>
      </div>
      <BookingAssistant open={chatOpen} requestText={request} onClose={() => setChatOpen(false)} />
    </>
  );
}
