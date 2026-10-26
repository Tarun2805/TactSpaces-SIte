import type { Metadata } from 'next';
import AnatomyView from './anatomy-view';
import { PageFrame } from '../site-shell';

export const metadata: Metadata = {
  title: 'Architecture & Interior Design Projects | TactSpaces',
  description: 'Selected residential, commercial, and hospitality projects by TactSpaces in Bengaluru.',
  alternates: { canonical: '/anatomy' },
};

export default function Anatomy() { return <PageFrame page="anatomy"><AnatomyView /></PageFrame>; }
