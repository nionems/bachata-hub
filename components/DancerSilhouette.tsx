export default function DancerSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 280 260"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Female dancer (left) */}
      {/* Head */}
      <ellipse cx="95" cy="26" rx="14" ry="16" />
      {/* Flowing hair */}
      <path d="M82,18 Q68,8 63,26 Q67,42 82,36" />
      {/* Torso */}
      <path d="M82,42 Q78,56 77,70 Q76,84 80,95 L110,95 Q114,84 113,70 Q112,56 108,42 Q102,39 95,39 Q88,39 82,42Z" />
      {/* Flowing dress */}
      <path d="M80,95 Q72,120 52,158 Q38,184 28,218 L162,218 Q152,184 138,158 Q118,120 110,95Z" />
      {/* Right arm raised up to partner */}
      <path d="M108,52 Q124,38 138,22 Q143,15 148,10" stroke="white" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* Left arm extended back gracefully */}
      <path d="M80,62 Q62,55 48,42 Q42,35 38,26" stroke="white" strokeWidth="8" strokeLinecap="round" fill="none" />

      {/* Male dancer (right) */}
      {/* Head */}
      <ellipse cx="195" cy="22" rx="14" ry="16" />
      {/* Torso — broader shoulders */}
      <path d="M179,38 Q173,52 171,67 Q170,82 173,94 Q175,104 183,110 L207,110 Q215,104 217,94 Q220,82 219,67 Q217,52 211,38 Q204,35 195,35 Q186,35 179,38Z" />
      {/* Trousers / legs */}
      <path d="M183,110 Q179,142 175,172 Q172,192 170,222 L188,222 Q191,192 195,162 Q199,192 202,222 L220,222 Q218,192 215,172 Q211,142 207,110Z" />
      {/* Left arm raised holding female's hand */}
      <path d="M179,50 Q164,36 148,22 Q144,15 148,10" stroke="white" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* Right arm around female's back */}
      <path d="M211,68 Q185,72 155,68" stroke="white" strokeWidth="8" strokeLinecap="round" fill="none" />
    </svg>
  )
}
