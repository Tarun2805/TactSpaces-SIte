import { useState } from 'react';
import { BeforeAfterSlider } from './components/before-after-slider';
import { HorizontalTimeline } from './components/horizontal-timeline';
import { MaterialCallout } from './components/material-callout';

export default function AnatomyPage() {
  const [category, setCategory] = useState('all');
  const filterClass = (value: string) => `filter-pill${category === value ? ' active' : ''}`;
  const cardStyle = (value: string) => ({ display: category === 'all' || category === value ? undefined : 'none' });

  return (
    <>
<header className="page-header reveal">
  <p className="eyebrow">Portfolio</p>
  <h1>Evidence of Execution.</h1>
  <p>A curated selection of completed mandates: proof of spatial maximization, material transparency, and operational control.</p>
</header>

<div className="portfolio-index">
<div className="filter-bar">
  <button className={filterClass('all')} data-f="all" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>All</button>
  <button className={filterClass('commercial')} data-f="commercial" aria-pressed={category === 'commercial'} onClick={() => setCategory('commercial')}>Commercial &amp; Workspaces</button>
  <button className={filterClass('residential')} data-f="residential" aria-pressed={category === 'residential'} onClick={() => setCategory('residential')}>Premium Residential</button>
  <button className={filterClass('hospitality')} data-f="hospitality" aria-pressed={category === 'hospitality'} onClick={() => setCategory('hospitality')}>Boutique Hospitality</button>
</div>

<section style={{"padding": "4rem 0 2rem"}}>
  <div className="case-grid reveal" id="caseGrid">
    <a className="case-card" href="#dd-hoofers" data-cat="commercial" style={cardStyle('commercial')}>
      <div className="thumb"><div className="blk" style={{"left": "0", "top": "0", "width": "60%", "height": "65%"}}></div><div className="blk" style={{"left": "64%", "top": "10%", "width": "32%", "height": "40%", "background": "var(--accent)"}}></div></div>
      <div className="meta-row"><span>Horamavu, Bengaluru</span><span>45 days</span></div>
      <h3>D Hoofers Dance Studio</h3>
      <span className="stat">4,000 sq. ft. · Design &amp; Execution</span>
    </a>
    <a className="case-card" href="#dd-pinaki" data-cat="residential" style={cardStyle('residential')}>
      <div className="thumb"><div className="blk" style={{"left": "10%", "top": "15%", "width": "35%", "height": "70%"}}></div><div className="blk" style={{"left": "52%", "top": "30%", "width": "38%", "height": "26%", "background": "var(--accent)"}}></div></div>
      <div className="meta-row"><span>Shettyhalli, Bengaluru</span><span>3 months</span></div>
      <h3>Pinaki Residence</h3>
      <span className="stat">1,430 sq. ft. · Turnkey Execution</span>
    </a>
    <a className="case-card" href="#dd-hakuna" data-cat="hospitality" style={cardStyle('hospitality')}>
      <div className="thumb"><div className="blk" style={{"left": "0", "top": "20%", "width": "55%", "height": "55%"}}></div><div className="blk" style={{"left": "60%", "top": "0", "width": "35%", "height": "45%", "background": "var(--accent)"}}></div></div>
      <div className="meta-row"><span>Arambol, Goa</span><span>15 days</span></div>
      <h3>Hakuna Matata Hotel</h3>
      <span className="stat">1,200 sq. ft. · Budget Renovation</span>
    </a>
    <a className="case-card" href="#" data-cat="residential" style={cardStyle('residential')}>
      <div className="thumb"><div className="blk" style={{"left": "15%", "top": "8%", "width": "34%", "height": "80%"}}></div><div className="blk" style={{"left": "56%", "top": "22%", "width": "34%", "height": "56%", "background": "var(--accent)"}}></div></div>
      <div className="meta-row"><span>Hennur, Bengaluru</span><span>20 days</span></div>
      <h3>Vimal Residence</h3>
      <span className="stat">1,200 sq. ft. · Interior Design</span>
    </a>
    <a className="case-card" href="#" data-cat="residential" style={cardStyle('residential')}>
      <div className="thumb"><div className="blk" style={{"left": "0", "top": "10%", "width": "50%", "height": "80%"}}></div><div className="blk" style={{"left": "56%", "top": "0", "width": "40%", "height": "38%", "background": "var(--accent)"}}></div></div>
      <div className="meta-row"><span>Kanakapura, Bengaluru</span><span>1 month</span></div>
      <h3>Manjunath Residence</h3>
      <span className="stat">2,400 sq. ft. · Interior Design</span>
    </a>
    <a className="case-card" href="#" data-cat="residential" style={cardStyle('residential')}>
      <div className="thumb"><div className="blk" style={{"left": "8%", "top": "20%", "width": "38%", "height": "60%"}}></div><div className="blk" style={{"left": "52%", "top": "5%", "width": "40%", "height": "50%", "background": "var(--accent)"}}></div></div>
      <div className="meta-row"><span>Ullal, Bengaluru</span><span>1 month</span></div>
      <h3>Arun Residence</h3>
      <span className="stat">1,200 sq. ft. · Interior Design</span>
    </a>
    <a className="case-card" href="#" data-cat="residential" style={cardStyle('residential')}>
      <div className="thumb"><div className="blk" style={{"left": "0", "top": "0", "width": "55%", "height": "70%"}}></div><div className="blk" style={{"left": "60%", "top": "30%", "width": "36%", "height": "50%", "background": "var(--accent)"}}></div></div>
      <div className="meta-row"><span>Hebbal, Bengaluru</span><span><span className="status-badge">Ongoing</span></span></div>
      <h3>Manikantan Residence</h3>
      <span className="stat">2,400 sq. ft. · Interiors, Design &amp; Execution</span>
    </a>
    <a className="case-card" href="#" data-cat="commercial" style={cardStyle('commercial')}>
      <div className="thumb"><div className="blk" style={{"left": "20%", "top": "15%", "width": "60%", "height": "65%"}}></div></div>
      <div className="meta-row"><span>Kereguddadahalli, Bengaluru</span><span>1 month</span></div>
      <h3>TactSpaces Studio (HQ)</h3>
      <span className="stat">200 sq. ft. · Complete Office Setup</span>
    </a>
  </div>
</section>
</div>


<section className="deep-dive" id="dd-hoofers">
  <div className="deep-dive-head reveal">
    <p className="eyebrow">Commercial &amp; Workspaces</p>
    <h2>D Hoofers Dance Studio</h2>
  </div>
  <div className="deep-dive-stats reveal">
    <div><span className="num">4,000</span><span className="lbl">Sq. Ft.</span></div>
    <div><span className="num">45</span><span className="lbl">Days, Start to Handover</span></div>
    <div><span className="num">0</span><span className="lbl">Schedule Overruns</span></div>
  </div>
  <p className="mandate-copy reveal">Executed with absolute operational precision on a highly aggressive timeline, proving our capacity to manage multiple vendor overlaps and deliver a high-impact commercial environment without schedule overruns.</p>

  <div className="dd-hero reveal">
    <div className="blk" style={{"left": "0", "top": "0", "width": "58%", "height": "100%"}}></div>
    <div className="blk" style={{"left": "60%", "top": "8%", "width": "38%", "height": "40%", "background": "var(--accent)"}}></div>
    <div className="blk" style={{"left": "60%", "top": "52%", "width": "38%", "height": "40%", "opacity": "0.55"}}></div>
    <MaterialCallout top="18%" left="20%">Charcoal fluted panel · reception facade</MaterialCallout>
    <MaterialCallout top="60%" left="78%">Suspended linear LED · studio ceiling</MaterialCallout>
    <MaterialCallout top="35%" left="65%">Sprung hardwood flooring · main studio</MaterialCallout>
  </div>

  <HorizontalTimeline trackId="track1" fillId="fill1">
        <div className="h-panel"><div className="frame"><div className="blk" style={{"left": "0", "top": "0", "width": "100%", "height": "100%", "opacity": "0.35"}}></div></div><span className="day">Day 1</span><h3>Raw Shell</h3><p>A bare 4,000 sq. ft. commercial floorplate, structurally surveyed for MEP before a single wall goes up.</p></div>
        <div className="h-panel"><div className="frame"><div className="blk" style={{"left": "0", "top": "30%", "width": "100%", "height": "70%", "opacity": "0.6"}}></div></div><span className="day">Day 15</span><h3>Structure &amp; MEP</h3><p>Electrical, HVAC, and acoustic backing routed alongside framing, the phase most turnkey firms let slip.</p></div>
        <div className="h-panel"><div className="frame"><div className="blk" style={{"left": "0", "top": "0", "width": "60%", "height": "100%"}}></div><div className="blk" style={{"left": "64%", "top": "20%", "width": "32%", "height": "60%", "background": "var(--accent)"}}></div></div><span className="day">Day 30</span><h3>Finishes</h3><p>Fluted panelling, sprung flooring, and the linear LED grid land, and the studio starts reading as designed space.</p></div>
        <div className="h-panel"><div className="frame"><div className="blk" style={{"left": "0", "top": "0", "width": "100%", "height": "100%"}}></div></div><span className="day">Day 45</span><h3>Handover</h3><p>Final quality pass against the approved drawing set. Keys handed over on the date signed in the Master Contract.</p></div>
  </HorizontalTimeline>
</section>


<section className="deep-dive" id="dd-pinaki">
  <div className="deep-dive-head reveal">
    <p className="eyebrow">Premium Residential</p>
    <h2>Pinaki Residence</h2>
  </div>
  <div className="deep-dive-stats reveal">
    <div><span className="num">1,430</span><span className="lbl">Sq. Ft. · 3 BHK Renovation</span></div>
    <div><span className="num">3</span><span className="lbl">Months, Design to Handover</span></div>
  </div>
  <p className="mandate-copy reveal">A comprehensive turnkey transformation demanding meticulous spatial planning. Through single-point responsibility, we navigated complex site modifications to deliver a seamless, stress-free interior defined by an exacting attention to detail.</p>

  <HorizontalTimeline trackId="track2" fillId="fill2">
        <div className="h-panel"><div className="frame"><div className="blk" style={{"left": "0", "top": "0", "width": "100%", "height": "100%", "opacity": "0.3"}}></div></div><span className="day">Stage 1</span><h3>Raw Site</h3><p>Existing 1,430 sq. ft. flat, stripped back to shell ahead of the renovation scope.</p></div>
        <div className="h-panel"><div className="frame-placeholder"><span className="ph-icon">▦</span><span className="ph-label">Site photo pending</span></div><span className="day">Stage 2</span><h3>MEP Routing</h3><p>Plumbing and electrical re-routed to support the new kitchen and bathroom layouts.</p></div>
        <div className="h-panel"><div className="frame"><div className="blk" style={{"left": "0", "top": "0", "width": "60%", "height": "100%"}}></div><div className="blk" style={{"left": "64%", "top": "15%", "width": "32%", "height": "70%", "background": "var(--accent)"}}></div></div><span className="day">Stage 3</span><h3>Finish Carpentry</h3><p>Custom wardrobes and kitchen cabinetry installed to the approved material specification.</p></div>
        <div className="h-panel"><div className="frame"><div className="blk" style={{"left": "0", "top": "0", "width": "100%", "height": "100%"}}></div></div><span className="day">Stage 4</span><h3>Final Handover</h3><p>Sign-off against the original drawing set, three months from Discovery to keys-in-hand.</p></div>
  </HorizontalTimeline>

  <blockquote className="pull reveal">"TactSpaces understood exactly what we wanted and transformed our home beautifully. Their attention to detail, transparency, and commitment throughout the execution made the entire experience smooth and stress-free."<cite>Mr. Pinaki</cite></blockquote>

  <BeforeAfterSlider id="baPinaki" project="Pinaki Residence" />
</section>


<section className="deep-dive" id="dd-hakuna">
  <div className="deep-dive-head reveal">
    <p className="eyebrow">Boutique Hospitality</p>
    <h2>Hakuna Matata Hotel</h2>
  </div>
  <div className="deep-dive-stats reveal">
    <div><span className="num">1,200</span><span className="lbl">Sq. Ft. · 3 Rooms</span></div>
    <div><span className="num">15</span><span className="lbl">Days, Budget Renovation</span></div>
  </div>
  <p className="mandate-copy reveal">A highly strategic, rapid-deployment renovation designed to maximize return on investment. By utilizing smart design interventions within a tight timeline, we completely refreshed the hospitality experience to immediately elevate the property's market value.</p>

  <BeforeAfterSlider id="baHakuna" project="Hakuna Matata Hotel" />

  <blockquote className="pull reveal">"With a limited budget and tight timeline, TactSpaces completely refreshed our rooms with great creativity and effort. The transformation exceeded our expectations."<cite>Arpit, Hakuna Matata Hotel</cite></blockquote>
</section>
    </>
  );
}
