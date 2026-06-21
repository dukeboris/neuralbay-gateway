"use client"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Requests", value: "1.2M", change: "+12%", color: "indigo" },
          { label: "Tokens Used", value: "45.8B", change: "+8%", color: "emerald" },
          { label: "Active Keys", value: "24", change: "+3", color: "amber" },
          { label: "Monthly Spend", value: "$1,234", change: "+15%", color: "rose" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <span className={`text-sm font-medium text-${stat.color}-600`}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity & Model Usage */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          <div className="mt-4 space-y-4">
            {[
              { action: "Chat Completion", model: "gpt-4o", tokens: "1,234", time: "2m ago" },
              { action: "Image Generation", model: "dall-e-3", tokens: "4,000", time: "15m ago" },
              { action: "Embedding", model: "text-embedding-3", tokens: "892", time: "1h ago" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.model}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">{activity.tokens}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Model Usage</h3>
          <div className="mt-4 space-y-3">
            {[
              { model: "GPT-4o", usage: 45, color: "bg-indigo-500" },
              { model: "Claude 3.5 Sonnet", usage: 25, color: "bg-amber-500" },
              { model: "Gemini 2.0 Flash", usage: 15, color: "bg-emerald-500" },
              { model: "DeepSeek V3", usage: 10, color: "bg-rose-500" },
              { model: "Others", usage: 5, color: "bg-gray-400" },
            ].map((model) => (
              <div key={model.model}>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{model.model}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{model.usage}%</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className={`h-2 rounded-full ${model.color}`} style={{ width: `${model.usage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
