import { JetBrains_Mono } from "next/font/google"
import "./globals.css"

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={jetbrains.className}>
        {children}
      </body>
    </html>
  )
}