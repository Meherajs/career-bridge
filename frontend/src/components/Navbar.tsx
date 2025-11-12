"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Moon, Sun, Briefcase, BookOpen, User, LayoutDashboard, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
    { href: "/resources", label: "Resources", icon: BookOpen },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient hidden sm:block">
              CareerBridge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-white/5 transition-all duration-200 flex items-center space-x-2 group"
                >
                  <Icon className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-400" />
              )}
            </Button>

            <Button
              asChild
              variant="ghost"
              className="hidden md:flex items-center space-x-2 rounded-lg hover:bg-white/5 text-red-400 hover:text-red-300"
            >
              <Link href="/login">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Link>
            </Button>

            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-lg hover:bg-white/5"
                >
                  {isOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-effect border-l border-white/10 w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-foreground/80 hover:text-foreground hover:bg-white/5 transition-all duration-200 group"
                      >
                        <Icon className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    )
                  })}
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-white/5 transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}