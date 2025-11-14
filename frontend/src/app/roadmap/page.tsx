"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  ChevronRight,
  CheckCircle2,
  Circle,
  Edit,
  Code,
  Briefcase,
} from "lucide-react"

// Lazy load Footer
const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="h-32" />,
});

export default function RoadmapPage() {
  const router = useRouter()
  const [roadmaps, setRoadmaps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null)
  
  // Generation form state
  const [targetRole, setTargetRole] = useState("")
  const [timeframeMonths, setTimeframeMonths] = useState(6)
  const [learningHours, setLearningHours] = useState(10)
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)

  // Progress tracking state
  const [editingProgress, setEditingProgress] = useState(false)
  const [progressNotes, setProgressNotes] = useState("")
  const [tempCompletedPhases, setTempCompletedPhases] = useState<number[]>([])
  const [tempProgress, setTempProgress] = useState(0)

  useEffect(() => {
    loadRoadmaps()
  }, [])

  useEffect(() => {
    if (selectedRoadmap) {
      setProgressNotes(selectedRoadmap.notes || "")
      setTempCompletedPhases(selectedRoadmap.completed_phases || [])
      setTempProgress(selectedRoadmap.progress_percentage || 0)
    }
  }, [selectedRoadmap])

  const loadRoadmaps = async () => {
    try {
      const data = await aiApi.getRoadmaps()
      setRoadmaps(data.roadmaps || [])
      if (data.roadmaps && data.roadmaps.length > 0 && !selectedRoadmap) {
        setSelectedRoadmap(data.roadmaps[0])
      }
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
    if (!targetRole.trim()) {
      toast.error('Please enter a target role')
      return
    }

    setGenerating(true)
    try {
      const result = await aiApi.generateRoadmap(
        targetRole, 
        timeframeMonths, 
        learningHours, 
        true, 
        'gemini'
      )
      toast.success('Roadmap generated successfully!')
      setTargetRole("")
      setShowGenerateDialog(false)
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
    if (!confirm('Are you sure you want to delete this roadmap?')) return
    
    try {
      await aiApi.deleteRoadmap(id)
      toast.success('Roadmap deleted')
      setRoadmaps(roadmaps.filter(r => r.id !== id))
      if (selectedRoadmap?.id === id) {
        setSelectedRoadmap(roadmaps.find(r => r.id !== id) || null)
      }
    } catch (err: any) {
      toast.error('Failed to delete roadmap')
    }
  }

  const togglePhaseComplete = (phaseNum: number) => {
    if (tempCompletedPhases.includes(phaseNum)) {
      setTempCompletedPhases(tempCompletedPhases.filter(p => p !== phaseNum))
    } else {
      setTempCompletedPhases([...tempCompletedPhases, phaseNum])
    }
  }

  const handleSaveProgress = async () => {
    if (!selectedRoadmap) return

    try {
      await aiApi.updateRoadmapProgress(
        selectedRoadmap.id,
        tempProgress,
        tempCompletedPhases,
        progressNotes
      )
      toast.success('Progress updated!')
      setEditingProgress(false)
      await loadRoadmaps()
      
      // Update selected roadmap
      const updated = await aiApi.getRoadmapById(selectedRoadmap.id)
      setSelectedRoadmap(updated.roadmap)
    } catch (err: any) {
      toast.error('Failed to update progress')
    }
  }

  const handleDownloadText = (roadmap: any) => {
    let content = `${roadmap.title}\n`
    content += `${'='.repeat(60)}\n\n`
    content += `Target Role: ${roadmap.target_role}\n`
    content += `Timeframe: ${roadmap.timeframe_months} months\n`
    content += `Learning Hours: ${roadmap.learning_hours_per_week} hours/week\n`
    content += `Progress: ${roadmap.progress_percentage}%\n`
    content += `Generated: ${new Date(roadmap.created_at).toLocaleDateString()}\n\n`

    const data = roadmap.roadmap_data || roadmap.roadmap
    if (data?.phases) {
      data.phases.forEach((phase: any, idx: number) => {
        content += `\nPHASE ${idx + 1}: ${phase.title}\n`
        content += `${'-'.repeat(60)}\n`
        if (phase.timeline) content += `Timeline: ${phase.timeline}\n`
        content += `Duration: ${phase.duration}\n\n`

        content += `Topics:\n`
        phase.topics.forEach((topic: string) => {
          content += `  • ${topic}\n`
        })

        if (phase.learning_goals && phase.learning_goals.length > 0) {
          content += `\nLearning Goals:\n`
          phase.learning_goals.forEach((goal: string) => {
            content += `  • ${goal}\n`
          })
        }

        if (phase.resources && phase.resources.length > 0) {
          content += `\nResources:\n`
          phase.resources.forEach((resource: string) => {
            content += `  • ${resource}\n`
          })
        }
        content += `\n`
      })

      if (roadmap.project_suggestions && roadmap.project_suggestions.length > 0) {
        content += `\n\nPROJECT IDEAS\n`
        content += `${'='.repeat(60)}\n\n`
        roadmap.project_suggestions.forEach((project: any) => {
          content += `${project.title}\n`
          content += `  ${project.description}\n`
          content += `  Difficulty: ${project.difficulty} | Est. Time: ${project.estimated_hours}h\n`
          content += `  Technologies: ${project.technologies.join(', ')}\n\n`
        })
      }

      if (roadmap.job_application_timing) {
        content += `\n\nWHEN TO APPLY FOR JOBS\n`
        content += `${'='.repeat(60)}\n`
        content += `${roadmap.job_application_timing}\n`
      }
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
          <h1 className="text-4xl font-bold text-gradient mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            AI Career Roadmaps
          </h1>
          <p className="text-muted-foreground">
            Generate personalized learning paths with projects and job application timing
          </p>
        </div>

        {/* Generate Button */}
        <div className="mb-8">
          <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
            <DialogTrigger asChild>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Generate New Roadmap
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Personalized Roadmap</DialogTitle>
                <DialogDescription>
                  Tell us about your goals and we'll create a customized learning path
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Target Role *</Label>
                  <Input
                    id="role"
                    placeholder="e.g., Full Stack Developer, Data Analyst"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeframe">
                    Timeframe: {timeframeMonths} {timeframeMonths === 1 ? 'month' : 'months'}
                  </Label>
                  <Slider
                    id="timeframe"
                    min={3}
                    max={12}
                    step={1}
                    value={[timeframeMonths]}
                    onValueChange={([value]) => setTimeframeMonths(value)}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    How long do you want to spend learning?
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hours">
                    Learning Time: {learningHours} hours/week
                  </Label>
                  <Slider
                    id="hours"
                    min={5}
                    max={40}
                    step={5}
                    value={[learningHours]}
                    onValueChange={([value]) => setLearningHours(value)}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    How many hours per week can you dedicate to learning?
                  </p>
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={generating || !targetRole.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                  {generating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Roadmap
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Roadmap List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              Your Roadmaps ({roadmaps.length})
            </h2>
            <div className="space-y-3">
              {loading ? (
                <div className="text-muted-foreground">Loading...</div>
              ) : roadmaps.length === 0 ? (
                <Card className="p-6 text-center border-dashed glass-effect">
                  <p className="text-muted-foreground">
                    No roadmaps yet. Generate your first one!
                  </p>
                </Card>
              ) : (
                roadmaps.map((roadmap) => (
                  <Card 
                    key={roadmap.id}
                    className={`cursor-pointer transition-all hover:border-purple-500/50 glass-effect ${
                      selectedRoadmap?.id === roadmap.id 
                        ? 'border-purple-500 bg-purple-500/5' 
                        : 'border-white/10'
                    }`}
                    onClick={() => setSelectedRoadmap(roadmap)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">
                            {roadmap.title}
                          </CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {new Date(roadmap.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:text-red-500 flex-shrink-0"
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
              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl">
                        {selectedRoadmap.title}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {selectedRoadmap.target_role}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {selectedRoadmap.timeframe_months} months
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {selectedRoadmap.learning_hours_per_week}h/week
                        </span>
                        <Badge variant="outline" className="border-purple-500/30">
                          {selectedRoadmap.ai_provider}
                        </Badge>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleDownloadText(selectedRoadmap)}
                        className="border-white/10 hover:bg-white/5"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const roadmapData = selectedRoadmap.roadmap_data || selectedRoadmap.roadmap
                    return roadmapData?.phases ? (
                      <div className="space-y-8">
                        {/* Phases */}
                        <div className="space-y-6">
                          {roadmapData.phases.map((phase: any, idx: number) => {
                            const isCompleted = (selectedRoadmap.completed_phases || []).includes(phase.phase)
                            
                            return (
                              <div 
                                key={idx} 
                                className={`border-l-2 pl-6 pb-6 relative ${
                                  isCompleted ? 'border-green-500' : 'border-purple-500'
                                }`}
                              >
                                <div 
                                  className={`absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer transition-all ${
                                    isCompleted 
                                      ? 'bg-gradient-to-br from-green-500 to-green-600' 
                                      : 'bg-gradient-to-br from-purple-500 to-pink-600'
                                  }`}
                                >
                                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                </div>
                                
                                <div className="flex items-start justify-between">
                                  <h3 className={`text-xl font-semibold mb-2 ${
                                    isCompleted ? 'text-green-400' : 'text-foreground'
                                  }`}>
                                    {phase.title}
                                  </h3>
                                  {isCompleted && (
                                    <Badge variant="outline" className="border-green-500/30 text-green-400">
                                      Completed
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                                  {phase.timeline && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {phase.timeline}
                                    </span>
                                  )}
                                  {phase.duration && (
                                    <span>Duration: {phase.duration}</span>
                                  )}
                                </div>

                                {phase.technologies && phase.technologies.length > 0 && (
                                  <div className="mb-4">
                                    <h4 className="font-medium mb-2 flex items-center gap-2 text-foreground">
                                      <Code className="w-4 h-4" />
                                      Technologies
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {phase.technologies.map((tech: string, tIdx: number) => (
                                        <Badge key={tIdx} variant="secondary">
                                          {tech}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {phase.topics && phase.topics.length > 0 && (
                                  <div className="mb-4">
                                    <h4 className="font-medium mb-2 flex items-center gap-2 text-foreground">
                                      <BookOpen className="w-4 h-4" />
                                      Topics to Learn
                                    </h4>
                                    <ul className="space-y-1">
                                      {phase.topics.map((topic: string, tIdx: number) => (
                                        <li key={tIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                          <ChevronRight className="w-4 h-4 mt-0.5 text-purple-400 flex-shrink-0" />
                                          <span>{topic}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {phase.learning_goals && phase.learning_goals.length > 0 && (
                                  <div className="mb-4">
                                    <h4 className="font-medium mb-2 flex items-center gap-2 text-foreground">
                                      <Target className="w-4 h-4" />
                                      Learning Goals
                                    </h4>
                                    <ul className="space-y-1">
                                      {phase.learning_goals.map((goal: string, gIdx: number) => (
                                        <li key={gIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                          <Circle className="w-3 h-3 mt-1 text-pink-400 flex-shrink-0" />
                                          <span>{goal}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {phase.resources && phase.resources.length > 0 && (
                                  <div>
                                    <h4 className="font-medium mb-2 text-foreground">Resources</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {phase.resources.map((resource: string, rIdx: number) => (
                                        <a 
                                          key={rIdx} 
                                          href={`https://www.google.com/search?q=${encodeURIComponent(resource)}`} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                        >
                                          <Badge variant="outline" className="border-purple-500/30 hover:bg-purple-500/10 cursor-pointer">
                                            {resource}
                                          </Badge>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>

                        {/* Project Suggestions */}
                        {selectedRoadmap.project_suggestions && selectedRoadmap.project_suggestions.length > 0 && (
                          <div className="mt-8">
                            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                              <Code className="w-6 h-6 text-purple-400" />
                              Project Ideas
                            </h3>
                            <div className="grid gap-4">
                              {selectedRoadmap.project_suggestions.map((project: any, idx: number) => (
                                <Card key={idx} className="glass-effect border-white/10">
                                  <CardHeader>
                                    <CardTitle className="text-lg flex items-center justify-between">
                                      {project.title}
                                      <Badge variant="outline" className="ml-2">
                                        Phase {project.recommended_phase}
                                      </Badge>
                                    </CardTitle>
                                    <CardDescription>{project.description}</CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-2">
                                      <div className="flex flex-wrap gap-2">
                                        {project.technologies.map((tech: string, tIdx: number) => (
                                          <Badge key={tIdx} variant="secondary">
                                            {tech}
                                          </Badge>
                                        ))}
                                      </div>
                                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>Difficulty: {project.difficulty}</span>
                                        <span>Est. Time: {project.estimated_hours}h</span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Job Application Timing */}
                        {selectedRoadmap.job_application_timing && (
                          <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                              <Briefcase className="w-5 h-5 text-green-400" />
                              When to Start Applying
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {selectedRoadmap.job_application_timing}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No roadmap data available</p>
                    )
                  })()}
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center p-12 border-dashed glass-effect">
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

