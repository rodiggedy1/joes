/**
 * Good House Co. Handyman page: an original service-detail template with an AI guide, scoped job choices, and clear booking handoff.
 * Keep the warm editorial palette, direct language, and quiet utility-first hierarchy used across the site.
 */
import { useState } from "react";
import { useLocation } from "wouter";
import BookingAssistant from "./BookingAssistant";
import "./handyman.css";
import "./handyman-overrides.css";

const commonJobs = [
  { icon: "⌁", title: "Hanging & shelves", copy: "Pictures, mirrors, curtain rods, rails, and shelves placed with care.", request: "hanging pictures and shelves" },
  { icon: "⌘", title: "Door & hardware", copy: "Handles, hinges, catches, loose hardware, and the details that should work smoothly.", request: "door and hardware repairs" },
  { icon: "□", title: "Patch & touch-up", copy: "Minor wall repairs, caulking, trim, and the small finishes that change a room.", request: "minor drywall and caulking repairs" },
  { icon: "+", title: "A short job list", copy: "A few practical jobs in one visit, described in your own words.", request: "a handyman visit with several small jobs" },
];

const faqItems = [
  ["What should I include in my request?", "A short description, photos where helpful, approximate measurements, and any parts you already have. The Guide will tell you if another detail would help."],
  ["Can I put more than one job on the list?", "Yes. Start with the jobs that matter most, then mention the rest. The booking form makes space for a short list so the scope is visible before you choose a time."],
  ["Do I need to have tools or supplies ready?", "Tell the Guide what you have on hand and what you still need. It can capture that detail for the booking request instead of asking you to guess in advance."],
  ["When is a handyman not the right fit?", "Projects involving permits, major structural work, gas lines, or licensed trade requirements may need a specialized professional. Describe the work first so you can take the right next step."],
];

