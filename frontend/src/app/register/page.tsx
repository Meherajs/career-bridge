"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, User, GraduationCap, Briefcase, Target, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    education: "",
    experience: "",
    track: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate registration
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-12 items-start justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="relative z-10 max-w-lg text-white mt-16">
          <div className="space-y-4 animate-float mb-8">
            <div className="inline-flex items-center space-x-2 glass-effect px-4 py-2 rounded-full border border-white/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Start Your Journey</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight">
              Join<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                CareerBridge
              </span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Create your account and unlock personalized career recommendations tailored to your skills and aspirations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-effect p-4 rounded-xl border border-white/20">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5" />
                <h3 className="font-semibold">Personalized Roadmaps</h3>
              </div>
              <p className="text-white/70 text-sm">AI-generated career paths</p>
            </div>
            <div className="glass-effect p-4 rounded-xl border border-white/20">
              <div className="flex items-center space-x-2 mb-2">
                <Briefcase className="w-5 h-5" />
                <h3 className="font-semibold">Curated Opportunities</h3>
              </div>
              <p className="text-white/70 text-sm">Jobs matched to your profile</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center">
            <h1 className="text-3xl font-bold text-gradient">CareerBridge</h1>
            <p className="text-muted-foreground mt-2">AI-Powered Career Platform</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
              <p className="text-muted-foreground">
                Fill in your details to get started
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    className="pl-10 glass-effect border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="pl-10 glass-effect border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    className="pl-10 glass-effect border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education" className="text-foreground">Education Level</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                  <Select value={formData.education} onValueChange={(value) => updateFormData("education", value)}>
                    <SelectTrigger className="pl-10 glass-effect border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-12">
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent className="glass-effect border-white/10">
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="text-foreground">Experience Level</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                  <Select value={formData.experience} onValueChange={(value) => updateFormData("experience", value)}>
                    <SelectTrigger className="pl-10 glass-effect border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-12">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent className="glass-effect border-white/10">
                      <SelectItem value="fresher">Fresher (0-1 years)</SelectItem>
                      <SelectItem value="junior">Junior (1-3 years)</SelectItem>
                      <SelectItem value="mid">Mid-level (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior (5+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="track" className="text-foreground">Preferred Career Track</Label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                  <Select value={formData.track} onValueChange={(value) => updateFormData("track", value)}>
                    <SelectTrigger className="pl-10 glass-effect border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-12">
                      <SelectValue placeholder="Select career track" />
                    </SelectTrigger>
                    <SelectContent className="glass-effect border-white/10">
                      <SelectItem value="software-dev">Software Development</SelectItem>
                      <SelectItem value="data-science">Data Science</SelectItem>
                      <SelectItem value="design">UI/UX Design</SelectItem>
                      <SelectItem value="marketing">Digital Marketing</SelectItem>
                      <SelectItem value="business">Business Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-purple-500/50 transition-all duration-300 group"
              >
                {isLoading ? (
                  "Creating account..."
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-muted-foreground bg-background">OR</span>
              </div>
            </div>

            {/* Google Sign Up Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-lg glass-effect border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 group"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-medium">Sign up with Google</span>
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
