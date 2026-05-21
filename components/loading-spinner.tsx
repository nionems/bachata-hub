import React from 'react'

interface LoadingSpinnerProps {
  message?: string
  color?: 'primary' | 'red' | 'white'
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({
  message = 'Loading...',
}: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">

        {/* Dancing couple SVG */}
        <svg
          viewBox="0 0 140 190"
          width="120"
          height="160"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Floating music notes */}
          <g fill="hsl(270,91%,65%)" opacity="0.7">
            <text className="note-1" x="10"  y="60" fontSize="14">♪</text>
            <text className="note-2" x="112" y="55" fontSize="12">♫</text>
            <text className="note-3" x="60"  y="40" fontSize="10">♩</text>
          </g>

          {/* Couple — sways as one unit */}
          <g className="dance-couple">

            {/* ── Woman (left) ── */}
            <g className="dance-bob">
              {/* Head */}
              <circle cx="48" cy="62" r="12" fill="hsl(270,91%,65%)" />
              {/* Hair bun */}
              <circle cx="48" cy="51" r="7" fill="#7c3aed" />
              {/* Neck + torso */}
              <line x1="48" y1="74" x2="48" y2="110"
                stroke="hsl(270,91%,65%)" strokeWidth="6" strokeLinecap="round"/>
              {/* Skirt */}
              <g className="dance-skirt">
                <path
                  d="M38,105 Q24,140 18,172 L78,172 Q72,140 58,105 Z"
                  fill="hsl(270,91%,72%)" opacity="0.9"
                />
              </g>
              {/* Left arm — extended outward */}
              <line x1="48" y1="86" x2="16" y2="100"
                stroke="hsl(270,91%,65%)" strokeWidth="4" strokeLinecap="round"/>
              {/* Right arm — resting on partner's shoulder */}
              <line x1="48" y1="84" x2="82" y2="76"
                stroke="hsl(270,91%,65%)" strokeWidth="4" strokeLinecap="round"/>
            </g>

            {/* ── Man (right) ── */}
            <g className="dance-bob">
              {/* Head */}
              <circle cx="92" cy="60" r="12" fill="hsl(160,84%,39%)" />
              {/* Torso */}
              <line x1="92" y1="72" x2="92" y2="128"
                stroke="hsl(160,84%,39%)" strokeWidth="7" strokeLinecap="round"/>
              {/* Left leg */}
              <line x1="92" y1="128" x2="76" y2="172"
                stroke="hsl(160,84%,39%)" strokeWidth="5" strokeLinecap="round"/>
              {/* Right leg */}
              <line x1="92" y1="128" x2="108" y2="172"
                stroke="hsl(160,84%,39%)" strokeWidth="5" strokeLinecap="round"/>
              {/* Left arm — around woman's waist */}
              <line x1="92" y1="90" x2="56" y2="100"
                stroke="hsl(160,84%,39%)" strokeWidth="4" strokeLinecap="round"/>
              {/* Right arm — extended outward */}
              <line x1="92" y1="86" x2="124" y2="96"
                stroke="hsl(160,84%,39%)" strokeWidth="4" strokeLinecap="round"/>
            </g>

            {/* Joined hands (outside hands touching) */}
            <circle cx="14" cy="100" r="4" fill="hsl(270,91%,55%)" />
            <circle cx="126" cy="97" r="4" fill="hsl(160,84%,32%)" />

          </g>
        </svg>

        <p className="text-primary text-sm font-medium text-center animate-pulse">
          {message}
        </p>
      </div>
    </div>
  )
}
