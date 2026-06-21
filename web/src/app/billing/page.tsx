"use client"

export default function BillingPage() {
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-white p-6 dark:border-gray-800 dark:from-indigo-950/30 dark:to-gray-950">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Plan</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">Pro Plan</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">$49 / month · 5,000M tokens included</p>
          </div>
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
            Upgrade
          </button>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Methods</h3>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <svg className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Visa ending in 4242</p>
              <p className="text-xs text-gray-500">Expires 12/28</p>
            </div>
          </div>
          <button className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            + Add Card
          </button>
          <button className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            + Crypto (USDT)
          </button>
        </div>
      </div>

      {/* Invoices */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Invoices</h3>
        <div className="mt-4 space-y-3">
          {[
            { date: "Jun 1, 2026", amount: "$49.00", status: "paid" },
            { date: "May 1, 2026", amount: "$49.00", status: "paid" },
            { date: "Apr 1, 2026", amount: "$29.00", status: "paid" },
          ].map((inv) => (
            <div key={inv.date} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
              <span className="text-sm text-gray-700 dark:text-gray-300">{inv.date}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{inv.amount}</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {inv.status}
                </span>
                <button className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Download</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
