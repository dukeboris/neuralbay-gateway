"use client"

import { useState } from "react"

export default function KeysPage() {
  const [keys] = useState([
    { name: "Production", key: "sk-prod-xxxxxxxxxxxxxxxx", created: "2026-06-01", usage: "45.2M tokens", status: "active" },
    { name: "Development", key: "sk-dev-xxxxxxxxxxxxxxxx", created: "2026-06-15", usage: "2.1M tokens", status: "active" },
    { name: "Staging", key: "sk-staging-xxxxxxxxxxxxxx", created: "2026-06-10", usage: "0.5M tokens", status: "inactive" },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your API keys for accessing the gateway.</p>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
          + Create Key
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {["Name", "API Key", "Created", "Usage", "Status", "Actions"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
            {keys.map((k) => (
              <tr key={k.name} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{k.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-500">{k.key.slice(0, 20)}...</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{k.created}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{k.usage}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    k.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}>
                    {k.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <button className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Edit</button>
                  <button className="ml-3 text-red-600 hover:text-red-500 dark:text-red-400">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
