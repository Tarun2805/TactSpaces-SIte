import { useState, type ReactNode } from 'react';

interface DocumentCardProps {
  children: ReactNode;
}

export function DocumentCard({ children }: DocumentCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <button type="button" className={`doc-card group relative w-full cursor-pointer overflow-hidden border border-line bg-alabaster p-0 text-left text-inherit [font:inherit] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest${isOpen ? ' open' : ''}`} aria-expanded={isOpen}
      onClick={() => setIsOpen((open) => !open)}>
      {children}
    </button>
  );
}
