"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mounted = useRef(true)

  const fetchData = useCallback(() => {
    setLoading(true)
    setError(null)
    fetcher()
      .then((result) => {
        if (mounted.current) setData(result)
      })
      .catch((err) => {
        if (mounted.current) setError(err instanceof Error ? err.message : "请求失败")
      })
      .finally(() => {
        if (mounted.current) setLoading(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    mounted.current = true
    fetchData()
    return () => { mounted.current = false }
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
