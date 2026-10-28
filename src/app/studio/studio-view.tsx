export default function StudioPage() {
  return (
    <>
<header className="page-header has-aside reveal max-[640px]:!px-5 max-[640px]:!pt-[calc(var(--nav-h)+2.25rem)] max-[640px]:!pb-8 max-[640px]:[&>div>h1]:!my-4 max-[640px]:[&>div>h1]:!text-[clamp(2.1rem,9.5vw,2.6rem)] max-[640px]:[&>div>p]:!text-base max-[640px]:[&>div>p]:!leading-[1.6] min-[901px]:max-w-none min-[901px]:grid min-[901px]:grid-cols-[minmax(0,1.3fr)_minmax(280px,.7fr)] min-[901px]:items-end min-[901px]:gap-24">
  <div className="ph-copy min-[901px]:max-w-[820px]">
   <h1 className="my-[1.2rem] text-[clamp(2.6rem,5vw,4.2rem)] max-[640px]:my-4 max-[640px]:text-[clamp(2.1rem,9.5vw,2.6rem)]">Two Architects. One Standard.</h1>
   <p className="text-[1.05rem] leading-[1.7] text-[#454e4a] max-[640px]:text-base max-[640px]:leading-[1.6]">Founded in 2025, TactSpaces is the result of two architects coming together with a shared vision to create spaces that are thoughtful, functional, and timeless. What began as a shared passion has grown into a partnership dedicated to transforming ideas into spaces that truly reflect the people who inhabit them.</p>
</div>
  <aside className="studio-facts max-[900px]:mt-8" aria-label="Studio at a glance">
    <dl className="grid gap-0 max-[640px]:grid-cols-2 max-[640px]:gap-x-5">
      <div className="border-b border-[var(--line)] py-4 first:border-t max-[640px]:[&:nth-child(2)]:border-t"><dt className="mb-[.3rem] text-[.68rem] tracking-[.14em] text-[#7B837E] uppercase">Founded</dt><dd className="[font-family:'Playfair_Display',Georgia,serif] text-[1.2rem] leading-[1.3] text-[var(--forest)] max-[640px]:text-[1.05rem]">2025</dd></div>
      <div className="border-b border-[var(--line)] py-4 first:border-t max-[640px]:[&:nth-child(2)]:border-t"><dt className="mb-[.3rem] text-[.68rem] tracking-[.14em] text-[#7B837E] uppercase">Studio</dt><dd className="[font-family:'Playfair_Display',Georgia,serif] text-[1.2rem] leading-[1.3] text-[var(--forest)] max-[640px]:text-[1.05rem]">Kereguddadahalli, Bengaluru</dd></div>
      <div className="border-b border-[var(--line)] py-4 first:border-t max-[640px]:[&:nth-child(2)]:border-t"><dt className="mb-[.3rem] text-[.68rem] tracking-[.14em] text-[#7B837E] uppercase">Mandates</dt><dd className="[font-family:'Playfair_Display',Georgia,serif] text-[1.2rem] leading-[1.3] text-[var(--forest)] max-[640px]:text-[1.05rem]">8 across Bengaluru and Goa</dd></div>
      <div className="border-b border-[var(--line)] py-4 first:border-t max-[640px]:[&:nth-child(2)]:border-t"><dt className="mb-[.3rem] text-[.68rem] tracking-[.14em] text-[#7B837E] uppercase">Services</dt><dd className="[font-family:'Playfair_Display',Georgia,serif] text-[1.2rem] leading-[1.3] text-[var(--forest)] max-[640px]:text-[1.05rem]">Architecture, interiors, turnkey execution</dd></div>
    </dl>
  </aside>
</header>

<section className="studio-gallery-section px-[5vw] py-20 max-[640px]:px-5 max-[640px]:py-14" aria-labelledby="studio-gallery-title">
   <div className="section-head reveal mb-8 max-w-[640px] [&>h2]:mt-0 [&>h2]:text-[clamp(1.9rem,3vw,2.6rem)] max-[640px]:mb-8 max-[640px]:[&>h2]:text-[clamp(1.7rem,7.5vw,2.1rem)]">
    <h2 id="studio-gallery-title">Our Studio Space</h2>
  </div>
   <div className="studio-gallery reveal grid grid-cols-[repeat(3,minmax(0,1fr))] auto-rows-[clamp(160px,17vw,230px)] gap-5 max-[800px]:grid-cols-[repeat(2,minmax(0,1fr))] max-[800px]:auto-rows-[clamp(140px,28vw,220px)] max-[800px]:gap-4 max-[640px]:auto-rows-[clamp(130px,38vw,170px)] max-[640px]:gap-3">
     <div className="studio-gallery__placeholder row-span-1 min-w-0 bg-[#E7E4DA] first:row-span-2 max-[640px]:aspect-[5/3]" role="img" aria-label="Office photo placeholder 1" />
     <div className="studio-gallery__placeholder row-span-1 min-w-0 bg-[#D7D2C4] max-[640px]:aspect-[5/3]" role="img" aria-label="Office photo placeholder 2" />
     <div className="studio-gallery__placeholder row-span-1 min-w-0 bg-[#DCD9D0] max-[640px]:aspect-[5/3]" role="img" aria-label="Office photo placeholder 3" />
     <div className="studio-gallery__placeholder row-span-1 min-w-0 bg-[#E7E4DA] max-[640px]:aspect-[5/3]" role="img" aria-label="Office photo placeholder 4" />
     <div className="studio-gallery__placeholder row-span-1 min-w-0 bg-[#E7E4DA] max-[640px]:aspect-[5/3]" role="img" aria-label="Office photo placeholder 5" />
  </div>
</section>

<section id="team" className="team-split scroll-mt-[var(--nav-h)] px-[5vw] py-20 max-[640px]:px-5 max-[640px]:py-14 min-[901px]:grid min-[901px]:grid-cols-[minmax(0,1.3fr)_minmax(280px,.7fr)] min-[901px]:items-end min-[901px]:gap-24">
  <div className="team-main">
    <div className="section-head reveal mb-12 max-w-[640px] [&>h2]:mt-4 [&>h2]:text-[clamp(1.9rem,3vw,2.6rem)] max-[640px]:mb-8 max-[640px]:[&>h2]:text-[clamp(1.7rem,7.5vw,2.1rem)]"><h2>Driving the vision…</h2></div>
    <div className="team-grid reveal grid max-w-[760px] grid-cols-2 gap-12 max-[640px]:max-w-none max-[640px]:gap-4 max-[600px]:grid-cols-1">
      <div className="team-card min-w-0">
       <div className="photo relative mb-[1.2rem] aspect-square overflow-hidden bg-[linear-gradient(160deg,#E7E4DA,#D7D2C4)] max-[640px]:mb-[.9rem] max-[640px]:aspect-[4/5]"><div className="blk absolute left-[15%] top-[10%] h-[80%] w-[70%] bg-[var(--forest)] opacity-75" /></div>
       <h3 className="mb-[.2rem] text-[1.3rem] max-[640px]:text-[1.05rem]">Sarthak Mittal</h3>
       <span className="role text-[.85rem] font-semibold text-[var(--accent)] max-[640px]:block max-[640px]:text-[.74rem] max-[640px]:leading-[1.4]">Architect · Co-Founder</span>
    </div>
      <div className="team-card min-w-0">
       <div className="photo relative mb-[1.2rem] aspect-square overflow-hidden bg-[linear-gradient(160deg,#E7E4DA,#D7D2C4)] max-[640px]:mb-[.9rem] max-[640px]:aspect-[4/5]"><div className="blk absolute left-[15%] top-[10%] h-[80%] w-[70%] bg-[var(--forest)] opacity-75" /></div>
       <h3 className="mb-[.2rem] text-[1.3rem] max-[640px]:text-[1.05rem]">Tarun Sai</h3>
       <span className="role text-[.85rem] font-semibold text-[var(--accent)] max-[640px]:block max-[640px]:text-[.74rem] max-[640px]:leading-[1.4]">Architect · Co-Founder</span>
    </div>
  </div>
  </div>
  <blockquote className="team-quote reveal mt-10 border-l-2 border-[var(--accent)] pl-6 [font-family:'Playfair_Display',Georgia,serif] text-[clamp(1.6rem,2.4vw,2.3rem)] leading-[1.25] text-[var(--forest)] min-[901px]:mb-[4.5rem] min-[901px]:mt-0 max-[900px]:mt-10 max-[640px]:pl-[1.1rem] max-[640px]:text-[1.4rem]">Creativity and precision aren't a trade-off.<span className="mt-4 block [font-family:Inter,sans-serif] text-[.85rem] leading-[1.5] text-[#6B726D]">Founded in 2025 on that shared belief.</span></blockquote>
</section>

<section className="border-y border-[var(--line)] bg-alabaster-deep px-[5vw] py-20 max-[640px]:px-5 max-[640px]:py-14">
  <div className="mission-vision reveal grid grid-cols-2 gap-px border border-[var(--line)] bg-[var(--line)] max-[800px]:grid-cols-1">
    <div className="mv-card bg-[var(--alabaster)] p-[2.8rem] max-[640px]:px-5 max-[640px]:py-7">
      <h3 className="mb-4 text-[1.3rem]">Vision</h3>
      <p className="leading-[1.65] text-[#4B534F]">To create spaces that are a true reflection of the people, businesses, and communities they serve. Every project begins with our client's aspirations, functional needs, and context, resulting in spaces where functionality and aesthetics stay in balance.</p>
    </div>
    <div className="mv-card bg-[var(--alabaster)] p-[2.8rem] max-[640px]:px-5 max-[640px]:py-7">
      <h3 className="mb-4 text-[1.3rem]">Mission</h3>
      <p className="leading-[1.65] text-[#4B534F]">To deliver architecture and interior solutions with precision, integrity, and attention to detail, from concept to completion, through collaborative design, technical expertise, and consistent quality.</p>
    </div>
  </div>
</section>

<section className="home-commitment px-[3vw] py-28 max-[640px]:px-5 max-[640px]:py-16" aria-labelledby="commitment-title">
  <div className="section-head reveal mb-14 max-w-[640px] max-[640px]:mb-8">
    <h2 className="mt-4 text-[clamp(1.9rem,3vw,2.8rem)] max-[640px]:text-[clamp(1.7rem,7.5vw,2.1rem)]" id="commitment-title">Our commitment</h2>
  </div>
  <div className="trust-grid reveal grid grid-cols-3 gap-px border border-[var(--line)] bg-[var(--line)] max-[900px]:grid-cols-1">
    <div className="trust-card relative overflow-hidden bg-[var(--alabaster)] p-12 transition-[background,color] duration-500 hover:bg-forest hover:text-alabaster max-[640px]:px-6 max-[640px]:py-8">
      <span className="idx mb-6 block text-xs tracking-[.15em] opacity-[.55] max-[640px]:mb-4">01</span>
      <h3 className="mb-[.9rem] text-[1.3rem] font-semibold max-[640px]:text-[1.2rem]">Absolute Financial Transparency</h3>
      <p className="text-[.92rem] leading-[1.6] text-inherit opacity-[.85]">Costs are itemized against a Master Contract before a single vendor is booked. No hidden markups, no verbal change orders.</p>
    </div>
    <div className="trust-card relative overflow-hidden bg-[var(--alabaster)] p-12 transition-[background,color] duration-500 hover:bg-forest hover:text-alabaster max-[640px]:px-6 max-[640px]:py-8">
      <span className="idx mb-6 block text-xs tracking-[.15em] opacity-[.55] max-[640px]:mb-4">02</span>
      <h3 className="mb-[.9rem] text-[1.3rem] font-semibold max-[640px]:text-[1.2rem]">Single-Point Responsibility</h3>
      <p className="text-[.92rem] leading-[1.6] text-inherit opacity-[.85]">One team owns design and execution end to end. One call, not five contractors, whenever a decision is needed.</p>
    </div>
    <div className="trust-card relative overflow-hidden bg-[var(--alabaster)] p-12 transition-[background,color] duration-500 hover:bg-forest hover:text-alabaster max-[640px]:px-6 max-[640px]:py-8">
      <span className="idx mb-6 block text-xs tracking-[.15em] opacity-[.55] max-[640px]:mb-4">03</span>
      <h3 className="mb-[.9rem] text-[1.3rem] font-semibold max-[640px]:text-[1.2rem]">Contractual Timely Delivery</h3>
      <p className="text-[.92rem] leading-[1.6] text-inherit opacity-[.85]">Timelines are binding, not aspirational. D Hoofers Dance Studio: 4,000&nbsp;sq.&nbsp;ft. in 45&nbsp;days, exactly as signed for.</p>
    </div>
  </div>
</section>

<section id="profile" className="scroll-mt-[var(--nav-h)] px-[5vw] py-20 max-[640px]:px-5 max-[640px]:py-14">
  <div className="profile-cta reveal flex flex-wrap items-center justify-between gap-6 border border-[var(--line)] bg-[var(--alabaster-deep)] p-12 max-[640px]:flex-col max-[640px]:items-stretch max-[640px]:px-5 max-[640px]:py-7">
    <div>
      <h3 className="mb-[.4rem] text-[1.3rem]">Want the full studio profile?</h3>
      <p className="text-[.92rem] text-[#4B534F]">Services, process, team, and the complete project list in one document.</p>
    </div>
     <a className="inline-flex items-center justify-center gap-2 rounded-[2px] border-0 bg-forest px-6 py-3 text-[.875rem] leading-[1.4] font-semibold tracking-[.01em] text-alabaster transition-[background,transform] duration-300 hover:-translate-y-px hover:bg-forest-hover max-[640px]:min-h-[50px]" href="mailto:tactspaces@gmail.com?subject=Request%20for%20TactSpaces%20Studio%20Profile">Request Studio Profile →</a>
  </div>
</section>
    </>
  );
}
