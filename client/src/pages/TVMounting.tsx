/**
 * Good House Co. TV Mounting page: a service-specific use of the approved editorial detail-page system.
 * Keep the warm home setting, helpful language, and explicit Guide-to-booking handoff.
 */
import { useState } from "react";
import { useLocation } from "wouter";
import BookingAssistant from "./BookingAssistant";
import "./handyman.css";
import "./handyman-overrides.css";

const commonJobs = [
  { icon: "▣", title: "TV wall mounting", copy: "Help position and mount the screen where the room works best.", request: "TV wall mounting" },
  { icon: "⌁", title: "Soundbar setup", copy: "Mount and connect the soundbar that completes the space.", request: "soundbar setup" },
  { icon: "⟂", title: "Cable tidy-up", copy: "Bring visible connections into a cleaner, more considered finish.", request: "TV cable tidy-up" },
  { icon: "◒", title: "Room setup", copy: "A practical plan for the TV, console, components, and the room around them.", request: "living room TV setup" },
];

const faqItems = [
  ["What should I include in my request?", "Start with the TV size, the room, and the wall you have in mind. Mention a soundbar, console, cables, or anything else you want included."],
  ["Do I need to have the mount already?", "Tell the Guide what you already have. It can carry that detail into the request so the next step is clear."],
  ["Can I book a TV and soundbar together?", "Yes. Describe the full setup you want and the Guide will keep the details together before you open the booking form."],
  ["What if I am unsure about wall type or placement?", "A photo and the room context can help. You do not need to use the right technical terms to begin the conversation."],
];

