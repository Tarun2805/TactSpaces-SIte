import type { Metadata } from 'next';
import HomeView from './home/home-view';
import { PageFrame } from './site-shell';

export const metadata: Metadata = {
  title: 'Architecture & Interiors in Bengaluru | TactSpaces',
  description: 'TactSpaces delivers architecture and turnkey interior design across Bengaluru, with documented costs, clear timelines, and accountable execution.',
  alternates: { canonical: '/' },
  openGraph: { title: 'Architecture & Interiors in Bengaluru | TactSpaces', description: 'Architecture and turnkey interior design across Bengaluru, governed by precision.', url: '/' },
};

export default function Home() { return <PageFrame page="home"><HomeView /></PageFrame>; }
