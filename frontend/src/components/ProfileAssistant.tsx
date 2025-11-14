"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { aiApi } from "@/lib/api"
import { toast } from "sonner"
import { Sparkles, Copy, Check, FileText, Lightbulb, Target, PlusCircle, X, Linkedin } from "lucide-react"

export function ProfileAssistant() {
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState("")
  const [copiedSummary, setCopiedSummary] = useState(false)

  // Project improvement state
  const [projects, setProjects] = useState<string[]>([])
  const [newProject, setNewProject] = useState("")
  const [improvedProjects, setImprovedProjects] = useState<string[]>([])
  const [improvingProjects, setImprovingProjects] = useState(false)
  const [copiedProject, setCopiedProject] = useState<number | null>(null)

  // Profile suggestions state
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [platform, setPlatform] = useState<'linkedin' | 'portfolio'>('linkedin')

  const handleGenerateSummary = async () => {
    setLoading(true)
    try {
      const result = await aiApi.generateSummary('gemini')
      const summaryText = result.summary?.content || result.summary || result.response
      setSummary(summaryText)
      toast.success('Summary generated!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate summary')
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

  const addProject = () => {
    if (newProject.trim() && projects.length < 10) {
      setProjects([...projects, newProject.trim()])
      setNewProject("")
    }
  }

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index))
    if (improvedProjects.length > 0) {
      setImprovedProjects(improvedProjects.filter((_, i) => i !== index))
    }
  }

  const handleImproveProjects = async () => {
    if (projects.length === 0) {
      toast.error('Please add at least one project')
      return
    }

    setImprovingProjects(true)
    try {
      const result = await aiApi.improveProjects(projects, 'gemini')
      
      // Extract improved projects from response
      let improved = []
      if (result.improved_projects?.content) {
        // Parse JSON from content
        try {
          const parsed = JSON.parse(result.improved_projects.content)
          improved = Array.isArray(parsed) ? parsed : []
        } catch {
          improved = [result.improved_projects.content]
        }
      } else if (Array.isArray(result.improved_projects)) {
        improved = result.improved_projects
      } else if (result.improved_projects) {
        improved = [result.improved_projects]
      }

      setImprovedProjects(improved)
      toast.success('Projects improved!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to improve projects')
    } finally {
      setImprovingProjects(false)
    }
  }

  const copyProject = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedProject(index)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedProject(null), 2000)
  }

  const handleGetSuggestions = async () => {
    setLoadingSuggestions(true)
    try {
      const result = await aiApi.getProfileSuggestions(platform, 'gemini')
      
      // Parse suggestions from response
      let parsedSuggestions = []
      if (result.suggestions?.content) {
        try {
          const parsed = JSON.parse(result.suggestions.content)
          parsedSuggestions = Array.isArray(parsed) ? parsed : [parsed]
        } catch {
          // If not JSON, treat as text
          parsedSuggestions = [{ category: 'General', suggestion: result.suggestions.content }]
        }
      } else if (Array.isArray(result.suggestions)) {
        parsedSuggestions = result.suggestions
      }

      setSuggestions(parsedSuggestions)
      toast.success('Suggestions generated!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to get suggestions')
    } finally {
      setLoadingSuggestions(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-3 glass-effect">
          <TabsTrigger value="summary">
            <FileText className="w-4 h-4 mr-2" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="projects">
            <Target className="w-4 h-4 mr-2" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="suggestions">
            <Lightbulb className="w-4 h-4 mr-2" />
            Suggestions
          </TabsTrigger>
        </TabsList>

        {/* Professional Summary */}
        <TabsContent value="summary" className="mt-4">
          <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-purple-500/5 glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Professional Summary Generator
              </CardTitle>
              <CardDescription>
                Generate a compelling professional summary for your CV or LinkedIn profile based on your skills and experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleGenerateSummary}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
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
                      className="min-h-[120px] pr-12 glass-effect border-white/10"
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
        </TabsContent>

        {/* Project Bullet Points */}
        <TabsContent value="projects" className="mt-4">
          <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5 glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Project Description Enhancer
              </CardTitle>
              <CardDescription>
                Transform basic project descriptions into impactful bullet points with action verbs and measurable achievements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Projects */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addProject()}
                    placeholder="e.g., Built a todo app with React"
                    className="glass-effect border-white/10"
                  />
                  <Button
                    onClick={addProject}
                    disabled={!newProject.trim() || projects.length >= 10}
                    variant="outline"
                    className="border-purple-500/30"
                  >
                    <PlusCircle className="w-4 h-4" />
                  </Button>
                </div>

                {projects.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Your Projects:</p>
                    {projects.map((project, idx) => (
                      <div key={idx} className="glass-effect rounded-lg p-3 border border-white/10 flex items-start justify-between gap-2">
                        <p className="text-sm flex-1">{project}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeProject(idx)}
                        >
                          <X className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={handleImproveProjects}
                disabled={improvingProjects || projects.length === 0}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
              >
                {improvingProjects ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Improving...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Improve Projects
                  </>
                )}
              </Button>

              {/* Improved Projects */}
              {improvedProjects.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <p className="text-sm font-medium text-green-400">✓ Improved Descriptions:</p>
                  {improvedProjects.map((improved, idx) => (
                    <div key={idx} className="glass-effect rounded-lg p-3 border border-green-500/30 bg-green-500/5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm flex-1">{improved}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyProject(improved, idx)}
                        >
                          {copiedProject === idx ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Suggestions */}
        <TabsContent value="suggestions" className="mt-4">
          <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-orange-400" />
                Profile Improvement Suggestions
              </CardTitle>
              <CardDescription>
                Get personalized recommendations to enhance your LinkedIn or portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={platform === 'linkedin' ? 'default' : 'outline'}
                  onClick={() => setPlatform('linkedin')}
                  className={platform === 'linkedin' ? 'bg-blue-600 hover:bg-blue-700' : 'border-white/10'}
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
                <Button
                  variant={platform === 'portfolio' ? 'default' : 'outline'}
                  onClick={() => setPlatform('portfolio')}
                  className={platform === 'portfolio' ? 'bg-purple-600 hover:bg-purple-700' : 'border-white/10'}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Portfolio
                </Button>
              </div>

              <Button
                onClick={handleGetSuggestions}
                disabled={loadingSuggestions}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white"
              >
                {loadingSuggestions ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get {platform === 'linkedin' ? 'LinkedIn' : 'Portfolio'} Tips
                  </>
                )}
              </Button>

              {suggestions.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <p className="text-sm font-medium text-orange-400">💡 Personalized Suggestions:</p>
                  {suggestions.map((suggestion, idx) => (
                    <div key={idx} className="glass-effect rounded-lg p-4 border border-orange-500/30 bg-orange-500/5 space-y-2">
                      {suggestion.category && (
                        <Badge variant="outline" className="border-orange-500/30 bg-orange-500/10">
                          {suggestion.category}
                        </Badge>
                      )}
                      <p className="text-sm leading-relaxed">
                        {suggestion.suggestion || suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

