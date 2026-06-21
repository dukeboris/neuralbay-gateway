"use client"

import { useEffect, useState } from "react"
import { getSelf } from "@/lib/api"
import type { UserInfo } from "@/lib/types"

function formatTokens(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B"
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K"
  return String(n)
}

export default function BillingPage() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    getSelf()
      .then(setUser)
      .catch((err) => setError(err instanceof Error ? err.message : "加载失败"))
      .finally(() => setLoading(false))
  }, [])

  const quotaPercent = user && user.quota > 0
    ? Math.round((user.used_quota / user.quota) * 100)
    : 0

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          Loading billing info...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      ) : user ? (
        <>
          {/* Current Plan */}
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-white p-6 dark:border-gray-800 dark:from-indigo-950/30 dark:to-gray-950">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Account Overview</p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {user.group === "default" ? "Standard" : user.group}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {formatTokens(user.quota)} total quota · {formatTokens(user.used_quota)} used
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Quota Usage</span>
                <span className="font-medium text-gray-900 dark:text-white">{quotaPercent}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-white/50 dark:bg-gray-800">
                <div
                  className={`h-3 rounded-full ${
                    quotaPercent > 90 ? "bg-red-500" : "bg-indigo-500"
                  }`}
                  style={{ width: `${Math.min(quotaPercent, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Details</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                <p className="text-xs text-gray-500">Username</p>
                <p className="mt-1 font-medium text-gray-900 dark:text-white">{user.username}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                <p className="text-xs text-gray-500">Email</p>
                <p className="mt-1 font-medium text-gray-900 dark:text-white">{user.email || "-"}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                <p className="text-xs text-gray-500">Request Count</p>
                <p className="mt-1 font-medium text-gray-900 dark:text-white">{user.request_count.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                <p className="text-xs text-gray-500">Affiliate Code</p>
                <p className="mt-1 font-medium font-mono text-gray-900 dark:text-white">{user.aff_code || "-"}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                <p className="text-xs text-gray-500">Invited By</p>
                <p className="mt-1 font-medium text-gray-900 dark:text-white">{user.inviter_id ? `User #${user.inviter_id}` : "-"}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                <p className="text-xs text-gray-500">Affiliate Earnings</p>
                <p className="mt-1 font-medium text-gray-900 dark:text-white">{formatTokens(user.aff_quota)}</p>
              </div>
            </div>
          </div>

          {/* Top Up */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Up</h3>
            <p className="mt-1 text-sm text-gray-500">Contact admin for top-up or subscription options.</p>
            <div className="mt-4 flex gap-3">
              <button disabled className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-400 dark:border-gray-700">
                Stripe (Coming Soon)
              </button>
              <button disabled className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-400 dark:border-gray-700">
                Crypto (Coming Soon)
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
