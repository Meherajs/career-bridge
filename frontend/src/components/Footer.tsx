"use client"

import Link from "next/link"
import { Briefcase, Phone, Linkedin, Instagram, Twitter, Facebook, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-white/10 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-background">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Left Section - Logo, Contact, and Social */}
          <div className="lg:col-span-2 space-y-5">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">CareerBridge</span>
            </div>

            {/* Contact Number */}
            <div className="flex items-center">
              <a 
                href="tel:+8801602427158" 
                className="flex items-center space-x-2 text-muted-foreground hover:text-blue-500 dark:hover:text-blue-400 transition-colors group"
              >
                <Phone className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-base font-medium">+880 1602 427158</span>
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-3">
              <Link 
                href="#" 
                className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
              </Link>
              <Link 
                href="#" 
                className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-gray-600 dark:text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400 transition-colors" />
              </Link>
              <Link 
                href="#" 
                className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-gray-600 dark:text-muted-foreground hover:text-blue-500 dark:hover:text-blue-400 transition-colors" />
              </Link>
              <Link 
                href="#" 
                className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors" />
              </Link>
              <Link 
                href="#" 
                className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5 text-gray-600 dark:text-muted-foreground hover:text-red-600 dark:hover:text-red-500 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-bold text-base mb-3 text-gradient">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  Legal
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore Column */}
          <div>
            <h3 className="font-bold text-base mb-3 text-gradient">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/jobs" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  Job Opportunities
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  Learning Resources
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  Career Paths
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  Skill Assessment
                </Link>
              </li>
            </ul>
          </div>

          {/* Learning Column */}
          <div>
            <h3 className="font-bold text-base mb-3 text-gradient">Learning</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  Programming
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  Data Science
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  AI & Machine Learning
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-bold text-base mb-3 text-gradient">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  Interview Questions
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  Coding Challenges
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  Career Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  Salary Insights
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-gray-200 dark:border-white/10 bg-gray-100/50 dark:bg-gray-900/50 py-3 px-4">
        <div className="container mx-auto">
          <p className="text-sm text-muted-foreground text-center">
            @CareerBridge, Empowering youth employment and skill development, All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