export default function TVMounting() {
  const [, setLocation] = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [request, setRequest] = useState("I need help with TV mounting.");
  const [heroText, setHeroText] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  function openGuide(prefill = "I need help with TV mounting.") { setRequest(prefill); setChatOpen(true); }
  function startHeroRequest() { openGuide(heroText.trim() || "I need help with TV mounting."); }

  return (
    <>
      <div className="site handyman-page tv-page">
        <header className="handyman-header"><a href="/" className="brand brand-link" aria-label="Return to Good House Co. home page"><div className="logo"><svg className="brand-symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3l8.5 7.5v10H3.5z" /><path className="brand-door" d="M9.25 20.5v-6h5.5v6z" /></svg></div><div><strong>Good House Co.</strong><small>The good kind of help for home</small></div></a><nav className="nav" aria-label="Main navigation"><a href="/services">Services</a><a href="/#reviews">Reviews</a><a href="/#about">About</a></nav><button className="btn" onClick={() => openGuide()}>Book now</button></header>
        <main>
          <section className="handyman-hero"><div className="handyman-hero-copy"><div className="crumb"><button onClick={() => setLocation("/services")}>Services</button><span>/</span><span>TV Mounting</span></div><div className="eyebrow">TV Mounting</div><h1>Make the room<br /><em>feel more considered.</em></h1><p>Start with the screen, soundbar, or the cables that keep catching your eye. The Good House Guide helps turn the setup into a clear next step.</p><div className="hero-task-row"><span>Common help:</span><button onClick={() => openGuide("I need a TV mounted.")}>TV mounting</button><button onClick={() => openGuide("I need help mounting a soundbar.")}>Soundbar</button><button onClick={() => openGuide("I need help with TV cable management.")}>Cable tidy-up</button></div></div><div className="handyman-hero-visual"><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/HSVbxkIUsaSQYVDn.jpg" alt="A television being carefully mounted in a living room" /><div className="hero-image-caption"><span className="caption-mark">✦</span><span>Clear request. Better room.</span></div></div><div className="handyman-guide-card"><div className="guide-card-top"><div><div className="eyebrow">Good House Guide</div><h2>What are you setting up?</h2></div><div className="guide-spark">✦</div></div><p>Ask a question or give us the short version. Open the booking form only when it feels right.</p><textarea value={heroText} onChange={(event) => setHeroText(event.target.value)} placeholder="Example: I need a 65-inch TV mounted over a console with a soundbar…" /><button className="btn wide" onClick={startHeroRequest}>Ask the Guide →</button><div className="guide-note"><span>◌</span> No form until you choose to book</div></div></section>
          <section className="handyman-intro"><div className="eyebrow">One room, clearer</div><h2>TV help for the setup you have been meaning to finish.</h2><p>Choose a familiar starting point, or tell the Guide how the room works now and what you would like to change.</p></section>
          <section className="handyman-jobs" aria-label="Common TV mounting services">{commonJobs.map((job, index) => <button className={`handyman-job job-${index + 1}`} key={job.title} onClick={() => openGuide(`I need help with ${job.request}.`)}><span className="job-icon">{job.icon}</span><span className="job-number">0{index + 1}</span><h3>{job.title}</h3><p>{job.copy}</p><span className="job-link">Start this request <b>→</b></span></button>)}</section>
          <section className="handyman-explainer"><div className="handyman-explainer-image"><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/zheCYLtCVUOOCwjX.jpg" alt="Careful cable organization behind a television" /></div><div className="handyman-explainer-copy"><div className="eyebrow">Make the request useful</div><h2>A few room details make the next step clearer.</h2><p>You do not need to figure out the technical language. A photo, the screen size, and a sentence about the room are usually enough to get the request moving.</p><ul><li><span>01</span> What size is the TV, and where would you like it?</li><li><span>02</span> Is there a soundbar, console, or other component involved?</li><li><span>03</span> What would make the finished wall feel better?</li></ul><button className="text-action" onClick={() => openGuide("I want to describe my TV mounting setup.")}>Tell the Guide about the room <b>→</b></button></div></section>
          <section className="handyman-fit"><div className="fit-head"><div className="eyebrow">A good fit when</div><h2>The setup needs a steadier, cleaner finish.</h2></div><div className="fit-grid"><div className="fit-card fit-yes"><span>Good House can help you start with</span><strong>TVs, soundbars, cable cleanup, wall-mounted accessories, and the everyday choices that make an entertainment wall work better.</strong></div><div className="fit-card fit-note"><span>Best to describe first</span><strong>Electrical rewiring, structural changes, unusual mounting surfaces, or a custom built-in project.</strong></div></div></section>
          <section className="handyman-steps"><div className="eyebrow">How booking works</div><h2>From a screen in a box to a room that feels finished.</h2><div className="handyman-step-grid"><div><b>1</b><h3>Describe the setup</h3><p>Share the screen, the room, and what you are hoping to change. The Guide helps organize the request.</p></div><div><b>2</b><h3>Open the right form</h3><p>When you are ready, the relevant details move with you into a service-specific booking form.</p></div><div><b>3</b><h3>Review before checkout</h3><p>Confirm the setup and preferred time before continuing to the secure payment step.</p></div></div></section>
          <section className="handyman-faq" aria-labelledby="tv-faq-title"><div className="faq-heading"><div className="eyebrow">Questions, answered</div><h2 id="tv-faq-title">Before you mount the screen.</h2><p>Start with what you know. The Guide can help make the rest of the request clear before you open the form.</p><button className="btn secondary" onClick={() => openGuide("I have a question about TV mounting.")}>Ask the Guide →</button></div><div className="faq-list">{faqItems.map(([question, answer], index) => <div className={`faq-item ${openFaq === index ? "is-open" : ""}`} key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{question}</span><b>{openFaq === index ? "−" : "+"}</b></button>{openFaq === index && <p>{answer}</p>}</div>)}</div></section>
          <section className="handyman-bottom-cta"><div><div className="eyebrow">Start where you are</div><h2>What would make the room feel more settled?</h2><p>A sentence is enough. The Good House Guide can help find a useful next step.</p></div><button className="btn" onClick={() => openGuide("I need help with a TV setup.")}>Describe the setup →</button></section>
        </main>
        <footer><a href="/" className="brand brand-link"><div className="logo"><svg className="brand-symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3l8.5 7.5v10H3.5z" /><path className="brand-door" d="M9.25 20.5v-6h5.5v6z" /></svg></div><strong>Good House Co.</strong></a><span>The good kind of help for home</span><span>TV Mounting</span></footer>
      </div>
      <BookingAssistant open={chatOpen} requestText={request} onClose={() => setChatOpen(false)} />
    </>
  );
}
