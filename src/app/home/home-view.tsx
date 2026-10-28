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
<section className="hero grid min-h-screen grid-cols-2 p-0 pt-0 max-[900px]:grid-cols-1 max-[640px]:min-h-0 max-[640px]:!pt-[var(--nav-h)]">
  <div className="hero-copy flex max-w-[560px] flex-col justify-center px-[5vw] max-[900px]:px-[6vw] max-[900px]:py-16 max-[640px]:max-w-none max-[640px]:px-5 max-[640px]:pt-8 max-[640px]:pb-[3.25rem]">
    <h1 className="mt-[1.2rem] mb-[1.4rem] text-[clamp(2.6rem,4.6vw,4.6rem)] max-[640px]:mt-4 max-[640px]:mb-[1.1rem] max-[640px]:text-[clamp(2.1rem,9.6vw,2.5rem)] max-[640px]:leading-[1.08]">Architecture &amp; Interiors.<br />Governed by Precision.</h1>
    <p className="mb-[2.2rem] max-w-[440px] text-[1.05rem] leading-[1.65] text-[#454e4a] max-[640px]:mb-7 max-[640px]:text-base">Turnkey design and execution across Bengaluru, where every material, timeline, and rupee is documented before it's promised.</p>
    <div className="hero-ctas flex flex-wrap items-center gap-x-[1.5rem] gap-y-4">
      <a className="inline-flex items-center justify-center gap-2 rounded-[2px] border-0 bg-forest px-6 py-3 text-[.875rem] leading-[1.4] font-semibold tracking-[.01em] text-alabaster transition-[background,transform] duration-300 hover:-translate-y-px hover:bg-forest-hover max-[640px]:min-h-12" href="/command-center">Start Your Project →</a>
      <a href="/standard" className="ghost text-[0.875rem] font-semibold leading-[1.5] max-[640px]:inline-flex max-[640px]:min-h-11 max-[640px]:items-center">View the Standard ↓</a>
    </div>
  </div>
  <div className={`hero-visual relative overflow-hidden bg-[#edebe3] max-[900px]:order-[-1] max-[900px]:min-h-[60vh] max-[640px]:min-h-0 max-[640px]:h-[clamp(220px,34vh,300px)] supports-[height:100svh]:max-[640px]:h-[clamp(220px,34svh,300px)]${isAnimated ? ' animate' : ''}`} id="heroVisual">
    <div className="render-block"></div>

    <div className="logo-reveal absolute left-1/2 top-1/2 w-1/2 max-w-[380px] -translate-x-1/2 -translate-y-1/2 max-[640px]:w-[58%]">
       <img className="block h-auto w-full brightness-0 invert" src={typeof logo === 'string' ? logo : logo.src} alt="TactSpaces" width="1604" height="731" />
    </div>
  </div>
</section>

<section className="px-[5vw] py-20 max-[640px]:px-5 max-[640px]:py-14">
  <div className="section-head reveal mb-14 max-w-[640px] max-[640px]:mb-8">
    <h2 className="mt-4 text-[clamp(1.9rem,3vw,2.8rem)] max-[640px]:text-[clamp(1.7rem,7.5vw,2.1rem)]">Evidence of execution.</h2>
  </div>
  <div className="work-strip reveal grid auto-cols-[minmax(320px,30vw)] grid-flow-col gap-[1.6rem] overflow-x-auto pb-4 [scroll-snap-type:x_mandatory] max-[640px]:mx-[-20px] max-[640px]:auto-cols-[minmax(250px,76vw)] max-[640px]:px-5 max-[640px]:pb-4 max-[640px]:[scroll-padding-left:20px]">
    {PROJECTS.filter((project) => project.featured).map((project) => (
      <HomeProjectCard key={project.slug} project={project} />
    ))}
  </div>
</section>

<section className="why-split px-[5vw] py-20 max-[640px]:px-5 max-[640px]:py-14 min-[901px]:grid min-[901px]:grid-cols-[minmax(260px,0.7fr)_minmax(0,1.3fr)] min-[901px]:items-start min-[901px]:gap-24">
  <div className="section-head reveal mb-14 max-w-[640px] min-[901px]:sticky min-[901px]:top-[110px] min-[901px]:mb-0"><h2 className="mt-4 text-[clamp(1.9rem,3vw,2.8rem)] max-[640px]:text-[clamp(1.7rem,7.5vw,2.1rem)]">Understand. Design. Deliver.</h2></div>
  <ul className="why-list reveal max-w-[720px] min-[901px]:max-w-none">
    <li className="flex list-none items-baseline gap-[1.2rem] border-b border-line py-[1.4rem] first:border-t max-[640px]:gap-[0.9rem] max-[640px]:py-[1.1rem]"><span className="n w-8 shrink-0 font-display text-[1.1rem] text-accent">01</span><p className="text-[#3a413d] leading-[1.6]">We start by listening to your lifestyle, requirements, and aspirations.</p></li>
    <li className="flex list-none items-baseline gap-[1.2rem] border-b border-line py-[1.4rem] first:border-t max-[640px]:gap-[0.9rem] max-[640px]:py-[1.1rem]"><span className="n w-8 shrink-0 font-display text-[1.1rem] text-accent">02</span><p className="text-[#3a413d] leading-[1.6]">Every decision is driven by functionality, with aesthetics evolving naturally.</p></li>
    <li className="flex list-none items-baseline gap-[1.2rem] border-b border-line py-[1.4rem] first:border-t max-[640px]:gap-[0.9rem] max-[640px]:py-[1.1rem]"><span className="n w-8 shrink-0 font-display text-[1.1rem] text-accent">03</span><p className="text-[#3a413d] leading-[1.6]">We ensure every idea is executed with precision, quality, and attention to detail.</p></li>
    <li className="flex list-none items-baseline gap-[1.2rem] border-b border-line py-[1.4rem] first:border-t max-[640px]:gap-[0.9rem] max-[640px]:py-[1.1rem]"><span className="n w-8 shrink-0 font-display text-[1.1rem] text-accent">04</span><p className="text-[#3a413d] leading-[1.6]">Transparent communication throughout the project.</p></li>
    <li className="flex list-none items-baseline gap-[1.2rem] border-b border-line py-[1.4rem] first:border-t max-[640px]:gap-[0.9rem] max-[640px]:py-[1.1rem]"><span className="n w-8 shrink-0 font-display text-[1.1rem] text-accent">05</span><p className="text-[#3a413d] leading-[1.6]">Single-point responsibility from design to execution.</p></li>
  </ul>
</section>

<div className="founders reveal flex flex-wrap items-center gap-16 px-[3vw] py-[4.5rem] max-[900px]:flex-col max-[900px]:items-start max-[640px]:gap-7 max-[640px]:px-5 max-[640px]:py-[3.25rem]">
  <blockquote className="max-w-[520px] font-display text-2xl italic leading-[1.4] text-forest max-[640px]:text-[1.3rem]">“Founded in 2025, on a shared belief that creativity and precision aren't a trade-off.”</blockquote>
  <div className="founder-names ml-auto flex gap-10 max-[900px]:ml-0 max-[640px]:flex-wrap max-[640px]:gap-8">
    <div><span className="name block text-[0.95rem] font-semibold">Sarthak Mittal</span><span className="title mt-1 block text-[0.8125rem] text-[#6b726d]">Architect · Co-Founder</span></div>
    <div><span className="name block text-[0.95rem] font-semibold">Tarun Sai</span><span className="title mt-1 block text-[0.8125rem] text-[#6b726d]">Architect · Co-Founder</span></div>
  </div>
</div>
    </>
  );
}
