"use client"

import { useEffect, useState, useCallback } from "react"
import { getTokens, createToken, deleteToken } from "@/lib/api"
import type { ApiKey } from "@/lib/types"

function formatTime(ts: number): string {
  if (ts <= 0) return "-"
  return new Date(ts * 1000).toLocaleDateString("zh-CN")
}

export default function KeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [creating, setCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyQuota, setNewKeyQuota] = useState("")
  const [newKeyUnlimited, setNewKeyUnlimited] = useState(false)
  const [showNewKey, setShowNewKey] = useState<string | null>(null)

  const fetchKeys = useCallback(async () => {
    try {
      setError("")
      const data = await getTokens({ page_size: 100 })
      setKeys(data.items)
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchKeys() }, [fetchKeys])

  const handleCreate = async () => {
    if (!newKeyName.trim()) return
    setCreating(true)
    try {
      const key = await createToken({
        name: newKeyName,
        remain_quota: newKeyUnlimited ? undefined : (Number(newKeyQuota) || 0),
        unlimited_quota: newKeyUnlimited,
      })
      setShowNewKey(key.key)
      setNewKeyName("")
      setNewKeyQuota("")
      setNewKeyUnlimited(false)
      await fetchKeys()
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建失败")
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("确认删除此 Key？")) return
    try {
      await deleteToken(id)
      setKeys(keys.filter(k => k.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败")
    }
  }

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    alert("Key 已复制到剪贴板")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your API keys for accessing the gateway.</p>
        <button
          onClick={() => document.getElementById("create-form")?.classList.toggle("hidden")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          + Create Key
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      )}

      {showNewKey && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/50">
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">New API Key created — copy it now, it won{"'"}t be shown again!</p>
          <div className="mt-2 flex items-center gap-2">
            <code className="rounded bg-white px-3 py-1.5 font-mono text-sm dark:bg-gray-900">{showNewKey}</code>
            <button onClick={() => copyKey(showNewKey)} className="rounded bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white">Copy</button>
          </div>
          <button onClick={() => setShowNewKey(null)} className="mt-2 text-xs text-emerald-600 underline">Dismiss</button>
        </div>
      )}

      <div id="create-form" className="hidden rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Key</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Key name"
            value={newKeyName}
            onChange={e => setNewKeyName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <div className="flex items-center gap-4">
            {!newKeyUnlimited && (
              <input
                type="number"
                placeholder="Quota limit"
                value={newKeyQuota}
                onChange={e => setNewKeyQuota(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            )}
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input type="checkbox" checked={newKeyUnlimited} onChange={e => setNewKeyUnlimited(e.target.checked)} />
              Unlimited
            </label>
          </div>
          <button
            onClick={handleCreate}
            disabled={creating || !newKeyName.trim()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          Loading keys...
        </div>
      ) : keys.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-950">
          <p className="text-gray-400">No API keys yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {["Name", "Created", "Quota", "Used", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
              {keys.map((k) => (
                <tr key={k.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{k.name}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{formatTime(k.created_time)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {k.unlimited_quota ? "∞" : k.remain_quota.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{k.used_quota.toLocaleString()}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      k.status === 1
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}>
                      {k.status === 1 ? "active" : "disabled"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(k.id)}
                      className="text-red-600 hover:text-red-500 dark:text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
