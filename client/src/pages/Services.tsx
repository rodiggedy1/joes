/**
 * Design reference: an original, image-led service directory for Joe's Home Services.
 * Maintain the warm white surface, charcoal utility type, lime booking actions, and generous editorial spacing.
 */
import { useLocation } from "wouter";
import "./services.css";

type FeaturedService = {
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  request: string;
  size?: "wide" | "standard";
};

const featured: FeaturedService[] = [
  {
    title: "Home cleaning",
    eyebrow: "Cleaning",
    description: "Regular resets, deeper cleanups, and move-day refreshes shaped around your home.",
    image: "/manus-storage/joes-services-home-cleaning_9c609808.jpg",
    request: "home cleaning",
    size: "wide",
  },
  {
    title: "TV & wall mounting",
    eyebrow: "TV & electronics",
    description: "Televisions, soundbars, shelves, and a cleaner cable setup for the room you use most.",
    image: "/manus-storage/joes-services-tv-mounting_bbbba180.jpg",
    request: "TV mounting",
  },
  {
    title: "Furniture assembly",
    eyebrow: "Assembly",
    description: "Beds, desks, dressers, shelving, and the just-delivered pieces that need a steady hand.",
    image: "/manus-storage/joes-services-furniture-assembly_3015e8d0.jpg",
    request: "furniture assembly",
  },
  {
    title: "Handyman & repairs",
    eyebrow: "General handyman",
    description: "Punch lists, hardware, minor repairs, trim work, and those jobs that have been waiting.",
    image: "/manus-storage/joes-services-home-repair_31127fc0.jpg",
    request: "a handyman repair",
  },
  {
    title: "Interior painting",
    eyebrow: "Painting",
    description: "A fresh wall, a focused accent, or the finishing touch that changes how a room feels.",
    image: "/manus-storage/joes-services-fresh-paint_13b9dee9.jpg",
    request: "interior painting",
    size: "wide",
  },
];

const moreServices = [
  ["Plumbing", "Faucets, fixtures, clogs, and household plumbing requests.", "plumbing help", "↗"],
  ["Electrical & lighting", "Outlets, switches, lighting, ceiling fans, and smaller electrical projects.", "electrical and lighting help", "↗"],
  ["Moving help", "Loading, unloading, in-home moves, and the heavy lifting in between.", "moving help", "↗"],
  ["Smart home setup", "Doorbells, cameras, thermostats, routers, and the devices that connect your space.", "smart home setup", "↗"],
  ["Hanging & shelves", "Art, mirrors, curtain hardware, rails, floating shelves, and more.", "hanging pictures and shelves", "↗"],
  ["A job not listed", "Describe what needs attention. We’ll help turn it into a clear next step.", "something else around my home", "✦"],
];

export default function Services() {
  const [, setLocation] = useLocation();

  function startRequest(service: string) {
    setLocation(`/?service=${encodeURIComponent(service)}`);
  }

  return (
    <div className="site services-page">
      <header className="services-header">
        <a href="/" className="brand brand-link" aria-label="Return to Joe's Home Services home page">
          <div className="logo">J</div>
          <div><strong>Joe&apos;s Home Services</strong><small>Cleaning · Handyman · Home Care</small></div>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a className="nav-active" href="/services">Services</a>
          <a href="/#reviews">Reviews</a>
          <a href="/#about">About</a>
        </nav>
        <button className="btn" onClick={() => startRequest("a home service")}>Book now</button>
      </header>

      <main>
        <section className="services-hero-page">
          <div className="services-hero-copy">
            <div className="eyebrow">Joe&apos;s Home Services</div>
            <h1>Choose the help.<br /><em>We’ll handle the rest.</em></h1>
            <p>For the jobs that keep a home moving, growing, and feeling like yours. Pick a service or simply tell us what needs doing.</p>
            <button className="btn" onClick={() => startRequest("a home service")}>Tell Joe&apos;s AI what you need ✨</button>
          </div>
          <div className="services-hero-note">
            <span className="note-mark">✦</span>
            <p>Start with the job in plain language. The assistant helps clarify the scope and find the next step.</p>
            <div><span>1</span> Describe it <i /> <span>2</span> Review the plan <i /> <span>3</span> Book it</div>
          </div>
        </section>

        <section className="featured-services" aria-labelledby="featured-services-title">
          <div className="section-head"><div><div className="eyebrow">Popular at home</div><h2 id="featured-services-title">The services people ask for most.</h2></div><p>These are a few good places to start. Each request can be tailored to your space, timing, and task.</p></div>
          <div className="photo-service-grid">
            {featured.map((service) => (
              <article className={`photo-service-card ${service.size === "wide" ? "photo-card-wide" : ""}`} key={service.title}>
                <img src={service.image} alt="" />
                <div className="photo-card-shade" />
                <div className="photo-card-content"><div className="eyebrow">{service.eyebrow}</div><h3>{service.title}</h3><p>{service.description}</p><button className="photo-link" onClick={() => startRequest(service.request)}>Explore service <span>↗</span></button></div>
              </article>
            ))}
          </div>
        </section>

        <section className="more-services" aria-labelledby="more-services-title">
          <div className="section-head"><div><div className="eyebrow">More ways we can help</div><h2 id="more-services-title">Keep the list moving.</h2></div><p>If it belongs on a home to-do list, it belongs in the conversation.</p></div>
          <div className="more-service-grid">
            {moreServices.map(([title, description, request, symbol]) => (
              <button className="more-service-card" key={title} onClick={() => startRequest(request)}>
                <span className="more-service-symbol">{symbol}</span><h3>{title}</h3><p>{description}</p><span className="card-ask">Ask about it <b>→</b></span>
              </button>
            ))}
          </div>
        </section>

        <section className="services-cta"><div><div className="eyebrow">Not sure what to call the job?</div><h2>Describe it your way.</h2><p>“The bathroom faucet won’t stop dripping” is a perfectly good place to start.</p></div><button className="btn" onClick={() => startRequest("I need help with a job around my home")}>Start a request →</button></section>
      </main>

      <footer><a href="/" className="brand brand-link"><div className="logo">J</div><strong>Joe&apos;s Home Services</strong></a><span>Cleaning · Handyman · Home Care</span><span>Tell us what needs doing</span></footer>
    </div>
  );
}
