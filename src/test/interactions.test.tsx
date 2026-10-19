import { act, fireEvent, render, screen } from '@testing-library/react';
import { StrictMode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import AnatomyPage from '../app/anatomy/page';
import ProjectPage from '../app/projects/page';
import { PROJECTS } from '../constants/projects';
import HomePage from '../app/home/page';
import StandardPage from '../app/standard/page';
import StudioPage from '../app/studio/page';
import { ProjectPlannerForm } from '../components/forms/project-planner-form';
import { SiteLayout } from '../components/shared/site-layout';
import { SiteNavigation } from '../components/shared/site-navigation';

describe('navigation', () => {
  it('keeps sticky offsets aligned with the measured navigation height and cleans up', () => {
    let notifyResize: () => void = () => {};
    const observe = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: () => void) { notifyResize = callback; }
      observe = observe;
      disconnect = disconnect;
    });
    const bounds = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect');
    bounds.mockReturnValue({ height: 86.5 } as DOMRect);
    const { container, unmount } = render(<StrictMode><SiteNavigation page="anatomy" /></StrictMode>);
    const root = document.documentElement;
    expect(root.style.getPropertyValue('--nav-h')).toBe('86.5px');
    expect(observe).toHaveBeenLastCalledWith(container.querySelector('#nav'), { box: 'border-box' });
    bounds.mockReturnValue({ height: 64.2 } as DOMRect);
    act(() => notifyResize());
    expect(root.style.getPropertyValue('--nav-h')).toBe('64.2px');
    unmount();
    expect(root.style.getPropertyValue('--nav-h')).toBe('');
    expect(disconnect).toHaveBeenCalledTimes(2);
  });

  it('updates the sticky offset on resize when ResizeObserver is unavailable', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    const bounds = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect');
    bounds.mockReturnValue({ height: 87 } as DOMRect);
    const { unmount } = render(<SiteNavigation page="anatomy" />);
    expect(document.documentElement.style.getPropertyValue('--nav-h')).toBe('87px');
    bounds.mockReturnValue({ height: 64 } as DOMRect);
    fireEvent(window, new Event('resize'));
    expect(document.documentElement.style.getPropertyValue('--nav-h')).toBe('64px');
    unmount();
    fireEvent(window, new Event('resize'));
    expect(document.documentElement.style.getPropertyValue('--nav-h')).toBe('');
  });

  it('opens, closes on Escape/backdrop/link, and unlocks scrolling on cleanup', () => {
    const { container, unmount } = render(<StrictMode><SiteNavigation page="home" /></StrictMode>);
    const toggle = screen.getByRole('button', { name: 'Toggle menu' });
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(document.body.classList.contains('nav-locked')).toBe(true);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    fireEvent.click(container.querySelector('#navBackdrop')!);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    fireEvent.click(screen.getByRole('link', { name: 'The Standard' }));
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    unmount();
    expect(document.body.classList.contains('nav-locked')).toBe(false);
  });

  it('closes the menu when the desktop breakpoint is reached', () => {
    const desktop = new EventTarget() as EventTarget & { matches: boolean };
    desktop.matches = false;
    vi.spyOn(window, 'matchMedia').mockReturnValue(desktop as unknown as MediaQueryList);
    render(<SiteNavigation page="studio" />);
    const toggle = screen.getByRole('button', { name: 'Toggle menu' });
    fireEvent.click(toggle);
    act(() => { desktop.matches = true; desktop.dispatchEvent(new Event('change')); });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.body.classList.contains('nav-locked')).toBe(false);
  });
});

