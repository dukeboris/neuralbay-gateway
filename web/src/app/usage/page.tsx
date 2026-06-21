"use client"

export default function UsagePage() {
  return (
    <div className="space-y-6">
      {/* Usage header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">This Month&apos;s Usage</p>
            <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">1,234,567,890</p>
            <p className="text-sm text-gray-500">tokens used of 5,000,000,000 limit</p>
          </div>
          <div className="h-20 w-20 rounded-full border-4 border-indigo-200 dark:border-indigo-800">
            <div className="flex h-full items-center justify-center">
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">24%</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800">
          <div className="h-3 w-1/4 rounded-full bg-indigo-500" />
        </div>
      </div>

      {/* Daily breakdown */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Usage Logs</h3>
        <div className="mt-4 space-y-3">
          {[
            { date: "2026-06-21", model: "gpt-4o", tokens: "45,321", cost: "$0.11" },
            { date: "2026-06-21", model: "claude-3.5-sonnet", tokens: "12,450", cost: "$0.04" },
            { date: "2026-06-20", model: "gpt-4o-mini", tokens: "89,234", cost: "$0.05" },
            { date: "2026-06-20", model: "gemini-2.0-flash", tokens: "34,567", cost: "$0.01" },
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{log.date}</span>
                <span className="font-mono text-sm text-gray-900 dark:text-white">{log.model}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm text-gray-500">{log.tokens} tokens</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{log.cost}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
