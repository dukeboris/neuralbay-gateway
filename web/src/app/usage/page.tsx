"use client"

import { useEffect, useState } from "react"
import { getSelf, getUserLogs } from "@/lib/api"
import type { UsageLog, UserInfo } from "@/lib/types"

function formatTokens(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B"
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K"
  return String(n)
}

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString("zh-CN")
}

export default function UsagePage() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [logs, setLogs] = useState<UsageLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([getSelf(), getUserLogs({ page_size: 50 })])
      .then(([u, l]) => {
        setUser(u)
        setLogs(l.items)
      })
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
          Loading usage data...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      ) : (
        <>
          {/* Usage header */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Quota Usage</p>
                <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                  {formatTokens(user!.used_quota)}
                </p>
                <p className="text-sm text-gray-500">
                  used of {formatTokens(user!.quota)} limit
                </p>
              </div>
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-indigo-200 dark:border-indigo-800">
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{quotaPercent}%</span>
              </div>
            </div>
            <div className="mt-4 h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className={`h-3 rounded-full transition-all ${
                  quotaPercent > 90 ? "bg-red-500" : quotaPercent > 70 ? "bg-amber-500" : "bg-indigo-500"
                }`}
                style={{ width: `${Math.min(quotaPercent, 100)}%` }}
              />
            </div>
          </div>

          {/* Usage logs */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Usage Logs</h3>
            {logs.length === 0 ? (
              <p className="mt-4 text-sm text-gray-400">暂无使用记录</p>
            ) : (
              <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">{formatDate(log.created_at)}</span>
                      <span className="font-mono text-sm text-gray-900 dark:text-white">{log.model_name || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-sm text-gray-500">{formatTokens(log.quota)} tokens</span>
                      <span className="text-sm text-gray-400">{log.token_name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
