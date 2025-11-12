"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Sync with current theme state
    const htmlElement = document.documentElement
    const isCurrentlyDark = htmlElement.classList.contains("dark")
    setIsDark(isCurrentlyDark)
  }, [])

  const toggleTheme = () => {
    const htmlElement = document.documentElement
    const newTheme = !isDark
    
    setIsDark(newTheme)
    
    if (newTheme) {
      htmlElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      htmlElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-lg hover:bg-white/5 transition-all duration-200"
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="w-5 h-5 text-yellow-400" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-lg hover:bg-white/5 transition-all duration-200"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-blue-400" />
      )}
    </Button>
  )
}

