export default function PreviewPage() {
  return (
    <div className="flex flex-col gap-0 bg-white">

      {/* Option 1 — Wave bottom */}
      <div className="relative h-52 flex items-center justify-center overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary" />
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path fill="white" d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" />
        </svg>
        <p className="relative z-10 text-white text-2xl font-bold drop-shadow">1 — Wave bottom</p>
      </div>

      {/* Option 2 — Diagonal cut */}
      <div className="relative h-52 flex items-center justify-center overflow-hidden mb-8"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 78%, 0 100%)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary" />
        <p className="relative z-10 text-white text-2xl font-bold drop-shadow">2 — Diagonal cut</p>
      </div>

      {/* Option 3 — Gradient + glowing blobs (same colors) */}
      <div className="relative h-52 flex items-center justify-center overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary" />
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
        <p className="relative z-10 text-white text-2xl font-bold drop-shadow">3 — Glowing blobs</p>
      </div>

      {/* Option 4 — Diagonal + wave combined */}
      <div className="relative h-52 flex items-center justify-center overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path fill="white" d="M0,20 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
        <p className="relative z-10 text-white text-2xl font-bold drop-shadow">4 — Wave + depth</p>
      </div>

    </div>
  )
}
