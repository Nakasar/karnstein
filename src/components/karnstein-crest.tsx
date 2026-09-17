import { cn } from "@/lib/utils";

/**
 * Blason de la maison : de sable, à la chauve-souris essorante d'argent,
 * accompagnée en pointe de trois gouttes de sang.
 */
export function KarnsteinCrest({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 70"
      role="img"
      aria-label="Blason de la maison Karnstein"
      className={cn("h-9 w-9", className)}
    >
      <defs>
        <linearGradient id="crest-field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1418" />
          <stop offset="100%" stopColor="#0d0709" />
        </linearGradient>
        <linearGradient id="crest-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e2c785" />
          <stop offset="45%" stopColor="#9d7b3c" />
          <stop offset="100%" stopColor="#e2c785" />
        </linearGradient>
      </defs>

      <path
        d="M32 3 L60 12 V36 C60 51 46 61 32 66 C18 61 4 51 4 36 V12 Z"
        fill="url(#crest-field)"
        stroke="url(#crest-rim)"
        strokeWidth="2.4"
      />
      <path
        d="M32 8 L55 15.5 V36 C55 48 44 56.5 32 61 C20 56.5 9 48 9 36 V15.5 Z"
        fill="none"
        stroke="#7d1d24"
        strokeWidth="1"
        opacity="0.7"
      />

      {/* Chauve-souris */}
      <g fill="#e8dcc6">
        <path d="M29.4 21.4 L31 25.4 L32 24.2 L33 25.4 L34.6 21.4 L32 23 Z" />
        <path
          d="M32 27.6c-1.6-3-3.9-4.8-6.4-4.9.9 1.6.9 3.2.2 4.7-2.6-2.5-6.4-3.2-9.6-1.6 1.7.9 2.6 2.3 2.6 4-2.4 0-4.3.9-5.8 2.6 3.2 0 5.1 1.5 5.9 4.2 2.4-2.5 5.6-3.2 8.8-1.6 1.7.9 3.2 2.5 4.3 4.7 1.1-2.2 2.6-3.8 4.3-4.7 3.2-1.6 6.4-.9 8.8 1.6.8-2.7 2.7-4.2 5.9-4.2-1.5-1.7-3.4-2.6-5.8-2.6 0-1.7.9-3.1 2.6-4-3.2-1.6-7-.9-9.6 1.6-.7-1.5-.7-3.1.2-4.7-2.5.1-4.8 1.9-6.4 4.9z"
          opacity="0.95"
        />
      </g>

      {/* Trois gouttes de sang */}
      <g fill="#a9202a">
        <path d="M24 44c1.6 2.1 2.4 3.4 2.4 4.4a2.4 2.4 0 1 1-4.8 0c0-1 .8-2.3 2.4-4.4z" />
        <path d="M32 47.5c1.6 2.1 2.4 3.4 2.4 4.4a2.4 2.4 0 1 1-4.8 0c0-1 .8-2.3 2.4-4.4z" />
        <path d="M40 44c1.6 2.1 2.4 3.4 2.4 4.4a2.4 2.4 0 1 1-4.8 0c0-1 .8-2.3 2.4-4.4z" />
      </g>
    </svg>
  );
}
