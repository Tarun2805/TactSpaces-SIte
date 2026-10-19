import logo from '../../assets/tactspaces-logo.png';

interface SiteFooterProps {
  siteRoot?: string;
}

export function SiteFooter({ siteRoot = '' }: SiteFooterProps) {
  return (
    <footer>
      <div className="footer-grid">
    <div>
      <img src={logo} alt="TactSpaces" className="h-[34px] brightness-0 invert mb-4" />
      <p className="max-w-[260px] opacity-70">Architecture &amp; Interiors, governed by precision.</p>
    </div>
    <div>
      <h4>Explore</h4>
      <a href={`${siteRoot}anatomy.html`}>Anatomy of Execution</a>
      <a href={`${siteRoot}standard.html`}>The Standard</a>
      <a href={`${siteRoot}command-center.html`}>Command Center</a>
    </div>
    <div>
      <h4>Studio</h4>
      <a href={`${siteRoot}studio.html`}>About</a>
      <a href={`${siteRoot}studio.html#team`}>Our Team</a>
      <a href={`${siteRoot}studio.html#profile`}>Download Profile</a>
    </div>
    <div>
      <h4>Contact</h4>
      <p>+91 73489 21433</p>
      <p>tactspaces@gmail.com</p>
      <p>#16, SRS Building, Gangaiah Layout,<br />Kereguddadahalli, Bengaluru 560090</p>
    </div>
  </div>
  <div className="footer-bottom">
    <span>© 2026 TactSpaces Architecture &amp; Interiors</span>
    <span>tactspaces.in</span>
  </div>
    </footer>
  );
}
