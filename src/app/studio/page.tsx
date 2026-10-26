import type { Metadata } from 'next';
import StudioView from './studio-view';
import { PageFrame } from '../site-shell';

export const metadata: Metadata = { title: 'About the TactSpaces Studio', description: 'Meet TactSpaces, a Bengaluru architecture and interiors studio.', alternates: { canonical: '/studio' } };
export default function Studio() { return <PageFrame page="studio"><StudioView /></PageFrame>; }
