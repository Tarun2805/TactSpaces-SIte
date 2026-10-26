import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import logo from '../../assets/tactspaces-logo.png';
import { DESKTOP_MENU_QUERY, SITE_NAVIGATION } from '../../constants/site-navigation';
import type { PageName } from '../../types/site';

interface SiteNavigationProps {
  page: PageName;
}

export function SiteNavigation({ page }: SiteNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const root = document.documentElement;
    const previousHeight = root.style.getPropertyValue('--nav-h');
    const updateHeight = () => {
      root.style.setProperty('--nav-h', `${nav.getBoundingClientRect().height}px`);
    };
    updateHeight();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateHeight) : undefined;
    observer?.observe(nav, { box: 'border-box' });
    if (!observer) window.addEventListener('resize', updateHeight);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateHeight);
      if (previousHeight) root.style.setProperty('--nav-h', previousHeight);
      else root.style.removeProperty('--nav-h');
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('nav-locked', isOpen);
    return () => document.body.classList.remove('nav-locked');
  }, [isOpen]);

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_MENU_QUERY);
    const closeOnResize = () => { if (desktop.matches) setIsOpen(false); };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    desktop.addEventListener('change', closeOnResize);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      desktop.removeEventListener('change', closeOnResize);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const close = () => setIsOpen(false);

  return (
    <>
      <nav ref={navRef} id="nav" aria-label="Main navigation">
        <a className="logo-mark" href="/">
          <img src={typeof logo === 'string' ? logo : logo.src} alt="TactSpaces" />
        </a>
        <div className={`nav-links${isOpen ? ' open' : ''}`} id="navLinks">
          {SITE_NAVIGATION.map((item) => (
            <a key={item.page} href={item.href} className={item.page === page ? 'current' : undefined}
              aria-current={item.page === page ? 'page' : undefined} onClick={close}>
              {item.label}
            </a>
          ))}
          <a className="btn drawer-cta" href="/command-center" onClick={close}>Start Your Project →</a>
        </div>
        <div className="nav-actions">
          <a className="btn" href="/command-center">
            <span className="btn-label-full">Start Your Project</span>
            <span className="btn-label-short">Start Project</span>&nbsp;→
          </a>
          <button ref={toggleRef} className={`nav-toggle${isOpen ? ' open' : ''}`} id="navToggle"
            type="button" aria-label="Toggle menu" aria-expanded={isOpen} aria-controls="navLinks"
            onClick={() => setIsOpen((open) => !open)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className={`nav-backdrop${isOpen ? ' open' : ''}`} id="navBackdrop" onClick={close} aria-hidden="true" />
    </>
  );
}
