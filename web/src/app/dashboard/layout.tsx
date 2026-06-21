"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/keys", label: "API Keys", icon: "🔑" },
  { href: "/models", label: "Models", icon: "🤖" },
  { href: "/usage", label: "Usage", icon: "📈" },
  { href: "/billing", label: "Billing", icon: "💳" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, logout, isAdmin } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const handleLogout = async () => {
    await logout()
    router.replace("/login")
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} border-r border-gray-200 bg-white transition-all dark:border-gray-800 dark:bg-gray-950`}>
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
          {sidebarOpen && (
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              NeuralBay
            </span>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col justify-between" style={{ height: "calc(100vh - 64px)" }}>
          <div className="space-y-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </div>
          {sidebarOpen && (
            <div className="border-t border-gray-200 p-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
                  {user.display_name?.[0] || user.username?.[0] || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {user.display_name || user.username}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {isAdmin ? "Admin" : "User"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded p-1 text-gray-400 hover:text-red-500"
                  title="退出登录"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {navItems.find((n) => n.href === pathname)?.label || "Dashboard"}
          </h2>
          <div className="flex items-center gap-4">
            <a
              href="/api"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              API Docs
            </a>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
