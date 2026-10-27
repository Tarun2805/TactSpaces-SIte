import logo from '../../assets/tactspaces-logo.png';

export function SiteFooter() {
  return (
    <footer>
      <div className="footer-grid">
    <div>
      <img src={typeof logo === 'string' ? logo : logo.src} alt="TactSpaces" className="h-[34px] brightness-0 invert mb-4" />
      <p className="max-w-[260px] opacity-70">Architecture &amp; Interiors, governed by precision.</p>
    </div>
    <div>
      <h4>Explore</h4>
      <a href="/anatomy">Anatomy of Execution</a>
      <a href="/standard">The Standard</a>
      <a href="/command-center">Command Center</a>
    </div>
    <div>
      <h4>Studio</h4>
      <a href="/studio">About</a>
      <a href="/studio#team">Our Team</a>
      <a href="/studio#profile">Download Profile</a>
    </div>
    <div>
      <h4>Contact</h4>
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
  <div className="footer-bottom">
    <span>© 2026 TactSpaces Architecture &amp; Interiors</span>
  </div>
    </footer>
  );
}
