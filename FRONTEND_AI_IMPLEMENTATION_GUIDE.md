# Frontend Implementation Guide - AI Features (Part 2)

## Overview
This guide provides step-by-step instructions for implementing the missing frontend UI components for the AI-powered features. All backend APIs are fully functional and ready to be integrated.

---

## 📋 Table of Contents
1. [API Client Setup](#1-api-client-setup)
2. [Career Roadmap Viewer](#2-career-roadmap-viewer)
3. [CareerBot Chat Interface](#3-careerbot-chat-interface)
4. [CV/Profile Assistant](#4-cvprofile-assistant)
5. [Skill Extraction Enhancement](#5-skill-extraction-enhancement)
6. [Testing Checklist](#testing-checklist)

---

## 1. API Client Setup

### Add AI API functions to `frontend/src/lib/api.ts`

```typescript
// AI APIs
export const aiApi = {
  // Extract skills from CV text
  extractSkills: async (cvText: string, provider: 'gemini' | 'groq' = 'gemini', updateProfile: boolean = true): Promise<any> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/ai/extract-skills`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        cv_text: cvText,
        provider,
        update_profile: updateProfile
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to extract skills');
    }

    return await response.json();
  },

  // Generate career roadmap
  generateRoadmap: async (techStack: string, includeCurrentSkills: boolean = true, provider: 'gemini' | 'groq' = 'gemini'): Promise<any> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/ai/roadmap`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        tech_stack: techStack,
        include_current_skills: includeCurrentSkills,
        provider
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate roadmap');
    }

    return await response.json();
  },

  // Get all saved roadmaps
  getRoadmaps: async (): Promise<any> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/ai/roadmaps`, {
      headers: getHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch roadmaps');
    }

    return await response.json();
  },

  // Get specific roadmap by ID
  getRoadmapById: async (id: number): Promise<any> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/ai/roadmaps/${id}`, {
      headers: getHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch roadmap');
    }

    return await response.json();
  },

  // Delete roadmap
  deleteRoadmap: async (id: number): Promise<any> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/ai/roadmaps/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete roadmap');
    }

    return await response.json();
  },

  // Ask career mentor a question
  askMentor: async (question: string, provider: 'gemini' | 'groq' = 'gemini'): Promise<any> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/ai/ask-mentor`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        question,
        provider
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get answer');
    }

    return await response.json();
  },

  // Generate professional summary
  generateSummary: async (provider: 'gemini' | 'groq' = 'gemini'): Promise<any> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/ai/generate-summary`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ provider }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate summary');
    }

    return await response.json();
  },

  // Improve project descriptions
  improveProjects: async (projects: string[], provider: 'gemini' | 'groq' = 'gemini'): Promise<any> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/ai/improve-projects`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        projects,
        provider
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to improve projects');
    }

    return await response.json();
  },

  // Get profile improvement suggestions
  getProfileSuggestions: async (platform: string = 'linkedin', provider: 'gemini' | 'groq' = 'gemini'): Promise<any> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/ai/profile-suggestions`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        platform,
        provider
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get suggestions');
    }

    return await response.json();
  },
};
```

---

## 2. Career Roadmap Viewer

### Create `frontend/src/app/roadmap/page.tsx`

```tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { aiApi } from "@/lib/api"
import { toast } from "sonner"
import { 
  Sparkles, 
  Download, 
  Trash2, 
  Plus, 
  Clock, 
  BookOpen, 
  Target,
  ChevronRight 
} from "lucide-react"

export default function RoadmapPage() {
  const router = useRouter()
  const [roadmaps, setRoadmaps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [techStack, setTechStack] = useState("")
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null)

  useEffect(() => {
    loadRoadmaps()
  }, [])

  const loadRoadmaps = async () => {
    try {
      const data = await aiApi.getRoadmaps()
      setRoadmaps(data.roadmaps || [])
    } catch (err: any) {
      if (err.message.includes('Session expired')) {
        router.push('/login')
      } else {
        toast.error('Failed to load roadmaps')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!techStack.trim()) {
      toast.error('Please enter a tech stack or role')
      return
    }

    setGenerating(true)
    try {
      const result = await aiApi.generateRoadmap(techStack, true, 'gemini')
      toast.success('Roadmap generated successfully!')
      setTechStack("")
      await loadRoadmaps()
      
      // Auto-select the new roadmap
      if (result.roadmap_id) {
        const newRoadmap = await aiApi.getRoadmapById(result.roadmap_id)
        setSelectedRoadmap(newRoadmap.roadmap)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate roadmap')
    } finally {
      setGenerating(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await aiApi.deleteRoadmap(id)
      toast.success('Roadmap deleted')
      setRoadmaps(roadmaps.filter(r => r.id !== id))
      if (selectedRoadmap?.id === id) {
        setSelectedRoadmap(null)
      }
    } catch (err: any) {
      toast.error('Failed to delete roadmap')
    }
  }

  const handleDownload = (roadmap: any) => {
    // Create downloadable text format
    let content = `${roadmap.title}\n`
    content += `Target Role: ${roadmap.target_role}\n`
    content += `Generated: ${new Date(roadmap.created_at).toLocaleDateString()}\n`
    content += `\n${'='.repeat(50)}\n\n`

    const data = roadmap.roadmap
    if (data.phases) {
      data.phases.forEach((phase: any, idx: number) => {
        content += `Phase ${idx + 1}: ${phase.title}\n`
        content += `Duration: ${phase.duration}\n`
        content += `\nTopics:\n`
        phase.topics.forEach((topic: string) => {
          content += `  • ${topic}\n`
        })
        if (phase.resources) {
          content += `\nResources:\n`
          phase.resources.forEach((resource: string) => {
            content += `  • ${resource}\n`
          })
        }
        content += `\n${'-'.repeat(50)}\n\n`
      })
    }

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `roadmap-${roadmap.target_role.toLowerCase().replace(/\s+/g, '-')}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Roadmap downloaded!')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            AI Career Roadmaps
          </h1>
          <p className="text-muted-foreground">
            Generate personalized learning paths to achieve your career goals
          </p>
        </div>

        {/* Generate New Roadmap */}
        <Card className="mb-8 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Generate New Roadmap
            </CardTitle>
            <CardDescription>
              Enter your target role or tech stack (e.g., "Full Stack Developer", "DevOps Engineer")
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="e.g., Full Stack Web Development"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                className="flex-1"
                disabled={generating}
              />
              <Button 
                onClick={handleGenerate}
                disabled={generating || !techStack.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Roadmap List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Your Roadmaps ({roadmaps.length})</h2>
            <div className="space-y-3">
              {loading ? (
                <div className="text-muted-foreground">Loading...</div>
              ) : roadmaps.length === 0 ? (
                <Card className="p-6 text-center border-dashed">
                  <p className="text-muted-foreground">No roadmaps yet. Generate your first one!</p>
                </Card>
              ) : (
                roadmaps.map((roadmap) => (
                  <Card 
                    key={roadmap.id}
                    className={`cursor-pointer transition-all hover:border-purple-500/50 ${
                      selectedRoadmap?.id === roadmap.id ? 'border-purple-500 bg-purple-500/5' : ''
                    }`}
                    onClick={() => setSelectedRoadmap(roadmap)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{roadmap.title}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {new Date(roadmap.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(roadmap.id)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Roadmap Details */}
          <div className="lg:col-span-2">
            {selectedRoadmap ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{selectedRoadmap.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {selectedRoadmap.target_role}
                        </span>
                        <Badge variant="outline">{selectedRoadmap.ai_provider}</Badge>
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleDownload(selectedRoadmap)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedRoadmap.roadmap?.phases ? (
                    <div className="space-y-6">
                      {selectedRoadmap.roadmap.phases.map((phase: any, idx: number) => (
                        <div key={idx} className="border-l-2 border-purple-500 pl-6 pb-6 relative">
                          <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold">
                            {idx + 1}
                          </div>
                          
                          <h3 className="text-xl font-semibold mb-2">{phase.title}</h3>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <Clock className="w-4 h-4" />
                            {phase.duration}
                          </div>

                          <div className="mb-4">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <BookOpen className="w-4 h-4" />
                              Topics to Learn
                            </h4>
                            <ul className="space-y-1">
                              {phase.topics?.map((topic: string, tIdx: number) => (
                                <li key={tIdx} className="flex items-start gap-2 text-sm">
                                  <ChevronRight className="w-4 h-4 mt-0.5 text-purple-400 flex-shrink-0" />
                                  <span>{topic}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {phase.resources && phase.resources.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Resources</h4>
                              <div className="flex flex-wrap gap-2">
                                {phase.resources.map((resource: string, rIdx: number) => (
                                  <Badge key={rIdx} variant="secondary">
                                    {resource}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No roadmap data available</p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center p-12 border-dashed">
                <div className="text-center text-muted-foreground">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a roadmap to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
```

---

## 3. CareerBot Chat Interface

### Create `frontend/src/app/mentor/page.tsx`

```tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { aiApi } from "@/lib/api"
import { toast } from "sonner"
import { Bot, Send, Lightbulb, User } from "lucide-react"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function MentorPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI Career Mentor. Ask me anything about career development, skill building, job search strategies, or transitioning to new roles. How can I help you today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const suggestedQuestions = [
    "What should I learn to become a backend developer?",
    "How can I transition from frontend to full stack?",
    "What skills are most in demand right now?",
    "How do I prepare for technical interviews?",
    "What certifications should I pursue?",
  ]

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const result = await aiApi.askMentor(input, 'gemini')
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.answer?.answer || result.answer || 'I apologize, but I could not generate a response.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err: any) {
      if (err.message.includes('Session expired')) {
        router.push('/login')
      } else {
        toast.error('Failed to get response')
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Bot className="w-8 h-8 text-blue-400" />
            AI Career Mentor
          </h1>
          <p className="text-muted-foreground">
            Get personalized career advice powered by AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
          {/* Chat Area */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="flex-1 flex flex-col">
              <CardContent className="flex-1 flex flex-col p-4">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                            : 'glass-effect border border-white/10'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs mt-2 opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>

                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {loading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="glass-effect border border-white/10 rounded-lg p-4">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask me about your career..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    disabled={loading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suggested Questions Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  Suggested Questions
                </CardTitle>
                <CardDescription>Click to ask</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedQuestions.map((question, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="w-full text-left justify-start h-auto py-3 px-3 whitespace-normal"
                    onClick={() => handleSuggestedQuestion(question)}
                    disabled={loading}
                  >
                    <span className="text-sm">{question}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
```

---

## 4. CV/Profile Assistant

### Create `frontend/src/components/ProfileAssistant.tsx`

```tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { aiApi } from "@/lib/api"
import { toast } from "sonner"
import { Sparkles, Copy, Check, FileText, Lightbulb } from "lucide-react"

export function ProfileAssistant() {
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [copiedSummary, setCopiedSummary] = useState(false)

  const handleGenerateSummary = async () => {
    setLoading(true)
    try {
      const result = await aiApi.generateSummary('gemini')
      const summaryText = result.summary?.content || result.summary
      setSummary(summaryText)
      toast.success('Summary generated!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate summary')
    } finally {
      setLoading(false)
    }
  }

  const handleGetSuggestions = async () => {
    setLoading(true)
    try {
      const result = await aiApi.getProfileSuggestions('linkedin', 'gemini')
      setSuggestions(result.suggestions?.suggestions || result.suggestions || [])
      toast.success('Suggestions loaded!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to get suggestions')
    } finally {
      setLoading(false)
    }
  }

  const copySummary = () => {
    navigator.clipboard.writeText(summary)
    setCopiedSummary(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedSummary(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Professional Summary Generator */}
      <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Professional Summary Generator
          </CardTitle>
          <CardDescription>
            Generate a compelling professional summary for your CV or LinkedIn profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGenerateSummary}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Summary
              </>
            )}
          </Button>

          {summary && (
            <div className="space-y-2">
              <div className="relative">
                <Textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="min-h-[120px] pr-12"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={copySummary}
                >
                  {copiedSummary ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                You can edit the summary above before using it
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Improvement Suggestions */}
      <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            LinkedIn Profile Suggestions
          </CardTitle>
          <CardDescription>
            Get personalized tips to improve your professional profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGetSuggestions}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Loading...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Get Suggestions
              </>
            )}
          </Button>

          {suggestions.length > 0 && (
            <div className="space-y-3">
              {suggestions.map((suggestion: any, idx: number) => (
                <div
                  key={idx}
                  className="glass-effect rounded-lg p-4 border border-white/10"
                >
                  <Badge variant="outline" className="mb-2">
                    {suggestion.category}
                  </Badge>
                  <p className="text-sm text-foreground">{suggestion.suggestion}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

### Add to Profile Page

Update `frontend/src/app/profile/page.tsx` to include the ProfileAssistant component:

```tsx
import { ProfileAssistant } from "@/components/ProfileAssistant"

// Add this in the profile page layout, perhaps as a new section:
<motion.div className="rounded-xl p-6 border border-gray-200 dark:border-white/20 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/30 shadow-sm dark:shadow-md">
  <h2 className="text-xl font-semibold text-foreground mb-6">
    AI Profile Assistant
  </h2>
  <ProfileAssistant />
</motion.div>
```

---

## 5. Skill Extraction Enhancement

### Update `frontend/src/components/CVUpload.tsx`

Add skill extraction after successful upload:

```tsx
// After successful CV upload in the handleUpload function:
const handleUpload = async () => {
  if (!file) return
  
  setUploading(true)
  setMessage(null)
  
  try {
    const result = await profileApi.uploadCV(file)
    
    // Extract skills automatically
    try {
      const extractResult = await aiApi.extractSkills(
        result.extracted_text || '', 
        'gemini', 
        true
      )
      
      setMessage({ 
        type: 'success', 
        text: `CV uploaded successfully! Extracted ${extractResult.extracted_data.technical_skills?.length || 0} skills.` 
      })
    } catch (extractError) {
      setMessage({ 
        type: 'success', 
        text: `CV uploaded successfully! Extracted ${result.extracted_length} characters.` 
      })
    }
    
    setFile(null)
    const fileInput = document.getElementById('cv-file-input') as HTMLInputElement
    if (fileInput) fileInput.value = ''
    
    onUploadSuccess?.()
  } catch (error: any) {
    const errorMessage = error.message || 'Upload failed. Please try again.'
    setMessage({ 
      type: 'error', 
      text: errorMessage
    })
  } finally {
    setUploading(false)
  }
}
```

---

## 6. Add Missing UI Components

### Create `frontend/src/components/ui/textarea.tsx` (if not exists)

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
```

---

## 7. Update Navigation

### Add links to new pages in `frontend/src/components/Navbar.tsx`

```tsx
// Add to navigation items:
<Link href="/roadmap" className="nav-link">
  AI Roadmap
</Link>
<Link href="/mentor" className="nav-link">
  Career Mentor
</Link>
```

---

## Testing Checklist

### Before submitting, test all features:

- [ ] **Roadmap Page**
  - [ ] Can generate new roadmap
  - [ ] Roadmaps are saved and displayed
  - [ ] Can view roadmap details
  - [ ] Can delete roadmaps
  - [ ] Download functionality works
  - [ ] Responsive design works

- [ ] **Mentor Chat**
  - [ ] Can send messages
  - [ ] Receives AI responses
  - [ ] Suggested questions work
  - [ ] Chat scrolls properly
  - [ ] Loading states work

- [ ] **Profile Assistant**
  - [ ] Generate summary works
  - [ ] Can copy summary
  - [ ] Get suggestions works
  - [ ] Suggestions display properly

- [ ] **CV Upload Enhancement**
  - [ ] Automatic skill extraction
  - [ ] Skills added to profile
  - [ ] Error handling works

- [ ] **Integration**
  - [ ] All API calls use proper auth
  - [ ] Error messages are user-friendly
  - [ ] Session expiry redirects to login
  - [ ] Toast notifications work

---

## API Endpoints Reference

| Feature | Endpoint | Method | Request Body |
|---------|----------|--------|--------------|
| Extract Skills | `/api/ai/extract-skills` | POST | `{ cv_text, provider, update_profile }` |
| Generate Roadmap | `/api/ai/roadmap` | POST | `{ tech_stack, include_current_skills, provider }` |
| Get Roadmaps | `/api/ai/roadmaps` | GET | - |
| Get Roadmap by ID | `/api/ai/roadmaps/{id}` | GET | - |
| Delete Roadmap | `/api/ai/roadmaps/{id}` | DELETE | - |
| Ask Mentor | `/api/ai/ask-mentor` | POST | `{ question, provider }` |
| Generate Summary | `/api/ai/generate-summary` | POST | `{ provider }` |
| Improve Projects | `/api/ai/improve-projects` | POST | `{ projects, provider }` |
| Profile Suggestions | `/api/ai/profile-suggestions` | POST | `{ platform, provider }` |

---

## Environment Setup

Ensure backend is running with:
```bash
# In backend directory
cargo run
```

Backend should be available at: `http://127.0.0.1:3000`

Frontend API base URL should be configured in `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3000/api
```

---

## Questions or Issues?

If you encounter any issues:
1. Check browser console for errors
2. Verify API responses in Network tab
3. Check backend logs for API errors
4. Ensure authentication token is valid
5. Test endpoints directly using `backend/api_tests_part2.http`

All backend APIs are fully tested and working. Focus on frontend implementation and UX polish!
