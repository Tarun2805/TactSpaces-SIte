import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import logo from '../../assets/tactspaces-logo.png';
import { DESKTOP_MENU_QUERY, SITE_NAVIGATION } from '../../constants/site-navigation';
import type { PageName } from '../../types/site';
import { ArrowIcon } from './arrow-icon';

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
      <nav ref={navRef} id="nav" aria-label="Main navigation" className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-[rgba(249,249,247,0.92)] px-[1rem] py-[.6rem] backdrop-blur-[10px] min-[901px]:px-[1.4rem] min-[901px]:py-[1.4rem]">
        <a className="logo-mark flex min-h-11 items-center gap-[.65rem]" href="/">
          <img className="block h-6 w-auto min-[901px]:h-[30px]" src={typeof logo === 'string' ? logo : logo.src} alt="TactSpaces" />
        </a>
        <div className={`fixed inset-y-0 right-0 z-[49] flex h-dvh w-[min(78vw,320px)] flex-col items-start gap-0 bg-[#f9f9f7] px-8 pb-8 pt-[5.5rem] text-[1.05rem] text-[#22282a] shadow-[-12px_0_32px_rgba(0,0,0,.14)] transition-transform duration-[350ms] ${isOpen ? 'translate-x-0 visible delay-0' : 'invisible translate-x-full delay-[350ms]'} min-[901px]:visible min-[901px]:static min-[901px]:z-auto min-[901px]:h-auto min-[901px]:w-auto min-[901px]:translate-x-0 min-[901px]:flex-row min-[901px]:gap-[2.4rem] min-[901px]:bg-transparent min-[901px]:p-0 min-[901px]:text-[.85rem] min-[901px]:font-semibold min-[901px]:shadow-none min-[901px]:delay-0`} id="navLinks">
          {SITE_NAVIGATION.map((item) => (
            <a key={item.page} href={item.href} className={`relative flex min-h-12 w-full items-center border-b border-transparent py-[1.05rem] min-[901px]:min-h-0 min-[901px]:w-auto min-[901px]:border-0 min-[901px]:py-0 min-[901px]:pb-1 ${item.page === page ? 'text-[#1f2d28]' : ''}`}
              aria-current={item.page === page ? 'page' : undefined} onClick={close}>
              {item.label}
            </a>
          ))}
          <a className="mt-7 flex min-h-[50px] w-full items-center justify-center gap-2 bg-[#1f2d28] px-6 py-4 text-[.95rem] font-semibold text-[#f9f9f7] no-underline min-[901px]:hidden" href="/command-center" onClick={close}>Start Your Project <ArrowIcon /></a>
        </div>
        <div className="flex shrink-0 items-center gap-[.75rem] min-[901px]:gap-[.9rem]">
          <a className="inline-flex items-center gap-2 rounded-[2px] border-0 bg-[#1f2d28] px-4 py-[.65rem] text-[.72rem] font-semibold tracking-[.01em] text-[#f9f9f7] no-underline transition-[background,transform] duration-300 hover:-translate-y-px hover:bg-[#16211d] min-[901px]:px-6 min-[901px]:py-3 min-[901px]:text-[.82rem]" href="/command-center">
            <span className="max-[520px]:hidden min-[901px]:inline">Start Your Project</span>
            <span className="hidden max-[520px]:inline min-[901px]:hidden">Start Project</span><ArrowIcon />
          </a>
          <button ref={toggleRef} className="relative z-[60] -mr-2 flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-[5px] border-0 bg-transparent p-0 min-[901px]:hidden" id="navToggle"
            type="button" aria-label="Toggle menu" aria-expanded={isOpen} aria-controls="navLinks"
            onClick={() => setIsOpen((open) => !open)}>
            <span className={`h-0.5 w-6 bg-[#22282a] transition-[transform,opacity] duration-300 ${isOpen ? 'translate-y-[7px] rotate-45' : ''}`} /><span className={`h-0.5 w-6 bg-[#22282a] transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} /><span className={`h-0.5 w-6 bg-[#22282a] transition-[transform,opacity] duration-300 ${isOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>
      <div className={`fixed inset-0 z-[48] bg-[rgba(31,45,40,.4)] transition-opacity duration-300 ${isOpen ? 'pointer-events-auto opacity-100 min-[901px]:pointer-events-none min-[901px]:opacity-0' : 'pointer-events-none opacity-0'}`} id="navBackdrop" onClick={close} aria-hidden="true" />
    </>
  );
}
