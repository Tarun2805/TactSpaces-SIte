'use client';

import { useRef } from 'react';
import { useScrollUpdate } from '../../hooks/use-scroll-update';
import { DocumentCard } from './components/document-card';

export default function StandardPage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  useScrollUpdate(() => {
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!track || !fill) return;
    const rect = track.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.75 - rect.top) / Math.max(1, rect.height)));
    fill.style.height = `${progress * 100}%`;
    track.querySelectorAll('.process-step').forEach((step) => {
      step.classList.toggle('active', step.getBoundingClientRect().top < window.innerHeight * 0.75);
    });
  });

  return (
    <>
      <header className="reveal max-w-[900px] px-[5vw] pt-36 pb-16 max-[640px]:px-5 max-[640px]:pt-[calc(64px+2.25rem)] max-[640px]:pb-8">
        <h1 className="my-[1.2rem] mb-[1.4rem] text-[clamp(2.6rem,5vw,4.6rem)] max-[640px]:my-4 max-[640px]:text-[clamp(2.1rem,9.5vw,2.6rem)]">The Standard We Hold Ourselves To.</h1>
        <p className="max-w-[620px] text-[1.05rem] leading-[1.65] text-[#454E4A] max-[640px]:text-base max-[640px]:leading-[1.6]">Seven stages. Zero ambiguity. This is the operational discipline that separates a portfolio from a paper trail.</p>
      </header>

      <section className="px-[5vw] pt-8 pb-24 max-[640px]:px-5 max-[640px]:pt-6 max-[640px]:pb-12">
        <div className="mx-auto grid max-w-[1360px] grid-cols-[1fr_300px] items-start gap-20 max-[1000px]:grid-cols-1">
          <div ref={trackRef} className="reveal relative pl-12" id="track">
            <div className="absolute top-[6px] bottom-[6px] left-[11px] w-0.5 bg-line"><div ref={fillRef} className="absolute inset-x-0 top-0 h-0 bg-forest transition-[height] duration-150" id="railFill" /></div>

            <div className="process-step group relative pb-[4.2rem] last:pb-0 max-[640px]:pb-10" data-step="1"><span className="num absolute -left-12 top-0 flex size-6 items-center justify-center rounded-full border-2 border-line bg-alabaster-deep text-[0.7rem] font-bold text-[#8B928D] transition-colors duration-300 group-[.active]:border-forest group-[.active]:bg-forest group-[.active]:text-alabaster">01</span><span className="stage-label mb-1 block text-[0.72rem] font-bold uppercase tracking-[0.15em] text-accent">Discover</span><h3 className="mb-2 text-[1.4rem] transition-colors duration-300 max-[640px]:text-xl">Understanding the brief</h3><p className="max-w-[520px] leading-[1.6] text-[#4B534F]">We begin by understanding your vision, requirements, lifestyle, budget, and project goals.</p></div>
            <div className="process-step group relative pb-[4.2rem] last:pb-0 max-[640px]:pb-10" data-step="2"><span className="num absolute -left-12 top-0 flex size-6 items-center justify-center rounded-full border-2 border-line bg-alabaster-deep text-[0.7rem] font-bold text-[#8B928D] transition-colors duration-300 group-[.active]:border-forest group-[.active]:bg-forest group-[.active]:text-alabaster">02</span><span className="stage-label mb-1 block text-[0.72rem] font-bold uppercase tracking-[0.15em] text-accent">Define</span><h3 className="mb-2 text-[1.4rem] transition-colors duration-300 max-[640px]:text-xl">Scope &amp; feasibility</h3><p className="max-w-[520px] leading-[1.6] text-[#4B534F]">Site analysis, feasibility, measurements, and establishing the project scope.</p></div>
            <div className="process-step group relative pb-[4.2rem] last:pb-0 max-[640px]:pb-10" data-step="3"><span className="num absolute -left-12 top-0 flex size-6 items-center justify-center rounded-full border-2 border-line bg-alabaster-deep text-[0.7rem] font-bold text-[#8B928D] transition-colors duration-300 group-[.active]:border-forest group-[.active]:bg-forest group-[.active]:text-alabaster">03</span><span className="stage-label mb-1 block text-[0.72rem] font-bold uppercase tracking-[0.15em] text-accent">Design</span><h3 className="mb-2 text-[1.4rem] transition-colors duration-300 max-[640px]:text-xl">Concept to visualization</h3><p className="max-w-[520px] leading-[1.6] text-[#4B534F]">Concept development, space planning, material selection, and 3D visualization.</p></div>
            <div className="process-step group relative pb-[4.2rem] last:pb-0 max-[640px]:pb-10" data-step="4"><span className="num absolute -left-12 top-0 flex size-6 items-center justify-center rounded-full border-2 border-line bg-alabaster-deep text-[0.7rem] font-bold text-[#8B928D] transition-colors duration-300 group-[.active]:border-forest group-[.active]:bg-forest group-[.active]:text-alabaster">04</span><span className="stage-label mb-1 block text-[0.72rem] font-bold uppercase tracking-[0.15em] text-accent">Develop</span><h3 className="mb-2 text-[1.4rem] transition-colors duration-300 max-[640px]:text-xl">Technical documentation</h3><p className="max-w-[520px] leading-[1.6] text-[#4B534F]">Detailed drawings, technical coordination, and construction documentation.</p></div>
            <div className="process-step group relative pb-[4.2rem] last:pb-0 max-[640px]:pb-10" data-step="5"><span className="num absolute -left-12 top-0 flex size-6 items-center justify-center rounded-full border-2 border-line bg-alabaster-deep text-[0.7rem] font-bold text-[#8B928D] transition-colors duration-300 group-[.active]:border-forest group-[.active]:bg-forest group-[.active]:text-alabaster">05</span><span className="stage-label mb-1 block text-[0.72rem] font-bold uppercase tracking-[0.15em] text-accent">Execute</span><h3 className="mb-2 text-[1.4rem] transition-colors duration-300 max-[640px]:text-xl">Site coordination</h3><p className="max-w-[520px] leading-[1.6] text-[#4B534F]">Coordinating with contractors, vendors, and craftsmen to bring the design to life with precision.</p></div>
            <div className="process-step group relative pb-[4.2rem] last:pb-0 max-[640px]:pb-10" data-step="6"><span className="num absolute -left-12 top-0 flex size-6 items-center justify-center rounded-full border-2 border-line bg-alabaster-deep text-[0.7rem] font-bold text-[#8B928D] transition-colors duration-300 group-[.active]:border-forest group-[.active]:bg-forest group-[.active]:text-alabaster">06</span><span className="stage-label mb-1 block text-[0.72rem] font-bold uppercase tracking-[0.15em] text-accent">Deliver</span><h3 className="mb-2 text-[1.4rem] transition-colors duration-300 max-[640px]:text-xl">Quality &amp; handover</h3><p className="max-w-[520px] leading-[1.6] text-[#4B534F]">Final quality checks, project handover, and ensuring every detail reflects the original design intent.</p></div>
            <div className="process-step group relative pb-[4.2rem] last:pb-0 max-[640px]:pb-10" data-step="7"><span className="num absolute -left-12 top-0 flex size-6 items-center justify-center rounded-full border-2 border-line bg-alabaster-deep text-[0.7rem] font-bold text-[#8B928D] transition-colors duration-300 group-[.active]:border-forest group-[.active]:bg-forest group-[.active]:text-alabaster">07</span><span className="stage-label mb-1 block text-[0.72rem] font-bold uppercase tracking-[0.15em] text-accent">Support</span><h3 className="mb-2 text-[1.4rem] transition-colors duration-300 max-[640px]:text-xl">Beyond completion</h3><p className="max-w-[520px] leading-[1.6] text-[#4B534F]">Post-completion assistance, maintenance guidance, and continued client support.</p></div>
          </div>

          <aside className="reveal border-l border-line pl-8 max-[1000px]:mt-14 max-[1000px]:border-t max-[1000px]:border-l-0 max-[1000px]:pt-10 max-[1000px]:pl-0 max-[640px]:mt-8 max-[640px]:pt-8">
            <div className="sticky top-[110px] max-[1000px]:static">
              <p className="my-[0.9rem] mb-[2.4rem] max-w-[280px] text-[0.92rem] leading-[1.65] text-[#4B534F]">Every stage below feeds a document. Nothing moves to site until it's on paper.</p>
              <div className="flex flex-wrap gap-10 max-[640px]:grid max-[640px]:grid-cols-3 max-[640px]:gap-4">
                <div className="mb-[1.7rem] last:mb-0 max-[640px]:mb-0"><span className="num block font-display text-[2.1rem] leading-none text-forest max-[640px]:text-[1.8rem]">7</span><span className="lbl mt-1 block text-[0.72rem] uppercase tracking-[0.07em] text-[#8B928D] max-[640px]:text-[0.62rem] max-[640px]:leading-[1.4]">Stages, Start to Support</span></div>
                <div className="mb-[1.7rem] last:mb-0 max-[640px]:mb-0"><span className="num block font-display text-[2.1rem] leading-none text-forest max-[640px]:text-[1.8rem]">3</span><span className="lbl mt-1 block text-[0.72rem] uppercase tracking-[0.07em] text-[#8B928D] max-[640px]:text-[0.62rem] max-[640px]:leading-[1.4]">Documents Govern Every Project</span></div>
                <div className="mb-[1.7rem] last:mb-0 max-[640px]:mb-0"><span className="num block font-display text-[2.1rem] leading-none text-forest max-[640px]:text-[1.8rem]">0</span><span className="lbl mt-1 block text-[0.72rem] uppercase tracking-[0.07em] text-[#8B928D] max-[640px]:text-[0.62rem] max-[640px]:leading-[1.4]">Verbal Change Orders</span></div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-line bg-alabaster-deep px-[5vw] pt-12 pb-24 max-[640px]:px-5 max-[640px]:pt-12 max-[640px]:pb-14">
        <div className="reveal mb-12 max-w-[680px] max-[640px]:mb-8">
          <h2 className="mt-4 text-[clamp(1.9rem,3vw,2.6rem)] max-[640px]:text-[clamp(1.7rem,7.5vw,2.1rem)]">Our paper trail, not just our portfolio.</h2>
          <p className="mt-4 leading-[1.65] text-[#4B534F]">Blurred previews of the documents that govern every project, because a firm with nothing to hide shows the paperwork too.</p>
        </div>
        <div className="reveal grid grid-cols-3 gap-[1.6rem] max-[900px]:grid-cols-1 max-[640px]:gap-4">
          <DocumentCard>
            <div className="doc-preview relative aspect-[3/4] overflow-hidden blur-[5px] transition-[filter] duration-500 group-hover:blur-[2.5px] max-[640px]:aspect-[16/10]"><div className="absolute top-[14%] left-[12%] h-[6px] w-[40%] bg-[#B9C0BA]" /><div className="absolute top-[24%] right-[12%] left-[12%] h-[6px] bg-[#B9C0BA]" /><div className="absolute top-[32%] right-[12%] left-[12%] h-[6px] bg-[#B9C0BA]" /><div className="absolute top-[48%] left-[12%] h-[6px] w-[60%] bg-[#B9C0BA]" /><div className="absolute top-[56%] right-[12%] left-[12%] h-[6px] bg-[#B9C0BA]" /><div className="absolute top-[64%] right-[12%] left-[12%] h-[6px] bg-[#B9C0BA]" /><div className="absolute top-[80%] left-[12%] h-[6px] w-[35%] bg-[#B9C0BA]" /></div>
            <div className="doc-lockup pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-[rgba(31,45,40,0)] p-6 text-center opacity-0 transition-[opacity,background] duration-500 group-hover:bg-[rgba(31,45,40,0.72)] group-hover:opacity-100"><p className="max-w-[220px] text-[0.82rem] leading-[1.5] text-alabaster">Zero-tolerance clause on undisclosed vendor markups. Every cost is pre-agreed in writing.</p></div>
            <div className="doc-name border-t border-line px-[1.4rem] py-[1.2rem] text-[0.95rem] font-semibold max-[640px]:px-[1.1rem] max-[640px]:py-4">Master Contract</div>
          </DocumentCard>
          <DocumentCard>
            <div className="doc-preview relative aspect-[3/4] overflow-hidden blur-[5px] transition-[filter] duration-500 group-hover:blur-[2.5px] max-[640px]:aspect-[16/10]"><div className="absolute top-[16%] left-[12%] h-[6px] w-[50%] bg-[#B9C0BA]" /><div className="absolute top-[26%] right-[12%] left-[12%] h-[6px] bg-[#B9C0BA]" /><div className="absolute top-[34%] left-[12%] h-[6px] w-[70%] bg-[#B9C0BA]" /><div className="absolute top-[50%] left-[12%] h-[6px] w-[45%] bg-[#B9C0BA]" /><div className="absolute top-[58%] right-[12%] left-[12%] h-[6px] bg-[#B9C0BA]" /><div className="absolute top-[76%] left-[12%] h-[6px] w-[55%] bg-[#B9C0BA]" /></div>
            <div className="doc-lockup pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-[rgba(31,45,40,0)] p-6 text-center opacity-0 transition-[opacity,background] duration-500 group-hover:bg-[rgba(31,45,40,0.72)] group-hover:opacity-100"><p className="max-w-[220px] text-[0.82rem] leading-[1.5] text-alabaster">Every scope change is logged, costed, and signed before work resumes on site.</p></div>
            <div className="doc-name border-t border-line px-[1.4rem] py-[1.2rem] text-[0.95rem] font-semibold max-[640px]:px-[1.1rem] max-[640px]:py-4">Project Change Order (PCO)</div>
          </DocumentCard>
          <DocumentCard>
            <div className="doc-preview relative aspect-[3/4] overflow-hidden blur-[5px] transition-[filter] duration-500 group-hover:blur-[2.5px] max-[640px]:aspect-[16/10]"><div className="absolute top-[15%] left-[12%] h-[6px] w-[38%] bg-[#B9C0BA]" /><div className="absolute top-[25%] right-[12%] left-[12%] h-[6px] bg-[#B9C0BA]" /><div className="absolute top-[33%] right-[12%] left-[12%] h-[6px] bg-[#B9C0BA]" /><div className="absolute top-[49%] left-[12%] h-[6px] w-[65%] bg-[#B9C0BA]" /><div className="absolute top-[57%] right-[12%] left-[12%] h-[6px] bg-[#B9C0BA]" /><div className="absolute top-[78%] left-[12%] h-[6px] w-[30%] bg-[#B9C0BA]" /></div>
            <div className="doc-lockup pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-[rgba(31,45,40,0)] p-6 text-center opacity-0 transition-[opacity,background] duration-500 group-hover:bg-[rgba(31,45,40,0.72)] group-hover:opacity-100"><p className="max-w-[220px] text-[0.82rem] leading-[1.5] text-alabaster">Sign-off only occurs against the original approved drawing set. No surprises at handover.</p></div>
            <div className="doc-name border-t border-line px-[1.4rem] py-[1.2rem] text-[0.95rem] font-semibold max-[640px]:px-[1.1rem] max-[640px]:py-4">Handover Certificate</div>
          </DocumentCard>
        </div>
      </section>

      <section className="commit-section px-[5vw] py-24 max-[640px]:px-5 max-[640px]:py-[3.25rem]">
        <div className="reveal mb-12 max-w-[680px] max-[640px]:mb-8"><h2 className="mt-4 text-[clamp(1.9rem,3vw,2.6rem)]">Our core principles</h2></div>
        <div className="reveal grid auto-rows-fr grid-cols-3 gap-px border border-line bg-line max-[900px]:grid-cols-2 max-[640px]:grid-cols-1">
          <div className="commit-card bg-alabaster p-[1.8rem] max-[640px]:p-5"><h3 className="mb-[0.4rem] font-sans text-[0.95rem] leading-[1.3] font-bold">Client-Centric Approach</h3><p className="text-[0.84rem] leading-[1.55] text-[#5C645F]">Every project begins with understanding your vision, lifestyle, and functional needs.</p></div>
          <div className="commit-card bg-alabaster p-[1.8rem] max-[640px]:p-5"><h3 className="mb-[0.4rem] font-sans text-[0.95rem] leading-[1.3] font-bold">Quality Commitment</h3><p className="text-[0.84rem] leading-[1.55] text-[#5C645F]">Thoughtful designs, quality documentation, and meticulous execution in every project.</p></div>
          <div className="commit-card bg-alabaster p-[1.8rem] max-[640px]:p-5"><h3 className="mb-[0.4rem] font-sans text-[0.95rem] leading-[1.3] font-bold">Design Excellence</h3><p className="text-[0.84rem] leading-[1.55] text-[#5C645F]">Every design balances functionality, innovation, and aesthetics.</p></div>
          <div className="commit-card bg-alabaster p-[1.8rem] max-[640px]:p-5"><h3 className="mb-[0.4rem] font-sans text-[0.95rem] leading-[1.3] font-bold">Transparency</h3><p className="text-[0.84rem] leading-[1.55] text-[#5C645F]">Honest communication, clear timelines, and transparent cost discussions throughout.</p></div>
          <div className="commit-card bg-alabaster p-[1.8rem] max-[640px]:p-5"><h3 className="mb-[0.4rem] font-sans text-[0.95rem] leading-[1.3] font-bold">Collaboration</h3><p className="text-[0.84rem] leading-[1.55] text-[#5C645F]">Built through close work with clients, consultants, contractors, and vendors.</p></div>
          <div className="commit-card bg-alabaster p-[1.8rem] max-[640px]:p-5"><h3 className="mb-[0.4rem] font-sans text-[0.95rem] leading-[1.3] font-bold">Sustainability</h3><p className="text-[0.84rem] leading-[1.55] text-[#5C645F]">Environmentally responsible design and thoughtful material choices, wherever possible.</p></div>
        </div>
      </section>
    </>
  );
}
