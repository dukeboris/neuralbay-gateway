"use client"

import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from "react"
import en from "./en.json"
import zh from "./zh.json"

type Locale = "en" | "zh"
type TranslationMap = Record<string, Record<string, string>>

const translations: Record<Locale, TranslationMap> = { en, zh }

function t(key: string, locale: Locale): string {
  const parts = key.split(".")
  let current: unknown = translations[locale]
  for (const part of parts) {
    if (typeof current !== "object" || current === null) return key
    current = (current as Record<string, unknown>)[part]
  }
  return typeof current === "string" ? current : key
}

interface I18nContextType {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null
    if (saved === "en" || saved === "zh") setLocaleState(saved)
  }, [])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem("locale", l)
  }, [])

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: (key) => t(key, locale) }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}
