"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

export default function WelcomePage() {
  const router = useRouter()
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      <div className="w-full max-w-lg text-center">
        {/* Logo */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-500/30">
          <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          NeuralBay
        </h1>
        <p className="mt-3 text-lg font-medium text-indigo-600 dark:text-indigo-400">
          AI Gateway
        </p>
        <p className="mt-4 text-base leading-relaxed text-gray-500 dark:text-gray-400">
          Unified AI model hub for aggregation & distribution.
          <br />
          One API, all models — OpenAI, Claude, Gemini, and more.
        </p>

        {/* Features */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: "⚡", title: "Unified API", desc: "OpenAI-compatible endpoint for 50+ models" },
            { icon: "🌍", title: "Global Routing", desc: "Low-latency across Middle East & SEA" },
            { icon: "🛡️", title: "Enterprise Ready", desc: "Rate limiting, quotas, analytics" },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-gray-200 bg-white/70 p-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/70">
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{f.title}</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => router.push(user ? "/dashboard" : "/login")}
            className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            {user ? "Dashboard" : "Sign In"}
          </button>
          <a
            href="/api/status"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-8 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 sm:w-auto"
          >
            API Status
          </a>
        </div>

        <p className="mt-8 text-xs text-gray-400 dark:text-gray-600">
          &copy; 2026 NeuralBay &middot; Based on New API (AGPL-3.0)
        </p>
      </div>
    </div>
  )
}