export default function Handyman() {
  const [, setLocation] = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [request, setRequest] = useState("I need help with a handyman repair.");
  const [heroText, setHeroText] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  function openGuide(prefill = "I need help with a handyman repair.") {
    setRequest(prefill);
    setChatOpen(true);
  }

  function startHeroRequest() {
    const text = heroText.trim();
    openGuide(text || "I need help with a handyman repair.");
  }

  return (
    <>
      <div className="site handyman-page">
        <header className="handyman-header">
          <a href="/" className="brand brand-link" aria-label="Return to Good House Co. home page"><div className="logo"><svg className="brand-symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3l8.5 7.5v10H3.5z" /><path className="brand-door" d="M9.25 20.5v-6h5.5v6z" /></svg></div><div><strong>Good House Co.</strong><small>The good kind of help for home</small></div></a>
          <nav className="nav" aria-label="Main navigation"><a href="/services">Services</a><a href="/#reviews">Reviews</a><a href="/#about">About</a></nav>
          <button className="btn" onClick={() => openGuide()}>Book now</button>
        </header>

        <main>
          <section className="handyman-hero">
            <div className="handyman-hero-copy"><div className="crumb"><button onClick={() => setLocation("/services")}>Services</button><span>/</span><span>Handyman</span></div><div className="eyebrow">General Handyman</div><h1>Make room for the<br /><em>jobs that keep waiting.</em></h1><p>From a loose hinge to a growing punch list, start with the job in your own words. The Good House Guide helps turn it into a clear next step.</p><div className="hero-task-row"><span>Common help:</span><button onClick={() => openGuide("I need help hanging shelves.")}>Shelves</button><button onClick={() => openGuide("I need help with a door repair.")}>Doors</button><button onClick={() => openGuide("I need help patching a wall.")}>Patching</button></div></div>
            <div className="handyman-hero-visual"><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/DDdwxdvAcIcktIDg.jpg" alt="A home repair professional aligning a shelf" /><div className="hero-image-caption"><span className="caption-mark">✦</span><span>Clear request. Useful next step.</span></div></div>
            <div className="handyman-guide-card"><div className="guide-card-top"><div><div className="eyebrow">Good House Guide</div><h2>What needs a hand?</h2></div><div className="guide-spark">✦</div></div><p>Ask a question or give us the short version. You can open the booking form only when you&apos;re ready.</p><textarea value={heroText} onChange={(event) => setHeroText(event.target.value)} placeholder="Example: Two cabinet doors won’t close right and I need a shelf hung…" /><button className="btn wide" onClick={startHeroRequest}>Ask the Guide →</button><div className="guide-note"><span>◌</span> No form until you choose to book</div></div>
          </section>

          <section className="handyman-intro"><div className="eyebrow">One visit, the right details</div><h2>Handyman help for the things a room needs to feel finished.</h2><p>Choose a familiar job to start, or tell the Guide about the thing that does not fit neatly into a category.</p></section>

          <section className="handyman-jobs" aria-label="Common handyman jobs">{commonJobs.map((job, index) => <button className={`handyman-job job-${index + 1}`} key={job.title} onClick={() => openGuide(`I need help with ${job.request}.`)}><span className="job-icon">{job.icon}</span><span className="job-number">0{index + 1}</span><h3>{job.title}</h3><p>{job.copy}</p><span className="job-link">Start this request <b>→</b></span></button>)}</section>

          <section className="handyman-explainer">
            <div className="handyman-explainer-image"><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/ksttKdlbWarTUXvk.jpg" alt="A careful cabinet hardware adjustment" /></div>
            <div className="handyman-explainer-copy"><div className="eyebrow">Make the request useful</div><h2>A few details go a long way.</h2><p>You do not need to diagnose the problem. A photo, a simple measurement, or a sentence about what changed can make the next step much clearer.</p><ul><li><span>01</span> What are you trying to fix, hang, or finish?</li><li><span>02</span> Where in the home is it?</li><li><span>03</span> Do you already have the hardware or part?</li></ul><button className="text-action" onClick={() => openGuide("I have a handyman job and want to describe the details.")}>Tell the Guide about the job <b>→</b></button></div>
          </section>

          <section className="handyman-fit">
            <div className="fit-head"><div className="eyebrow">A good fit when</div><h2>Small jobs deserve a clear path too.</h2></div>
            <div className="fit-grid"><div className="fit-card fit-yes"><span>Good House can help you start with</span><strong>Everyday repairs, finishing work, simple installations, and a short list of household jobs.</strong></div><div className="fit-card fit-note"><span>Best to describe first</span><strong>Work that may involve permits, licensed trade work, structural changes, or a larger project scope.</strong></div></div>
          </section>

          <section className="handyman-steps"><div className="eyebrow">How booking works</div><h2>From a short list to a scheduled visit.</h2><div className="handyman-step-grid"><div><b>1</b><h3>Describe the work</h3><p>Type it naturally. The Guide helps organize the request without asking you to use the right trade terms.</p></div><div><b>2</b><h3>Open the right form</h3><p>When you choose to book, the relevant details are already carried into the service form.</p></div><div><b>3</b><h3>Review before checkout</h3><p>Check the job details and preferred time before proceeding to the secure payment step.</p></div></div></section>

          <section className="handyman-faq" aria-labelledby="handyman-faq-title"><div className="faq-heading"><div className="eyebrow">Questions, answered</div><h2 id="handyman-faq-title">Before you ask for a hand.</h2><p>Start with the detail you have. The Guide can help you figure out what else belongs in the request.</p><button className="btn secondary" onClick={() => openGuide("I have a question about handyman help.")}>Ask the Guide →</button></div><div className="faq-list">{faqItems.map(([question, answer], index) => <div className={`faq-item ${openFaq === index ? "is-open" : ""}`} key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{question}</span><b>{openFaq === index ? "−" : "+"}</b></button>{openFaq === index && <p>{answer}</p>}</div>)}</div></section>

          <section className="handyman-bottom-cta"><div><div className="eyebrow">Start where you are</div><h2>What has been on your list too long?</h2><p>A sentence is enough. The Good House Guide can help find the right way forward.</p></div><button className="btn" onClick={() => openGuide("I need help with a few jobs around my home.")}>Describe the job →</button></section>
        </main>
        <footer><a href="/" className="brand brand-link"><div className="logo"><svg className="brand-symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3l8.5 7.5v10H3.5z" /><path className="brand-door" d="M9.25 20.5v-6h5.5v6z" /></svg></div><strong>Good House Co.</strong></a><span>The good kind of help for home</span><span>General Handyman</span></footer>
      </div>
      <BookingAssistant open={chatOpen} requestText={request} onClose={() => setChatOpen(false)} />
    </>
  );
}
