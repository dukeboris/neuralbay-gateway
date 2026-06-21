"use client"

import { useEffect, useState, useRef } from "react"

interface DashboardStats {
  total_requests: number
  tokens_used: number
  active_keys: number
  timestamp: number
  status: string
}

export function useDashboardSSE() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [connected, setConnected] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE || ""
    const url = `${base}/api/dashboard/sse`

    const es = new EventSource(url, { withCredentials: true })
    eventSourceRef.current = es

    es.onopen = () => setConnected(true)

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as DashboardStats
        setStats(data)
      } catch {
        // Ignore parse errors
      }
    }

    es.onerror = () => {
      setConnected(false)
    }

    return () => {
      es.close()
      eventSourceRef.current = null
    }
  }, [])

  return { stats, connected }
}
