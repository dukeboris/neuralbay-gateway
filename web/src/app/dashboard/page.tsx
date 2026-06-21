"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { getTokens, getUserLogs } from "@/lib/api"
import type { UsageLog, ApiKey } from "@/lib/types"

function formatTokens(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B"
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K"
  return String(n)
}

function formatCost(quota: number): string {
  // quota 通常以 1/100 美分或 token 为单位，这里做个粗略显示
  const usd = quota / 500000
  if (usd >= 1) return "$" + usd.toFixed(2)
  return "$" + usd.toFixed(4)
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts * 1000
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return mins + "m ago"
  const hours = Math.floor(mins / 60)
  if (hours < 24) return hours + "h ago"
  return Math.floor(hours / 24) + "d ago"
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [logs, setLogs] = useState<UsageLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getTokens({ page_size: 100 }),
      getUserLogs({ page_size: 5 }),
    ])
      .then(([tk, lg]) => {
        setKeys(tk.items)
        setLogs(lg.items)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!user) return null

  const quotaPercent = user.quota > 0
    ? Math.round((user.used_quota / user.quota) * 100)
    : 0

  const stats = [
    { label: "Total Requests", value: String(user.request_count), change: "", color: "indigo" },
    { label: "Quota Used", value: formatTokens(user.used_quota), change: quotaPercent + "%", color: "emerald" },
    { label: "Active Keys", value: String(keys.filter(k => k.status === 1).length), change: "", color: "amber" },
    { label: "Total Quota", value: formatTokens(user.quota), change: "", color: "rose" },
  ]

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          Loading dashboard data...
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              {stat.change && (
                <span className={`text-sm font-medium text-${stat.color}-600`}>{stat.change}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          {logs.length === 0 ? (
            <p className="mt-4 text-sm text-gray-400">暂无使用记录</p>
          ) : (
            <div className="mt-4 space-y-4">
              {logs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{log.model_name || "Unknown"}</p>
                    <p className="text-xs text-gray-500">{log.token_name}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium text-gray-900 dark:text-white">{formatTokens(log.quota)}</p>
                    <p className="text-xs text-gray-500">{timeAgo(log.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quota Usage */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quota Usage</h3>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700 dark:text-gray-300">
                Used: {formatTokens(user.used_quota)} / {formatTokens(user.quota)}
              </span>
              <span className="font-medium text-gray-900 dark:text-white">{quotaPercent}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className={`h-3 rounded-full transition-all ${
                  quotaPercent > 90 ? "bg-red-500" : quotaPercent > 70 ? "bg-amber-500" : "bg-indigo-500"
                }`}
                style={{ width: `${Math.min(quotaPercent, 100)}%` }}
              />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">User Group</span>
              <span className="font-medium text-gray-900 dark:text-white">{user.group}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">API Keys</span>
              <span className="font-medium text-gray-900 dark:text-white">{keys.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Role</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {user.role >= 3 ? "Root" : user.role >= 2 ? "Admin" : "User"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
