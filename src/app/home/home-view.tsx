'use client';

import { useEffect, useState } from 'react';
import logo from '../../assets/tactspaces-logo.png';
import { HERO_REVEAL_DELAY_MS } from '../../constants/site-navigation';
import { PROJECTS } from '../../constants/projects';
import { HomeProjectCard } from '../../components/shared/project-card';

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
      <a className="btn" href="/command-center">Start Your Project →</a>
      <a href="/standard" className="ghost">View the Standard ↓</a>
    </div>
  </div>
  <div className={`hero-visual${isAnimated ? ' animate' : ''}`} id="heroVisual">
    <div className="render-block"></div>

    <div className="logo-reveal">
      <img src={typeof logo === 'string' ? logo : logo.src} alt="TactSpaces" />
    </div>
  </div>
</section>

<section>
  <div className="section-head reveal">
    <h2>Evidence of execution.</h2>
  </div>
  <div className="work-strip reveal">
    {PROJECTS.filter((project) => project.featured).map((project) => (
      <HomeProjectCard key={project.slug} project={project} />
    ))}
  </div>
</section>

<section className="why-split">
  <div className="section-head reveal"><h2>Understand. Design. Deliver.</h2></div>
  <ul className="why-list reveal">
    <li><span className="n">01</span><p>We start by listening to your lifestyle, requirements, and aspirations.</p></li>
    <li><span className="n">02</span><p>Every decision is driven by functionality, with aesthetics evolving naturally.</p></li>
    <li><span className="n">03</span><p>We ensure every idea is executed with precision, quality, and attention to detail.</p></li>
    <li><span className="n">04</span><p>Transparent communication throughout the project.</p></li>
    <li><span className="n">05</span><p>Single-point responsibility from design to execution.</p></li>
  </ul>
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
