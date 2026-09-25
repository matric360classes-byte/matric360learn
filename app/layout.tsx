import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import BottomNav from "@/components/BottomNav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Matric360 Learn",
  description: "CAPS Matric Learning",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{background:"#0a0d1a", margin:0}}>
        <div style={{paddingBottom:90}}>
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  )
}
