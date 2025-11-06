import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      role="img"
      aria-label="Laurel wreath with book and column emblem"
      className={cn('h-10 w-auto', className)}
    >
      <defs>
        <style>
          {`
            .navy { fill: #0b3a57; }
            .gold { fill: #caa24a; }
          `}
        </style>
      </defs>
      <g transform="translate(512,320)">
        <g transform="translate(-240, -40)">
          <path
            className="navy"
            d="M160 200 C100 160 90 140 90 96 C90 56 120 40 160 40 L240 40 C210 80 200 112 200 160 C200 176 190 192 160 200 Z"
          />
          <path
            className="navy"
            d="M480 200 C540 160 550 140 550 96 C550 56 520 40 480 40 L400 40 C430 80 440 112 440 160 C440 176 450 192 480 200 Z"
          />
          <path
            className="navy"
            d="M160 200 C240 240 400 240 480 200 L480 216 C400 264 240 264 160 216 Z"
            transform="translate(0,0)"
          />
          <path
            className="navy"
            d="M200 136 C280 170 360 170 440 136"
            stroke="#0b3a57"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <g transform="translate(-58,-160)">
          <rect className="navy" x="-110" y="-20" width="220" height="16" rx="8" />
          <path
            className="navy"
            d="M-88 0 C-88 -28 -40 -28 -40 0 C-40 12 -32 20 -20 20 C-8 20 0 12 0 0 C0 -28 48 -28 48 0"
            transform="translate(0,0)"
          />
          <rect className="navy" x="-20" y="12" width="8" height="80" rx="4" />
          <rect className="navy" x="8" y="12" width="8" height="80" rx="4" />
          <rect className="navy" x="-44" y="12" width="8" height="80" rx="4" />
        </g>
      </g>
      <g transform="translate(256,320) scale(1.05)">
        <path
          className="gold"
          d="M0 0
      C-40 -30 -36 -82 -8 -120
      C-36 -150 -28 -210 20 -230
      C-8 -260 18 -300 64 -290
      C56 -260 84 -230 120 -220
      C100 -190 92 -150 120 -120
      C88 -90 80 -50 88 -20
      C64 -10 36 6 8 20
      C-8 30 -4 50 0 0 Z"
        />
        <g fill="#caa24a" transform="translate(0,0)">
          <ellipse cx="36" cy="-48" rx="14" ry="28" />
          <ellipse cx="58" cy="-88" rx="14" ry="28" />
          <ellipse cx="74" cy="-128" rx="14" ry="30" />
          <ellipse cx="86" cy="-168" rx="12" ry="30" />
          <ellipse cx="92" cy="-208" rx="10" ry="24" />
        </g>
      </g>
      <g transform="translate(768,320) scale(-1.05,1.05)">
        <path
          className="gold"
          d="M0 0
      C-40 -30 -36 -82 -8 -120
      C-36 -150 -28 -210 20 -230
      C-8 -260 18 -300 64 -290
      C56 -260 84 -230 120 -220
      C100 -190 92 -150 120 -120
      C88 -90 80 -50 88 -20
      C64 -10 36 6 8 20
      C-8 30 -4 50 0 0 Z"
        />
        <g fill="#caa24a" transform="translate(0,0)">
          <ellipse cx="36" cy="-48" rx="14" ry="28" />
          <ellipse cx="58" cy="-88" rx="14" ry="28" />
          <ellipse cx="74" cy="-128" rx="14" ry="30" />
          <ellipse cx="86" cy="-168" rx="12" ry="30" />
          <ellipse cx="92" cy="-208" rx="10" ry="24" />
        </g>
      </g>
      <g transform="translate(512,520)">
        <path
          className="gold"
          d="M-140 40 C-90 80 -40 92 0 92 C40 92 90 80 140 40 C100 64 44 82 0 82 C-44 82 -100 64 -140 40 Z"
        />
        <rect
          className="gold"
          x="-8"
          y="30"
          width="16"
          height="80"
          rx="8"
          transform="rotate(12)"
        />
        <rect
          className="gold"
          x="-8"
          y="30"
          width="16"
          height="80"
          rx="8"
          transform="rotate(-12)"
        />
      </g>
    </svg>
  );
}
