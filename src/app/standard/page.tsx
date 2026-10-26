import type { Metadata } from 'next';
import StandardView from './standard-view';
import { PageFrame } from '../site-shell';

export const metadata: Metadata = { title: 'The TactSpaces Project Delivery Standard', description: 'Seven documented stages guide each TactSpaces project from discovery through handover.', alternates: { canonical: '/standard' } };
export default function Standard() { return <PageFrame page="standard"><StandardView /></PageFrame>; }
