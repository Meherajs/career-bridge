"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { User, Mail, GraduationCap, Briefcase, Target, X, Plus, Save, FileText } from "lucide-react"

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    education: "bachelors",
    experience: "fresher",
    track: "software-dev",
  })
  
  const [skills, setSkills] = useState([
    "React",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "Node.js",
    "Git",
  ])
  
  const [newSkill, setNewSkill] = useState("")
  const [cvText, setCvText] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const handleSave = () => {
    setIsSaving(true)
    // Simulate save
    setTimeout(() => {
      setIsSaving(false)
      alert("Profile updated successfully!")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and career preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="glass-effect rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Personal Information
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    className="glass-effect border-white/10 focus:border-blue-500 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="pl-10 glass-effect border-white/10 focus:border-blue-500 h-12"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Career Information */}
            <div className="glass-effect rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Career Information
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="education" className="text-foreground">Education Level</Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                    <Select value={formData.education} onValueChange={(value) => updateFormData("education", value)}>
                      <SelectTrigger className="pl-10 glass-effect border-white/10 h-12">
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
                      <SelectTrigger className="pl-10 glass-effect border-white/10 h-12">
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
                      <SelectTrigger className="pl-10 glass-effect border-white/10 h-12">
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
              </div>
            </div>

            {/* CV Section */}
            <div className="glass-effect rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-400" />
                CV / Resume
              </h2>
              
              <div className="space-y-2">
                <Label htmlFor="cv" className="text-foreground">
                  Paste your CV text or key highlights
                </Label>
                <Textarea
                  id="cv"
                  placeholder="Enter your CV content, work experience, projects, achievements..."
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  className="glass-effect border-white/10 focus:border-green-500 min-h-[200px] resize-y"
                />
                <p className="text-xs text-muted-foreground">
                  This information helps us provide better job recommendations
                </p>
              </div>
            </div>
          </div>

          {/* Skills Section - Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-effect rounded-xl p-6 border border-white/10 sticky top-24">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Skills
              </h2>
              
              {/* Add Skill Input */}
              <div className="space-y-3 mb-6">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    className="glass-effect border-white/10 focus:border-purple-500 h-10"
                  />
                  <Button
                    onClick={addSkill}
                    size="icon"
                    className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add skills relevant to your career goals
                </p>
              </div>

              {/* Skills List */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-3 py-1.5 border-purple-400/30 hover:border-purple-400 transition-colors group"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                
                {skills.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No skills added yet. Add some skills to get started!
                  </p>
                )}
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full mt-6 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
              >
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
