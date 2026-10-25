import { useEffect, useState } from 'react';
import logo from '../../assets/tactspaces-logo.png';
import { HERO_REVEAL_DELAY_MS } from '../../constants/site-navigation';
import { PROJECTS } from '../../constants/projects';
import { ProjectCard } from '../../components/shared/project-card';

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
  </div>
</section>

<section>
  <div className="section-head reveal">
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
      <p>Timelines are binding, not aspirational. D Hoofers Dance Studio: 4,000&nbsp;sq.&nbsp;ft. in 45&nbsp;days, exactly as signed for.</p>
    </div>
  </div>
</section>

<section>
  <div className="section-head reveal">
    <h2>Evidence of execution.</h2>
  </div>
  <div className="work-strip reveal">
    {PROJECTS.filter((project) => project.featured).map((project) => (
      <ProjectCard key={project.slug} project={project} variant="home" />
    ))}
  </div>
</section>

<div className="founders reveal">
  <blockquote>“Founded in 2025, on a shared belief that creativity and precision aren't a trade-off.”</blockquote>
  <div className="founder-names">
    <div><span className="name">Sarthak Mittal</span><span className="title">Architect · Co-Founder</span></div>
    <div><span className="name">Tarun Sai</span><span className="title">Architect · Co-Founder</span></div>
  </div>
</div>
    </>
  );
}
