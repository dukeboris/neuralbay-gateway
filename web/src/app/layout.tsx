import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth"

export const metadata: Metadata = {
  title: "NeuralBay - AI Gateway Management",
  description: "Unified AI model hub for aggregation & distribution",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
