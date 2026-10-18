import { useEffect, useState } from 'react';
import logo from '../../assets/tactspaces-logo.png';
import { HERO_REVEAL_DELAY_MS } from '../../constants/site-navigation';

export default function HomePage() {
  const [isAnimated, setIsAnimated] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setIsAnimated(true), HERO_REVEAL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
<section className="hero p-0">
  <div className="hero-copy">
    <p className="eyebrow">TactSpaces Architecture &amp; Interiors</p>
    <h1>Architecture &amp; Interiors.<br />Governed by Precision.</h1>
    <p>Turnkey design and execution across Bengaluru, where every material, timeline, and rupee is documented before it's promised.</p>
    <div className="hero-ctas">
      <a className="btn" href="command-center.html">Start Your Project →</a>
      <a href="standard.html" className="ghost">View the Standard ↓</a>
    </div>
  </div>
  <div className={`hero-visual${isAnimated ? ' animate' : ''}`} id="heroVisual">
    <div className="render-block"></div>

    <div className="logo-reveal">
      <img src={logo} alt="TactSpaces" />
    </div>
    <div className="tag">
      <span>Blueprint</span>
      <span>→ Executed Reality</span>
    </div>
  </div>
</section>

<section>
  <div className="section-head reveal">
    <p className="eyebrow">Why TactSpaces</p>
    <h2>What we guarantee, in writing.</h2>
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
      <p>Timelines are binding, not aspirational. D Hoofers Dance Studio: 4,000 sq. ft. in 45 days, exactly as signed for.</p>
    </div>
  </div>
</section>

<section>
  <div className="section-head reveal">
    <p className="eyebrow">Selected Mandates</p>
    <h2>Evidence of execution.</h2>
  </div>
  <div className="work-strip reveal">
    <a className="work-card" href="anatomy.html">
      <div className="work-image">
        <div className="blocks">
          <div className="left-0 top-0 w-[55%] h-[60%] opacity-85" />
          <div className="left-[58%] top-[8%] w-[40%] h-[35%] bg-accent" />
          <div className="left-[15%] top-[64%] w-[70%] h-[32%] opacity-70" />
        </div>
        <div className="callout">Charcoal fluted panel · reception facade</div>
      </div>
      <div className="work-meta"><span>Horamavu, Bengaluru</span><span>45 days</span></div>
      <h3>D Hoofers Dance Studio</h3>
      <span className="stat">4,000 sq. ft. · Design &amp; Execution</span>
    </a>
    <a className="work-card" href="anatomy.html">
      <div className="work-image">
        <div className="blocks">
          <div className="left-[10%] top-[10%] w-[35%] h-[80%] opacity-80" />
          <div className="left-[50%] top-[30%] w-[42%] h-[24%] bg-accent" />
          <div className="left-[50%] top-[60%] w-[42%] h-[30%] opacity-65" />
        </div>
        <div className="callout">Seamless ACP cladding · kitchen run</div>
      </div>
      <div className="work-meta"><span>Shettyhalli, Bengaluru</span><span>3 months</span></div>
      <h3>Pinaki Residence</h3>
      <span className="stat">1,430 sq. ft. · Turnkey Execution</span>
    </a>
    <a className="work-card" href="anatomy.html">
      <div className="work-image">
        <div className="blocks">
          <div className="left-0 top-[20%] w-[60%] h-[60%] opacity-80" />
          <div className="left-[64%] top-0 w-[34%] h-[44%] bg-accent" />
          <div className="left-[64%] top-[48%] w-[34%] h-[40%] opacity-60" />
        </div>
        <div className="callout">L-shaped glazing profile · living wall</div>
      </div>
      <div className="work-meta"><span>Kanakapura, Bengaluru</span><span>1 month</span></div>
      <h3>Manjunath Residence</h3>
      <span className="stat">2,400 sq. ft. · Interior Design</span>
    </a>
  </div>
</section>

<div className="founders reveal">
  <blockquote>"Founded in 2025, on a shared belief that creativity and precision aren't a trade-off."</blockquote>
  <div className="founder-names">
    <div><span className="name">Sarthak Mittal</span><span className="title">Architect · Co-Founder</span></div>
    <div><span className="name">Tarun Sai</span><span className="title">Architect · Co-Founder</span></div>
  </div>
</div>
    </>
  );
}
