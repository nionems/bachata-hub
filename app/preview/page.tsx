export default function PreviewPage() {
  return (
    <div className="flex flex-col gap-0">

      {/* Option 1 - Aurora blobs */}
      <div className="relative h-48 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#0f0a1e]" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-teal-500/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-600/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <p className="relative z-10 text-white text-2xl font-bold tracking-wide">1 — Aurora Blobs</p>
      </div>

      {/* Option 2 - Diagonal vivid */}
      <div className="relative h-48 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-violet-600 to-fuchsia-500" />
        <div className="absolute inset-0 bg-gradient-to-tl from-white/10 to-transparent" />
        <p className="relative z-10 text-white text-2xl font-bold tracking-wide drop-shadow">2 — Diagonal Vivid</p>
      </div>

      {/* Option 3 - Mesh warm */}
      <div className="relative h-48 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-orange-400 to-purple-600" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl" />
        <p className="relative z-10 text-white text-2xl font-bold tracking-wide drop-shadow">3 — Mesh Warm</p>
      </div>

    </div>
  )
}
