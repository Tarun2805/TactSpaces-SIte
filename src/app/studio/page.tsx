export default function StudioPage() {
  return (
    <>
<header className="page-header has-aside reveal">
  <div className="ph-copy">
  <p className="eyebrow">The Studio</p>
  <h1>Two Architects. One Standard.</h1>
  <p>Founded in 2025, TactSpaces is the result of two architects coming together with a shared vision to create spaces that are thoughtful, functional, and timeless. What began as a shared passion has grown into a partnership dedicated to transforming ideas into spaces that truly reflect the people who inhabit them.</p>
</div>
  <aside className="studio-facts" aria-label="Studio at a glance">
    <dl>
      <div><dt>Founded</dt><dd>2025</dd></div>
      <div><dt>Studio</dt><dd>Kereguddadahalli, Bengaluru</dd></div>
      <div><dt>Mandates</dt><dd>8 across Bengaluru and Goa</dd></div>
      <div><dt>Services</dt><dd>Architecture, interiors, turnkey execution</dd></div>
    </dl>
  </aside>
</header>

<section id="team" className="team-split">
  <div className="team-main">
  <div className="section-head reveal"><p className="eyebrow">Our Team</p><h2>The two behind every mandate.</h2></div>
  <div className="team-grid reveal">
    <div className="team-card">
      <div className="photo"><div className="blk left-[15%] top-[10%] w-[70%] h-[80%]" /></div>
      <h3>Sarthak Mittal</h3>
      <span className="role">Architect · Co-Founder</span>
    </div>
    <div className="team-card">
      <div className="photo"><div className="blk left-[15%] top-[10%] w-[70%] h-[80%]" /></div>
      <h3>Tarun Sai</h3>
      <span className="role">Architect · Co-Founder</span>
    </div>
  </div>
  </div>
  <blockquote className="team-quote reveal">Creativity and precision aren't a trade-off.<span>Founded in 2025 on that shared belief.</span></blockquote>
</section>

<section className="bg-alabaster-deep [border-top:1px_solid_var(--line)] [border-bottom:1px_solid_var(--line)]">
  <div className="mission-vision reveal">
    <div className="mv-card">
      <h3>Vision</h3>
      <p>To create spaces that are a true reflection of the people, businesses, and communities they serve. Every project begins with our client's aspirations, functional needs, and context, resulting in spaces where functionality and aesthetics stay in balance.</p>
    </div>
    <div className="mv-card">
      <h3>Mission</h3>
      <p>To deliver architecture and interior solutions with precision, integrity, and attention to detail, from concept to completion, through collaborative design, technical expertise, and consistent quality.</p>
    </div>
  </div>
</section>

<section className="why-split">
  <div className="section-head reveal"><p className="eyebrow">Why Choose Us</p><h2>Understand. Design. Deliver.</h2></div>
  <ul className="why-list reveal">
    <li><span className="n">01</span><p>We start by listening to your lifestyle, requirements, and aspirations.</p></li>
    <li><span className="n">02</span><p>Every decision is driven by functionality, with aesthetics evolving naturally.</p></li>
    <li><span className="n">03</span><p>We ensure every idea is executed with precision, quality, and attention to detail.</p></li>
    <li><span className="n">04</span><p>Transparent communication throughout the project.</p></li>
    <li><span className="n">05</span><p>Single-point responsibility from design to execution.</p></li>
  </ul>
</section>

<section id="profile">
  <div className="profile-cta reveal">
    <div>
      <h3>Want the full studio profile?</h3>
      <p>Services, process, team, and the complete project list in one document.</p>
    </div>
    <a className="btn" href="#">Download Profile (PDF) →</a>
  </div>
</section>
    </>
  );
}
