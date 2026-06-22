"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { useI18n } from "@/i18n"

const navItems = [
  { href: "/dashboard", labelKey: "nav.dashboard", icon: "📊" },
  { href: "/keys", labelKey: "nav.keys", icon: "🔑" },
  { href: "/models", labelKey: "nav.models", icon: "🤖" },
  { href: "/usage", labelKey: "nav.usage", icon: "📈" },
  { href: "/billing", labelKey: "nav.billing", icon: "💳" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, logout, isAdmin } = useAuth()
  const { t, locale, setLocale } = useI18n()
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
          <p className="text-sm text-gray-500">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const handleLogout = async () => {
    await logout()
    router.replace("/login")
  }

  const langBtn = (code: "en" | "zh" | "ar", label: string) => (
    <button
      key={code}
      onClick={() => setLocale(code)}
      className={`rounded px-2 py-1 text-xs font-medium ${
        locale === code
          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
          : "text-gray-400 hover:text-gray-600"
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="flex h-screen">
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
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {sidebarOpen && <span>{t(item.labelKey)}</span>}
                </Link>
              )
            })}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800">
            {sidebarOpen && (
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-1">
                  {langBtn("en", "EN")}
                  {langBtn("zh", "中文")}
                  {langBtn("ar", "العربية")}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
                    {user.display_name?.[0] || user.username?.[0] || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {user.display_name || user.username}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {isAdmin ? t("dashboard.roleAdmin") : t("dashboard.roleUser")}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="rounded p-1 text-gray-400 hover:text-red-500"
                    title={t("auth.logout")}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t(navItems.find((n) => n.href === pathname)?.labelKey ?? "dashboard.title")}
          </h2>
          <div className="flex items-center gap-4">
            <a
              href="/api"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              {t("nav.apiDocs")}
            </a>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
