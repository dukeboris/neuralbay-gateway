"use client"

import { useEffect, useState } from "react"
import { getModels } from "@/lib/api"
import type { ModelInfo } from "@/lib/types"

// Provider logo / color mapping
const providerMeta: Record<string, { name: string; color: string; badge: string }> = {
  openai: { name: "OpenAI", color: "bg-emerald-500", badge: "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" },
  claude: { name: "Anthropic", color: "bg-amber-500", badge: "text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400" },
  gemini: { name: "Google", color: "bg-blue-500", badge: "text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" },
  deepseek: { name: "DeepSeek", color: "bg-violet-500", badge: "text-violet-700 bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400" },
  zhipu: { name: "Zhipu", color: "bg-rose-500", badge: "text-rose-700 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400" },
  moonshot: { name: "Moonshot", color: "bg-cyan-500", badge: "text-cyan-700 bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-400" },
  ollama: { name: "Ollama", color: "bg-gray-500", badge: "text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-400" },
  xai: { name: "xAI", color: "bg-sky-500", badge: "text-sky-700 bg-sky-100 dark:bg-sky-900/30 dark:text-sky-400" },
  cohere: { name: "Cohere", color: "bg-teal-500", badge: "text-teal-700 bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400" },
  mistral: { name: "Mistral", color: "bg-orange-500", badge: "text-orange-700 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400" },
  siliconflow: { name: "SiliconFlow", color: "bg-purple-500", badge: "text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400" },
  minimax: { name: "MiniMax", color: "bg-pink-500", badge: "text-pink-700 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400" },
  perplexity: { name: "Perplexity", color: "bg-indigo-500", badge: "text-indigo-700 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400" },
  ali: { name: "Alibaba", color: "bg-red-500", badge: "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400" },
  baidu: { name: "Baidu", color: "bg-blue-500", badge: "text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" },
  tencent: { name: "Tencent", color: "bg-green-500", badge: "text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400" },
}

function getProviderName(key: string): string {
  return providerMeta[key]?.name ?? key
}

function getProviderBadge(key: string): string {
  return (
    providerMeta[key]?.badge ??
    "text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
  )
}

export default function ModelsPage() {
  const [models, setModels] = useState<Record<string, ModelInfo[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    getModels()
      .then(setModels)
      .catch((err) => setError(err instanceof Error ? err.message : "加载失败"))
      .finally(() => setLoading(false))
  }, [])

  const groups = Object.entries(models).filter(([, list]) => list.length > 0)
  const filteredGroups = search
    ? groups
        .map(([key, list]) => [
          key,
          list.filter((m) => m.id.toLowerCase().includes(search.toLowerCase())),
        ] as const)
        .filter(([, list]) => list.length > 0)
    : groups

  const totalModels = groups.reduce((sum, [, list]) => sum + list.length, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {totalModels} models available via {groups.length} providers.
        </p>
        <input
          type="text"
          placeholder="Search models..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          Loading models...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-950">
          <p className="text-gray-400">{search ? "No models match your search." : "No models configured yet."}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredGroups.map(([channelKey, modelList]) => (
            <div key={channelKey}>
              <div className="mb-3 flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getProviderName(channelKey)}
                </h3>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getProviderBadge(channelKey)}`}>
                  {modelList.length} models
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {modelList.map((model) => (
                  <div
                    key={model.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-mono text-sm font-semibold text-gray-900 dark:text-white truncate" title={model.id}>
                        {model.id}
                      </h4>
                    </div>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Owner</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{model.owned_by}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ID</span>
                        <span className="font-mono text-gray-400 truncate max-w-[140px]">{model.id}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
