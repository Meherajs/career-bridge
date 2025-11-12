"use client"

import { useEffect } from "react"

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize theme from localStorage or default to dark
    const storedTheme = localStorage.getItem("theme")
    const htmlElement = document.documentElement
    
    if (storedTheme === "light") {
      htmlElement.classList.remove("dark")
    } else {
      // Default to dark if no preference is stored
      htmlElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
  }, [])

  return <>{children}</>
}

