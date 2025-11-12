"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import OnboardingFlow from "@/components/OnboardingFlow"

export default function OnboardingPage() {
  const router = useRouter()
  const [isCompleting, setIsCompleting] = useState(false)

  const handleComplete = async (data: { education: string; experience: string; track: string }) => {
    setIsCompleting(true)
    
    // Simulate saving onboarding data
    setTimeout(() => {
      setIsCompleting(false)
      // Store the data (in a real app, this would be sent to the backend)
      localStorage.setItem("onboardingData", JSON.stringify(data))
      router.push("/dashboard")
    }, 1000)
  }

  return <OnboardingFlow onComplete={handleComplete} />
}

