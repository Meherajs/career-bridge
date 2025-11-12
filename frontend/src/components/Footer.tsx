"use client"

import Link from "next/link"
import { Briefcase, Phone, Linkedin, Instagram, Twitter, Facebook, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Left Section - Logo and Address */}
          <div className="lg:col-span-2 space-y-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">CareerBridge</span>
            </div>

            {/* Contact Number */}
            <div>
              <a 
                href="tel:+8801602427158" 
                className="flex items-center space-x-2 text-muted-foreground hover:text-blue-400 transition-colors group"
              >
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-base font-medium">+880 1602 427158</span>
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-3">
              <Link 
                href="#" 
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-muted-foreground hover:text-blue-400" />
              </Link>
              <Link 
                href="#" 
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-muted-foreground hover:text-pink-400" />
              </Link>
              <Link 
                href="#" 
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 text-muted-foreground hover:text-blue-400" />
              </Link>
              <Link 
                href="#" 
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-muted-foreground hover:text-blue-500" />
              </Link>
              <Link 
                href="#" 
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4 text-muted-foreground hover:text-red-500" />
              </Link>
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Link 
                href="#" 
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-muted-foreground leading-tight">GET IT ON</div>
                  <div className="text-xs font-semibold text-white">Google Play</div>
                </div>
              </Link>
              <Link 
                href="#" 
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-muted-foreground leading-tight">Download on the</div>
                  <div className="text-xs font-semibold text-white">App Store</div>
                </div>
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
      <div className="border-t border-white/10 py-3 px-4">
        <div className="container mx-auto">
          <p className="text-sm text-muted-foreground text-center">
            @CareerBridge, Empowering youth employment and skill development, All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

