import { useState, type ReactNode } from 'react';

interface DocumentCardProps {
  children: ReactNode;
}

export function DocumentCard({ children }: DocumentCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <button type="button" className={`doc-card${isOpen ? ' open' : ''}`} aria-expanded={isOpen}
      onClick={() => setIsOpen((open) => !open)}>
      {children}
    </button>
  );
}
