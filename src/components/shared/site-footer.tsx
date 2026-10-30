import logo from '../../assets/tactspaces-logo.png';

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-[#1f2d28] px-5 py-[3.25rem] text-[#f9f9f7] min-[641px]:mt-0 min-[641px]:px-[5vw] min-[641px]:pb-8 min-[641px]:pt-20">
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 pb-9 [&_a]:mb-[.6rem] [&_a]:block [&_a]:text-[.88rem] [&_a]:leading-[1.5] [&_a]:opacity-90 [&_p]:mb-[.6rem] [&_p]:block [&_p]:text-[.88rem] [&_p]:leading-[1.5] [&_p]:opacity-90 min-[901px]:grid-cols-[1.4fr_1fr_1fr_1fr] min-[901px]:gap-8 min-[901px]:pb-14 [&>div:first-child]:col-span-full min-[901px]:[&>div:first-child]:col-span-1">
    <div>
      <img src={typeof logo === 'string' ? logo : logo.src} alt="TactSpaces" className="h-[34px] brightness-0 invert mb-4" />
      <p className="max-w-[260px] opacity-70">Architecture &amp; Interiors, governed by precision.</p>
    </div>
    <div>
      <h4 className="mb-[1.1rem] text-[.72rem] font-semibold uppercase tracking-[.15em] opacity-60">Explore</h4>
      <a href="/anatomy">Anatomy of Execution</a>
      <a href="/standard">The Standard</a>
      <a href="/command-center">Command Center</a>
    </div>
    <div>
      <h4 className="mb-[1.1rem] text-[.72rem] font-semibold uppercase tracking-[.15em] opacity-60">Studio</h4>
      <a href="/studio">About</a>
      <a href="/studio#team">Our Team</a>
      <a href="/studio#gallery">Gallery</a>
      <a href="/studio#profile">Download Profile</a>
    </div>
    <div>
      <h4 className="mb-[1.1rem] text-[.72rem] font-semibold uppercase tracking-[.15em] opacity-60">Contact</h4>
      <a href="tel:+917348921433">+91 73489 21433</a>
      <a href="mailto:tactspaces@gmail.com">tactspaces@gmail.com</a>
      <a
        href="https://www.google.com/maps/place/TactSpaces/@13.0760055,77.5169975,20z/data=!4m6!3m5!1s0x3bae23c82f1f33cf:0x22ab220c68a00ee2!8m2!3d13.0761575!4d77.5171132!16s%2Fg%2F11xlj39ynh?entry=ttu&g_ep=EgoyMDI2MTAyMC4wIKXMDSoASAFQAw%3D%3D"
        target="_blank"
        rel="noopener noreferrer"
      >
        #16, SRS Building, Gangaiah Layout,<br />Kereguddadahalli, Bengaluru 560090
      </a>
    </div>
  </div>
  <div className="flex flex-col gap-[.35rem] border-t border-white/20 pt-5 text-xs opacity-55 min-[641px]:flex-row min-[641px]:justify-between min-[641px]:gap-6 min-[641px]:pt-[1.6rem]">
    <span>© 2026 TactSpaces Architecture &amp; Interiors</span>
  </div>
    </footer>
  );
}
