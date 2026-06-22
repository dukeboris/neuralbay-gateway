"use client"

import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from "react"
import en from "./en.json"
import zh from "./zh.json"
import ar from "./ar.json"
import id from "./id.json"
import th from "./th.json"
import vi from "./vi.json"

type Locale = "en" | "zh" | "ar" | "id" | "th" | "vi"
type TranslationMap = Record<string, Record<string, string>>

const translations: Record<Locale, TranslationMap> = { en, zh, ar, id, th, vi }

// RTL locales
const rtlLocales: Locale[] = ["ar"]

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
  isRTL: boolean
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null
    if (saved === "en" || saved === "zh" || saved === "ar" || saved === "id" || saved === "th" || saved === "vi") setLocaleState(saved)
  }, [])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem("locale", l)

    // Handle RTL direction
    const isRTL = rtlLocales.includes(l)
    document.documentElement.dir = isRTL ? "rtl" : "ltr"
    document.documentElement.lang = l
  }, [])

  // Set initial dir
  useEffect(() => {
    const isRTL = rtlLocales.includes(locale)
    document.documentElement.dir = isRTL ? "rtl" : "ltr"
    document.documentElement.lang = locale
  }, [locale])

  const isRTL = rtlLocales.includes(locale)

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: (key) => t(key, locale), isRTL }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}
