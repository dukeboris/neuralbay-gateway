"use client"

export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "danger" | "info"
}) {
  const colors = {
    default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  }

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[variant]}`}>
      {children}
    </span>
  )
}

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent ${className}`} />
  )
}
