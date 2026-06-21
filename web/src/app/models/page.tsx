"use client"

const modelGroups = [
  {
    provider: "OpenAI",
    models: [
      { name: "GPT-4o", context: "128K", cost: "$2.50/$10.00", speed: "Fast" },
      { name: "GPT-4o-mini", context: "128K", cost: "$0.15/$0.60", speed: "Fast" },
      { name: "GPT-4-turbo", context: "128K", cost: "$10.00/$30.00", speed: "Medium" },
      { name: "GPT-3.5-turbo", context: "16K", cost: "$0.50/$1.50", speed: "Fast" },
    ],
  },
  {
    provider: "Anthropic",
    models: [
      { name: "Claude 3.5 Sonnet", context: "200K", cost: "$3.00/$15.00", speed: "Fast" },
      { name: "Claude 3 Haiku", context: "200K", cost: "$0.25/$1.25", speed: "Fast" },
      { name: "Claude 3 Opus", context: "200K", cost: "$15.00/$75.00", speed: "Medium" },
    ],
  },
  {
    provider: "Google",
    models: [
      { name: "Gemini 2.0 Flash", context: "1M", cost: "$0.10/$0.40", speed: "Fast" },
      { name: "Gemini 2.0 Pro", context: "2M", cost: "$2.00/$10.00", speed: "Fast" },
      { name: "Gemini 1.5 Pro", context: "2M", cost: "$1.25/$5.00", speed: "Medium" },
    ],
  },
]

export default function ModelsPage() {
  return (
    <div className="space-y-8">
      {modelGroups.map((group) => (
        <div key={group.provider}>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{group.provider}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.models.map((model) => (
              <div key={model.name} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-950">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{model.name}</h4>
                  <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                    {model.speed}
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Context</span>
                    <span className="font-medium text-gray-900 dark:text-white">{model.context}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost (in/out)</span>
                    <span className="font-medium text-gray-900 dark:text-white">{model.cost}</span>
                  </div>
                </div>
                <button className="mt-4 w-full rounded-lg border border-gray-200 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
