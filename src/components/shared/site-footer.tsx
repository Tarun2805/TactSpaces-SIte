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
        href="https://maps.app.goo.gl/yyCswfFMvS2y59Bq6"
        target="_blank"
        rel="noopener noreferrer"
      >
        #16, SRS Building, Gangaiah Layout,<br />Kereguddadahalli, Bengaluru 560090
      </a>
    </div>
  </div>
  <div className="footer-bottom">
    <span>© 2026 TactSpaces Architecture &amp; Interiors</span>
    <span>tactspaces.in</span>
  </div>
    </footer>
  );
}
