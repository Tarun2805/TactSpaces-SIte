import { useState, type ReactNode } from 'react';

interface DocumentCardProps {
  children: ReactNode;
}

export function DocumentCard({ children }: DocumentCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`doc-card${isOpen ? ' open' : ''}`} role="button" tabIndex={0} aria-expanded={isOpen}
      onClick={() => setIsOpen((open) => !open)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setIsOpen((open) => !open);
        }
      }}>
      {children}
    </div>
  );
}