describe('page interactions', () => {
  it('animates the home visual after the original delay', () => {
    vi.useFakeTimers();
    const { container } = render(<StrictMode><HomePage /></StrictMode>);
    expect(container.querySelector('#heroVisual')?.classList.contains('animate')).toBe(false);
    act(() => { vi.advanceTimersByTime(400); });
    expect(container.querySelector('#heroVisual')?.classList.contains('animate')).toBe(true);
  });

  it('filters the portfolio and restores all eight cards, including listing-only projects', () => {
    const { container } = render(<AnatomyPage />);
    const cards = () => Array.from(container.querySelectorAll<HTMLElement>('.case-card'));
    fireEvent.click(screen.getByRole('button', { name: 'Premium Residential' }));
    expect(cards().filter((card) => card.style.display !== 'none')).toHaveLength(5);
    fireEvent.click(screen.getByRole('button', { name: 'Boutique Hospitality' }));
    expect(cards().filter((card) => card.style.display !== 'none')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Commercial & Workspaces' }));
    expect(cards().filter((card) => card.style.display !== 'none')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(cards().filter((card) => card.style.display !== 'none')).toHaveLength(8);
  });

  it('keeps comparison sliders independent', () => {
    const { container } = render(<><ProjectPage project={PROJECTS[1]} /><ProjectPage project={PROJECTS[2]} /></>);
    fireEvent.change(screen.getByRole('slider', { name: 'Pinaki Residence before and after comparison' }), { target: { value: '75' } });
    expect(container.querySelector<HTMLElement>('#pinaki-residence-2 .ba-before-wrap')?.style.clipPath).toBe('inset(0 25% 0 0)');
    expect(container.querySelector<HTMLElement>('#pinaki-residence-2 .ba-handle')?.style.left).toBe('75%');
    expect(container.querySelector<HTMLElement>('#hakuna-matata-0 .ba-before-wrap')?.style.clipPath).toBe('inset(0 50% 0 0)');
  });

  it('reveals material callouts on touch and dismisses them after the original delay', () => {
    vi.useFakeTimers();
    const { container } = render(<ProjectPage project={PROJECTS[0]} />);
    fireEvent.touchStart(screen.getByRole('button', { name: 'Charcoal fluted panel · reception facade' }));
    expect(container.querySelector('.callout-tip')?.classList.contains('show')).toBe(true);
    act(() => { vi.advanceTimersByTime(2200); });
    expect(container.querySelector('.callout-tip')?.classList.contains('show')).toBe(false);
  });

  it('toggles document previews with a tap or keyboard', () => {
    const { container } = render(<StandardPage />);
    const card = container.querySelector('.doc-card')!;
    fireEvent.click(card);
    expect(card.classList.contains('open')).toBe(true);
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(card.classList.contains('open')).toBe(false);
  });

  it('restores incoming fragment links after React mounts', () => {
    vi.mocked(HTMLElement.prototype.scrollIntoView).mockClear();
    window.history.replaceState({}, '', '/studio.html#team');
    render(<SiteLayout page="studio"><StudioPage /></SiteLayout>);
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
  });
});

describe('project planner', () => {
  it('retains choices, custom typology, budget and contact values when navigating back', () => {
    const { container } = render(<ProjectPlannerForm />);
    const next = () => screen.getByRole<HTMLButtonElement>('button', { name: 'Continue →' });
    expect(next().disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /Other/ }));
    fireEvent.change(screen.getByLabelText("Tell us what you're building"), { target: { value: 'Clinic' } });
    fireEvent.click(next());
    expect(next().disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /Turnkey Execution/ }));
    fireEvent.click(next());
    expect(next().disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: '1–3 months' }));
    fireEvent.change(screen.getByLabelText('Budget'), { target: { value: '60' } });
    expect(screen.getByText('₹60L')).toBeTruthy();
    fireEvent.click(next());
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Test Client' } });
    fireEvent.click(screen.getByRole('button', { name: '← Back' }));
    expect(screen.getByRole<HTMLInputElement>('slider', { name: 'Budget' }).value).toBe('60');
    fireEvent.click(screen.getByRole('button', { name: '← Back' }));
    fireEvent.click(screen.getByRole('button', { name: '← Back' }));
    expect(screen.getByLabelText<HTMLInputElement>("Tell us what you're building").value).toBe('Clinic');
    fireEvent.click(next()); fireEvent.click(next()); fireEvent.click(next());
    expect(screen.getByLabelText<HTMLInputElement>('Full Name').value).toBe('Test Client');
    // The old demo confirmation is intentionally gone: navigation alone must
    // never imply that a real lead was delivered.
    expect(screen.queryByRole('status')).toBeNull();
    expect(container.querySelector<HTMLElement>('.planner')?.style.display).not.toBe('none');
  });

  it('scrolls back to the planner on mobile, including a return to step one', () => {
    const original = window.matchMedia('');
    vi.spyOn(window, 'matchMedia').mockReturnValue({ ...original, matches: true });
    render(<ProjectPlannerForm />);
    const scroll = vi.mocked(HTMLElement.prototype.scrollIntoView);
    scroll.mockClear();
    expect(scroll).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /Villa/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue →' }));
    fireEvent.click(screen.getByRole('button', { name: '← Back' }));
    expect(scroll).toHaveBeenCalledTimes(2);
  });
});
