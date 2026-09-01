/**
 * Design reference: original category-led service directory inspired by the user's requested browsing model.
 * Maintain Good House Co.'s warm white editorial surface, charcoal utility typography, lime actions, and image-led popular services.
 */
import { useState } from "react";
import { useLocation } from "wouter";
import "./services.css";

type Service = { title: string; description: string; request: string; image?: string; accent?: string };

const categoryOrder = [
  "Popular", "Cleaning", "TV & Electronics", "Assembly", "General Handyman", "Plumbing", "Electrical", "Painting", "Moving", "Smart Home", "Window Treatments", "Home Improvement Projects",
];

const catalog: Record<string, Service[]> = {
  Popular: [
    { title: "Home cleaning", description: "Regular resets, deeper cleanups, and move-day refreshes shaped around your home.", request: "home cleaning", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/GIaGFBZcskrjlLsK.jpg", accent: "Cleaning" },
    { title: "TV & wall mounting", description: "Televisions, soundbars, shelves, and cleaner cable setups for the room you use most.", request: "TV mounting", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/baSoauykNRogxOrL.jpg", accent: "TV & electronics" },
    { title: "Furniture assembly", description: "Beds, desks, dressers, shelving, and the just-delivered pieces that need a steady hand.", request: "furniture assembly", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/ApnFdzxltPesPxZG.jpg", accent: "Assembly" },
    { title: "Handyman & repairs", description: "Punch lists, hardware, minor repairs, trim work, and jobs that have been waiting.", request: "a handyman repair", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/sJkZbYPnJljBXNVv.jpg", accent: "General handyman" },
    { title: "Interior painting", description: "A fresh wall, a focused accent, or the finishing touch that changes how a room feels.", request: "interior painting", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/TrUJosFNIoPbWYDk.jpg", accent: "Painting" },
  ],
  Cleaning: [
    { title: "Home cleaning", description: "A practical reset for the spaces you use every day.", request: "home cleaning" },
    { title: "Deep cleaning", description: "Extra attention for kitchens, bathrooms, and the details that build up.", request: "a deep home cleaning" },
    { title: "Move-day cleaning", description: "A cleaner start before move-in or a cleaner finish after move-out.", request: "move-in or move-out cleaning" },
    { title: "Recurring upkeep", description: "Set a routine that helps the home stay in shape week after week.", request: "recurring home cleaning" },
  ],
  "TV & Electronics": [
    { title: "TV mounting", description: "Secure wall mounting with room-aware placement and tidy finish work.", request: "TV mounting" },
    { title: "Soundbar setup", description: "Mount and connect the soundbar that completes your setup.", request: "soundbar installation" },
    { title: "Home theater setup", description: "Help with screens, media components, and the connections between them.", request: "home theater setup" },
    { title: "Cable tidy-up", description: "Organize visible cables for a cleaner-looking entertainment wall.", request: "TV cable management" },
  ],
  Assembly: [
    { title: "Furniture assembly", description: "Build beds, desks, dressers, shelves, and storage pieces.", request: "furniture assembly" },
    { title: "Bed assembly", description: "Get a new bed frame securely assembled and ready for the room.", request: "bed assembly" },
    { title: "Desk & workspace", description: "Assemble the desk, chair, shelving, or office furniture on your list.", request: "office furniture assembly" },
    { title: "Outdoor furniture", description: "Put together patio sets, grills, and outdoor pieces for the season.", request: "outdoor furniture assembly" },
  ],
  "General Handyman": [
    { title: "Small home repairs", description: "Handle the familiar fixes that don’t need a full renovation.", request: "small home repairs" },
    { title: "Hanging & shelves", description: "Art, mirrors, rails, and shelves placed with care.", request: "hanging pictures and shelves" },
    { title: "Door & hardware", description: "Adjustments, handles, locks, hinges, and household hardware.", request: "door and hardware repairs" },
    { title: "Patch & touch-up", description: "Minor wall patches, caulking, and finish work around the home.", request: "minor drywall and caulking repairs" },
  ],
  Plumbing: [
    { title: "Faucet repair", description: "Address drips, slow flow, loose hardware, or worn fittings.", request: "faucet repair" },
    { title: "Fixture installation", description: "Install a replacement faucet, shower fixture, or bathroom hardware.", request: "plumbing fixture installation" },
    { title: "Drain troubleshooting", description: "Help with slow drains, clogs, and the next step for a clearer line.", request: "drain troubleshooting" },
    { title: "Toilet repair", description: "Diagnose common toilet issues such as leaks, running water, or loose parts.", request: "toilet repair" },
  ],
  Electrical: [
    { title: "Light fixtures", description: "Refresh the room with a new pendant, flush mount, or wall light.", request: "light fixture installation" },
    { title: "Ceiling fans", description: "Install or replace a ceiling fan for better comfort and circulation.", request: "ceiling fan installation" },
    { title: "Outlets & switches", description: "Help with new covers, smart switches, and small electrical upgrades.", request: "outlet or switch installation" },
    { title: "Device connection", description: "Connect a household device or appliance that needs an extra hand.", request: "appliance or device connection" },
  ],
  Painting: [
    { title: "Interior painting", description: "Give a room a new mood with fresh, even interior paint.", request: "interior painting" },
    { title: "Accent walls", description: "Add a focused color moment without taking on an entire room.", request: "accent wall painting" },
    { title: "Trim & doors", description: "Freshen baseboards, door frames, and the details around a room.", request: "trim and door painting" },
    { title: "Paint touch-ups", description: "Take care of scuffs, nicks, and small areas that need attention.", request: "paint touch-ups" },
  ],
  Moving: [
    { title: "Loading & unloading", description: "Get help with the physical work at either end of a move.", request: "moving help for loading and unloading" },
    { title: "In-home moving", description: "Move large pieces between rooms or rework a room layout.", request: "in-home furniture moving" },
    { title: "Move-in setup", description: "Assemble, place, and settle the key pieces once you arrive.", request: "move-in setup help" },
    { title: "Move-out reset", description: "Pair lifting help with a clean, clear handoff to the next chapter.", request: "move-out help" },
  ],
  "Smart Home": [
    { title: "Doorbell & camera", description: "Set up a front-door camera or doorbell with a clean installation.", request: "doorbell or camera setup" },
    { title: "Wi-Fi & router setup", description: "Get the home network and connected devices working together.", request: "Wi-Fi router setup" },
    { title: "Smart thermostat", description: "Install and configure a thermostat that fits your daily routine.", request: "smart thermostat setup" },
    { title: "Connected devices", description: "Set up smart lights, plugs, hubs, and other home technology.", request: "smart home device setup" },
  ],
  "Window Treatments": [
    { title: "Blind installation", description: "Measure, mount, and fit the blinds that suit your room.", request: "window blind installation" },
    { title: "Curtains & drapery", description: "Install rods, tracks, curtains, and drapery hardware securely.", request: "curtain and drapery installation" },
    { title: "Shade installation", description: "Put up roller, cellular, or other shades for privacy and light control.", request: "window shade installation" },
    { title: "Curtain hardware", description: "Mount rods, rails, brackets, and the finishing details around a window.", request: "curtain rod installation" },
  ],
  "Home Improvement Projects": [
    { title: "Drywall & patching", description: "Address holes, dents, and smaller wall repairs before the next finish.", request: "drywall patching" },
    { title: "Storage & shelving", description: "Add practical storage where the room needs it most.", request: "shelving installation" },
    { title: "Weatherproofing", description: "Tackle drafty thresholds, trim gaps, and small seasonal fixes.", request: "home weatherproofing" },
    { title: "Project planning", description: "Describe the improvement you have in mind and start with a clear scope.", request: "a home improvement project" },
  ],
};

const categoryMosaics: Record<string, string> = {
  Cleaning: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/FZVuzcnguMKqLqOB.jpg", "TV & Electronics": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/dXrOiGMVkcakKOXj.jpg",
  Assembly: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/cvYPmYvkkICtAirs.jpg", "General Handyman": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/LIzjOiAPUsvHiKUL.jpg",
  Plumbing: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/idfhQFnmCFQwNUvi.jpg", Electrical: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/hjiQoEkXJDwsWnSf.jpg",
  Painting: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/GxzEnfQzQzPNkJzD.jpg", Moving: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/QiGsJnhaxKLnTgku.jpg",
  "Smart Home": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/HCOzNjOSzZVnSyAG.jpg", "Window Treatments": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/PPGwhHVfcEHjjKln.jpg",
  "Home Improvement Projects": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663254023424/bBTqxSdgDHPNeqwO.jpg",
};

const mosaicCropPositions = [["0%", "0%"], ["-50%", "0%"], ["0%", "-50%"], ["-50%", "-50%"]] as const;

export default function Services() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("Popular");
  const activeServices = catalog[activeCategory];

  function startRequest(service: string) { setLocation(`/?service=${encodeURIComponent(service)}`); }
  function chooseCategory(category: string) { setActiveCategory(category); }

  return (
    <div className="site services-page">
      <header className="services-header">
        <a href="/" className="brand brand-link" aria-label="Return to Good House Co. home page"><div className="logo"><span className="brand-symbol" aria-hidden="true" /></div><div><strong>Good House Co.</strong><small>The good kind of help for home</small></div></a>
        <nav className="nav" aria-label="Main navigation"><a className="nav-active" href="/services">Services</a><a href="/#reviews">Reviews</a><a href="/#about">About</a></nav>
        <button className="btn" onClick={() => startRequest("a home service")}>Book now</button>
      </header>

      <main>
        <section className="services-hero-page">
          <div className="services-hero-copy"><div className="eyebrow">Good House Co.</div><h1>One home.<br /><em>More handled.</em></h1><p>Browse the job by category, then choose the kind of help you need. Don’t see the exact words? Just describe the job instead.</p><button className="btn" onClick={() => startRequest("a home service")}>Tell Good House what you need ✨</button></div>
          <div className="services-hero-note"><span className="note-mark">✦</span><p>Start in plain language. The assistant helps clarify the scope and turn the request into a booking path.</p><div><span>1</span> Describe it <i /> <span>2</span> Review the plan <i /> <span>3</span> Book it</div></div>
        </section>

        <section className="directory-section" aria-labelledby="directory-title">
          <div className="directory-heading"><div className="eyebrow">Service directory</div><h2 id="directory-title">All categories.</h2><p>Find the category that sounds closest. Each option opens a clear, simple service request.</p></div>
          <div className="directory-layout">
            <aside className="category-sidebar" aria-label="Service categories"><div className="category-label">Browse categories</div>{categoryOrder.map((category) => <button className={`category-button ${activeCategory === category ? "is-active" : ""}`} key={category} onClick={() => chooseCategory(category)}>{category}<span>→</span></button>)}</aside>
            <div className="category-results" aria-live="polite">
              <div className="results-head"><div><div className="eyebrow">{activeCategory}</div><h3>{activeCategory === "Popular" ? "A few places to begin." : `Explore ${activeCategory.toLowerCase()}.`}</h3></div><p>{activeCategory === "Popular" ? "The most frequently requested jobs, shown with a little more detail." : "Choose a service to begin your request, then add the details that make it yours."}</p></div>
              <div className={`directory-card-grid ${activeCategory === "Popular" ? "is-popular" : ""}`}>
                {activeServices.map((service, index) => service.image ? (
                  <article className={`directory-photo-card ${index === 0 ? "photo-feature" : ""}`} key={service.title}><img src={service.image} alt="" /><div className="photo-card-shade" /><div className="photo-card-content"><div className="eyebrow">{service.accent}</div><h4>{service.title}</h4><p>{service.description}</p><button className="photo-link" onClick={() => startRequest(service.request)}>Explore service <span>↗</span></button></div></article>
                ) : (
                  (() => { const [x, y] = mosaicCropPositions[index % mosaicCropPositions.length]; return <button className="directory-service-card" key={service.title} onClick={() => startRequest(service.request)}><span className="service-index">{String(index + 1).padStart(2, "0")}</span><span className="service-thumbnail"><img src={categoryMosaics[activeCategory]} alt="" style={{ transform: `translate(${x}, ${y})` }} /></span><h4>{service.title}</h4><p>{service.description}</p><span className="card-ask">Start a request <b>→</b></span></button>; })()
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="services-cta"><div><div className="eyebrow">Not sure what to call the job?</div><h2>Describe it your way.</h2><p>“The bathroom faucet won’t stop dripping” is a perfectly good place to start.</p></div><button className="btn" onClick={() => startRequest("I need help with a job around my home")}>Start a request →</button></section>
      </main>

      <footer><a href="/" className="brand brand-link"><div className="logo"><span className="brand-symbol" aria-hidden="true" /></div><strong>Good House Co.</strong></a><span>The good kind of help for home</span><span>Tell us what needs doing</span></footer>
    </div>
  );
}
