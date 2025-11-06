import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={cn('h-10 w-10', className)}
      aria-hidden="true"
    >
      <g transform="translate(0, -5)">
        {/* Laurel Wreath - Gold */}
        <path
          d="M35 55 A30 35 0 0 0 20 25 L15 30 A25 30 0 0 1 30 60z"
          fill="#c09b43"
        />
        <path
          d="M25 45 A20 25 0 0 0 15 20 L10 25 A25 30 0 0 1 20 50z"
          fill="#c09b43"
        />
        <path
          d="M65 55 A30 35 0 0 1 80 25 L85 30 A25 30 0 0 0 70 60z"
          fill="#c09b43"
        />
        <path
          d="M75 45 A20 25 0 0 1 85 20 L90 25 A25 30 0 0 0 80 50z"
          fill="#c09b43"
        />
        <g fill="#c09b43">
            {/* Left side leaves */}
            <ellipse transform="rotate(-30 28 38)" cx="28" cy="38" rx="7" ry="2.5"/>
            <ellipse transform="rotate(-40 22 48)" cx="22" cy="48" rx="7" ry="2.5"/>
            <ellipse transform="rotate(-50 18 58)" cx="18" cy="58" rx="7" ry="2.5"/>
            <ellipse transform="rotate(-60 15 68)" cx="15" cy="68" rx="7" ry="2.5"/>
            {/* Right side leaves */}
            <ellipse transform="rotate(30 72 38)" cx="72" cy="38" rx="7" ry="2.5"/>
            <ellipse transform="rotate(40 78 48)" cx="78" cy="48" rx="7" ry="2.5"/>
            <ellipse transform="rotate(50 82 58)" cx="82" cy="58" rx="7" ry="2.5"/>
            <ellipse transform="rotate(60 85 68)" cx="85" cy="68" rx="7" ry="2.5"/>
        </g>
        
        {/* Column - Dark Blue */}
        <g fill="hsl(var(--primary))">
          <rect x="38" y="20" width="24" height="3" />
          <path d="M40 23 C 35 23, 35 28, 40 28 L 60 28 C 65 28, 65 23, 60 23 Z" />
          <rect x="42" y="28" width="16" height="10" />
        </g>
        
        {/* Book - Dark Blue */}
        <path
          d="M15 80 Q50 60, 85 80 L85 45 Q50 65, 15 45 L15 80z"
          fill="hsl(var(--primary))"
        />
        <path
          d="M50 42 L50 78 M15 45 Q50 65, 85 45"
          stroke="#FFFFFF"
          strokeWidth="2"
          fill="none"
        />
      </g>
    </svg>
  );
}