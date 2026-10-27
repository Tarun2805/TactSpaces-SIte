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
<header className="page-header reveal">
  <h1>The Standard We Hold Ourselves To.</h1>
  <p>Seven stages. Zero ambiguity. This is the operational discipline that separates a portfolio from a paper trail.</p>
</header>

<section className="process-section">
  <div className="process-layout">
    <div ref={trackRef} className="process-track reveal" id="track">
      <div className="rail"><div ref={fillRef} className="rail-fill" id="railFill"></div></div>

      <div className="process-step" data-step="1"><span className="num">01</span><span className="stage-label">Discover</span><h3>Understanding the brief</h3><p>We begin by understanding your vision, requirements, lifestyle, budget, and project goals.</p></div>
      <div className="process-step" data-step="2"><span className="num">02</span><span className="stage-label">Define</span><h3>Scope &amp; feasibility</h3><p>Site analysis, feasibility, measurements, and establishing the project scope.</p></div>
      <div className="process-step" data-step="3"><span className="num">03</span><span className="stage-label">Design</span><h3>Concept to visualization</h3><p>Concept development, space planning, material selection, and 3D visualization.</p></div>
      <div className="process-step" data-step="4"><span className="num">04</span><span className="stage-label">Develop</span><h3>Technical documentation</h3><p>Detailed drawings, technical coordination, and construction documentation.</p></div>
      <div className="process-step" data-step="5"><span className="num">05</span><span className="stage-label">Execute</span><h3>Site coordination</h3><p>Coordinating with contractors, vendors, and craftsmen to bring the design to life with precision.</p></div>
      <div className="process-step" data-step="6"><span className="num">06</span><span className="stage-label">Deliver</span><h3>Quality &amp; handover</h3><p>Final quality checks, project handover, and ensuring every detail reflects the original design intent.</p></div>
      <div className="process-step" data-step="7"><span className="num">07</span><span className="stage-label">Support</span><h3>Beyond completion</h3><p>Post-completion assistance, maintenance guidance, and continued client support.</p></div>
    </div>

    <aside className="process-aside reveal">
      <div className="aside-sticky">
        <p className="aside-note">Every stage below feeds a document. Nothing moves to site until it's on paper.</p>
        <div className="aside-stats">
          <div><span className="num">7</span><span className="lbl">Stages, Start to Support</span></div>
          <div><span className="num">3</span><span className="lbl">Documents Govern Every Project</span></div>
          <div><span className="num">0</span><span className="lbl">Verbal Change Orders</span></div>
        </div>
      </div>
    </aside>
  </div>
</section>

<section className="doc-section">
  <div className="doc-head reveal">
    <h2>Our paper trail, not just our portfolio.</h2>
    <p style={{"marginTop": "1rem", "color": "#4B534F", "lineHeight": "1.65"}}>Blurred previews of the documents that govern every project, because a firm with nothing to hide shows the paperwork too.</p>
  </div>
  <div className="doc-grid reveal">
    <DocumentCard>
      <div className="doc-preview">
        <div className="line" style={{"top": "14%", "width": "40%"}}></div><div className="line" style={{"top": "24%"}}></div><div className="line" style={{"top": "32%"}}></div>
        <div className="line" style={{"top": "48%", "width": "60%"}}></div><div className="line" style={{"top": "56%"}}></div><div className="line" style={{"top": "64%"}}></div>
        <div className="line" style={{"top": "80%", "width": "35%"}}></div>
      </div>
      <div className="doc-lockup"><p>Zero-tolerance clause on undisclosed vendor markups. Every cost is pre-agreed in writing.</p></div>
      <div className="doc-name">Master Contract</div>
    </DocumentCard>
    <DocumentCard>
      <div className="doc-preview">
        <div className="line" style={{"top": "16%", "width": "50%"}}></div><div className="line" style={{"top": "26%"}}></div><div className="line" style={{"top": "34%", "width": "70%"}}></div>
        <div className="line" style={{"top": "50%", "width": "45%"}}></div><div className="line" style={{"top": "58%"}}></div>
        <div className="line" style={{"top": "76%", "width": "55%"}}></div>
      </div>
      <div className="doc-lockup"><p>Every scope change is logged, costed, and signed before work resumes on site.</p></div>
      <div className="doc-name">Project Change Order (PCO)</div>
    </DocumentCard>
    <DocumentCard>
      <div className="doc-preview">
        <div className="line" style={{"top": "15%", "width": "38%"}}></div><div className="line" style={{"top": "25%"}}></div><div className="line" style={{"top": "33%"}}></div>
        <div className="line" style={{"top": "49%", "width": "65%"}}></div><div className="line" style={{"top": "57%"}}></div>
        <div className="line" style={{"top": "78%", "width": "30%"}}></div>
      </div>
      <div className="doc-lockup"><p>Sign-off only occurs against the original approved drawing set. No surprises at handover.</p></div>
      <div className="doc-name">Handover Certificate</div>
    </DocumentCard>
  </div>
</section>

<section className="commit-section">
  <div className="commit-head reveal">
    <h2>Our core principles</h2>
  </div>
  <div className="commit-grid reveal">
    <div className="commit-card"><h3>Client-Centric Approach</h3><p>Every project begins with understanding your vision, lifestyle, and functional needs.</p></div>
    <div className="commit-card"><h3>Quality Commitment</h3><p>Thoughtful designs, quality documentation, and meticulous execution in every project.</p></div>
    <div className="commit-card"><h3>Design Excellence</h3><p>Every design balances functionality, innovation, and aesthetics.</p></div>
    <div className="commit-card"><h3>Transparency</h3><p>Honest communication, clear timelines, and transparent cost discussions throughout.</p></div>
    <div className="commit-card"><h3>Collaboration</h3><p>Built through close work with clients, consultants, contractors, and vendors.</p></div>
    <div className="commit-card"><h3>Sustainability</h3><p>Environmentally responsible design and thoughtful material choices, wherever possible.</p></div>
  </div>
</section>
    </>
  );
}
