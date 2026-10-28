interface ArrowIconProps {
  direction?: 'left' | 'right' | 'down';
  className?: string;
}

export function ArrowIcon({ direction = 'right', className = 'size-4' }: ArrowIconProps) {
  const paths = {
    right: <><path d="M4 12h16" /><path d="m13 5 7 7-7 7" /></>,
    left: <><path d="M20 12H4" /><path d="m11 19-7-7 7-7" /></>,
    down: <><path d="M12 4v16" /><path d="m5 13 7 7 7-7" /></>,
  };

  return (
    <svg aria-hidden="true" className={`inline-block shrink-0 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {paths[direction]}
    </svg>
  );
}
