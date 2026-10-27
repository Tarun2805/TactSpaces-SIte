export default function StudioPage() {
  return (
    <>
<header className="page-header has-aside reveal">
  <div className="ph-copy">
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

<section className="studio-gallery-section" aria-labelledby="studio-gallery-title">
  <div className="section-head reveal">
    <h2 id="studio-gallery-title">Our Studio Space</h2>
  </div>
  <div className="studio-gallery reveal">
    <div className="studio-gallery__placeholder" role="img" aria-label="Office photo placeholder 1" />
    <div className="studio-gallery__placeholder" role="img" aria-label="Office photo placeholder 2" />
    <div className="studio-gallery__placeholder" role="img" aria-label="Office photo placeholder 3" />
    <div className="studio-gallery__placeholder" role="img" aria-label="Office photo placeholder 4" />
    <div className="studio-gallery__placeholder" role="img" aria-label="Office photo placeholder 5" />
  </div>
</section>

<section id="team" className="team-split">
  <div className="team-main">
   <div className="section-head reveal"><h2>Driving the vision…</h2></div>
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

<section className="home-commitment" aria-labelledby="commitment-title">
  <div className="section-head reveal">
    <h2 id="commitment-title">Our commitment</h2>
  </div>
  <div className="trust-grid reveal">
    <div className="trust-card">
      <span className="idx">01</span>
      <h3>Absolute Financial Transparency</h3>
      <p>Costs are itemized against a Master Contract before a single vendor is booked. No hidden markups, no verbal change orders.</p>
    </div>
    <div className="trust-card">
      <span className="idx">02</span>
      <h3>Single-Point Responsibility</h3>
      <p>One team owns design and execution end to end. One call, not five contractors, whenever a decision is needed.</p>
    </div>
    <div className="trust-card">
      <span className="idx">03</span>
      <h3>Contractual Timely Delivery</h3>
      <p>Timelines are binding, not aspirational. D Hoofers Dance Studio: 4,000&nbsp;sq.&nbsp;ft. in 45&nbsp;days, exactly as signed for.</p>
    </div>
  </div>
</section>

<section id="profile">
  <div className="profile-cta reveal">
    <div>
      <h3>Want the full studio profile?</h3>
      <p>Services, process, team, and the complete project list in one document.</p>
    </div>
     <a className="btn" href="mailto:tactspaces@gmail.com?subject=Request%20for%20TactSpaces%20Studio%20Profile">Request Studio Profile →</a>
  </div>
</section>
    </>
  );
}
