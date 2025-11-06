import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      role="img"
      aria-label="Stoics Educational Services Logo"
      className={cn('h-10 w-auto', className)}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#8e2de2' }} />
          <stop offset="100%" style={{ stopColor: '#4a00e0' }} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#logoGradient)" />
      <path
        d="M62,25 C52,25 48,32 48,38 C48,45 53,50 60,50 L75,50 L75,38 L60,38 C58,38 56,37 56,35 C56,33 58,31 62,31 C70,31 75,35 75,45 L75,55 C75,65 70,75 60,75 C50,75 45,70 45,60 L25,60 L25,72 L45,72 C48,70 50,68 50,65 C50,62 48,60 45,60"
        stroke="#FFFFFF"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
