"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GraduationCap, Briefcase, Target, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface OnboardingFlowProps {
  onComplete: (data: { education: string; experience: string; track: string }) => void
}

const steps = [
  {
    id: "education",
    title: "What's your education level?",
    description: "This helps us recommend the right opportunities for you",
    icon: GraduationCap,
    options: [
      { value: "high-school", label: "High School" },
      { value: "bachelors", label: "Bachelor's Degree" },
      { value: "masters", label: "Master's Degree" },
      { value: "phd", label: "PhD" },
    ],
  },
  {
    id: "experience",
    title: "What's your experience level?",
    description: "Tell us about your professional experience",
    icon: Briefcase,
    options: [
      { value: "fresher", label: "Fresher (0-1 years)" },
      { value: "junior", label: "Junior (1-3 years)" },
      { value: "mid", label: "Mid-level (3-5 years)" },
      { value: "senior", label: "Senior (5+ years)" },
    ],
  },
  {
    id: "track",
    title: "What's your preferred career track?",
    description: "Select the field you want to pursue",
    icon: Target,
    options: [
      { value: "software-dev", label: "Software Development" },
      { value: "data-science", label: "Data Science" },
      { value: "design", label: "UI/UX Design" },
      { value: "marketing", label: "Digital Marketing" },
      { value: "business", label: "Business Analysis" },
    ],
  },
]

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({
    education: "",
    experience: "",
    track: "",
  })

  const step = steps[currentStep]
  const Icon = step.icon
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(answers)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSelect = (value: string) => {
    setAnswers(prev => ({ ...prev, [step.id]: value }))
  }

  const isCurrentStepComplete = answers[step.id as keyof typeof answers] !== ""

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-white/20 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/30 shadow-lg"
          >
            {/* Icon and Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 mb-4 shadow-lg">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                {step.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {step.description}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {step.options.map((option) => {
                const isSelected = answers[step.id as keyof typeof answers] === option.value
                return (
                  <motion.button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-950/40 shadow-md"
                        : "border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800/50 hover:border-purple-300 dark:hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/20"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${isSelected ? "text-purple-600 dark:text-purple-400" : "text-foreground"}`}>
                        {option.label}
                      </span>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                disabled={!isCurrentStepComplete}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-purple-500/50 transition-all duration-300 group"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    Complete Setup
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

