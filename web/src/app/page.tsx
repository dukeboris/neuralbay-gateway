"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

export default function WelcomePage() {
  const router = useRouter()
  const { user } = useAuth()

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-950 px-4">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-gray-950 to-gray-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Logo with glow */}
        <div className="mx-auto mb-10">
          <div className="relative inline-flex">
            <div className="absolute inset-0 rounded-3xl bg-indigo-500 blur-2xl opacity-40" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/30 ring-1 ring-white/10">
              <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          v1.0 Beta · Now in Testing
        </div>

        {/* Title */}
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
          <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
            NeuralBay
          </span>
        </h1>
        <p className="mt-4 text-xl font-light tracking-wide text-indigo-300/80">
          AI Gateway
        </p>
        
        {/* Description */}
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-gray-400">
          One unified endpoint for 50+ AI models. Route intelligently across regions,
          monitor usage in real time, and scale without vendor lock-in.
        </p>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-px rounded-2xl bg-white/5 ring-1 ring-white/10">
          {[
            { value: "50+", label: "AI Models" },
            { value: "<100ms", label: "Latency SEA" },
            { value: "99.9%", label: "Uptime SLA" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-950/80 px-6 py-5 first:rounded-l-2xl last:rounded-r-2xl backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Feature pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {["OpenAI", "Claude", "Gemini", "DeepSeek", "Llama", "Mistral", "Falcon", "Jais", "+40 more"].map((m) => (
            <span key={m} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-400 backdrop-blur-sm">
              {m}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => router.push(user ? "/dashboard" : "/login")}
            className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-2xl shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-950 sm:w-auto"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            {user ? "Open Dashboard" : "Get Started"}
            <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          
          <a
            href="https://docs.newapi.pro" target="_blank" rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 px-8 py-3.5 text-sm font-medium text-gray-400 transition-all hover:border-white/20 hover:text-gray-200 sm:w-auto"
          >
            Documentation
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Footer */}
        <div className="mt-16 flex items-center justify-center gap-6 text-xs text-gray-600">
          <span>&copy; 2026 NeuralBay</span>
          <span className="h-3 w-px bg-gray-800" />
          <span>AGPL-3.0</span>
        </div>
      </div>
    </div>
  )
}
