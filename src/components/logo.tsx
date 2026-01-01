import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-10 w-auto', className)}
    >
      <path
        d="M100 10 L160 40 L160 100 Q160 160 100 190 Q40 160 40 100 L40 40 Z"
        fill="hsl(var(--primary))"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2"
      />
      <text
        x="100"
        y="80"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        fontWeight="bold"
        fill="hsl(var(--primary-foreground))"
        textAnchor="middle"
      >
        STOICS
      </text>
      <text
        x="100"
        y="100"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        fontWeight="bold"
        fill="hsl(var(--primary-foreground))"
        textAnchor="middle"
      >
        INSTITUTE
      </text>
      <line
        x1="60"
        y1="110"
        x2="140"
        y2="110"
        stroke="hsl(var(--accent))"
        strokeWidth="2"
      />
      <g>
        <rect x="55" y="120" width="8" height="35" fill="hsl(var(--accent))" />
        <rect x="52" y="118" width="14" height="4" fill="hsl(var(--accent))" />
        <rect x="137" y="120" width="8" height="35" fill="hsl(var(--accent))" />
        <rect x="134" y="118" width="14" height="4" fill="hsl(var(--accent))" />
      </g>
      <path
        d="M 70 50 Q 65 55 70 60"
        stroke="hsl(var(--accent))"
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M 130 50 Q 135 55 130 60"
        stroke="hsl(var(--accent))"
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />
      <circle cx="100" cy="35" r="2" fill="hsl(var(--accent))" opacity="0.8" />
    </svg>
  );
}
