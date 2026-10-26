import type { Metadata } from 'next';
import CommandCenterView from './command-center-view';
import { PageFrame } from '../site-shell';

export const metadata: Metadata = { title: 'Start an Architecture or Interiors Project | TactSpaces', description: 'Share your project brief and start a prepared discovery conversation with TactSpaces.', alternates: { canonical: '/command-center' } };
export default function CommandCenter() { return <PageFrame page="command-center"><CommandCenterView /></PageFrame>; }
