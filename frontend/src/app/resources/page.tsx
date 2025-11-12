"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import ResourceCard from "@/components/ResourceCard"
import Footer from "@/components/Footer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, BookOpen } from "lucide-react"

const allResources = [
  {
    id: "1",
    title: "Complete React Developer Course",
    platform: "Udemy",
    cost: "Paid" as const,
    price: "$49",
    skills: ["React", "JavaScript", "Web Development"],
    url: "https://www.udemy.com",
    description: "Master React from basics to advanced concepts with hands-on projects",
  },
  {
    id: "2",
    title: "JavaScript ES6+ Guide",
    platform: "freeCodeCamp",
    cost: "Free" as const,
    skills: ["JavaScript", "ES6", "Programming"],
    url: "https://www.freecodecamp.org",
    description: "Learn modern JavaScript features and best practices",
  },
  {
    id: "3",
    title: "TypeScript for Beginners",
    platform: "YouTube",
    cost: "Free" as const,
    skills: ["TypeScript", "JavaScript"],
    url: "https://www.youtube.com",
    description: "Complete TypeScript tutorial for beginners with practical examples",
  },
  {
    id: "4",
    title: "Full Stack Web Development",
    platform: "Coursera",
    cost: "Paid" as const,
    price: "$79/month",
    skills: ["Node.js", "React", "MongoDB", "Express"],
    url: "https://www.coursera.org",
    description: "Comprehensive full stack development course with certification",
  },
  {
    id: "5",
    title: "Python for Data Science",
    platform: "edX",
    cost: "Paid" as const,
    price: "$199",
    skills: ["Python", "Data Science", "Pandas", "NumPy"],
    url: "https://www.edx.org",
    description: "Learn Python programming for data analysis and machine learning",
  },
  {
    id: "6",
    title: "UI/UX Design Principles",
    platform: "YouTube",
    cost: "Free" as const,
    skills: ["UI Design", "UX Design", "Figma"],
    url: "https://www.youtube.com",
    description: "Master the fundamentals of user interface and experience design",
  },
  {
    id: "7",
    title: "Advanced CSS and Sass",
    platform: "Udemy",
    cost: "Paid" as const,
    price: "$39",
    skills: ["CSS", "Sass", "Web Design"],
    url: "https://www.udemy.com",
    description: "Build responsive websites with modern CSS techniques",
  },
  {
    id: "8",
    title: "Git and GitHub Essentials",
    platform: "freeCodeCamp",
    cost: "Free" as const,
    skills: ["Git", "GitHub", "Version Control"],
    url: "https://www.freecodecamp.org",
    description: "Master version control with Git and collaborate on GitHub",
  },
  {
    id: "9",
    title: "AWS Cloud Practitioner",
    platform: "LinkedIn Learning",
    cost: "Paid" as const,
    price: "$29.99/month",
    skills: ["AWS", "Cloud Computing", "DevOps"],
    url: "https://www.linkedin.com/learning",
    description: "Get started with Amazon Web Services and cloud computing",
  },
  {
    id: "10",
    title: "Mobile App Development",
    platform: "Udemy",
    cost: "Paid" as const,
    price: "$54",
    skills: ["React Native", "Mobile Development", "iOS", "Android"],
    url: "https://www.udemy.com",
    description: "Build cross-platform mobile apps with React Native",
  },
  {
    id: "11",
    title: "SQL for Beginners",
    platform: "Khan Academy",
    cost: "Free" as const,
    skills: ["SQL", "Database", "Data Management"],
    url: "https://www.khanacademy.org",
    description: "Learn database management and SQL queries from scratch",
  },
  {
    id: "12",
    title: "Machine Learning A-Z",
    platform: "Udemy",
    cost: "Paid" as const,
    price: "$89",
    skills: ["Machine Learning", "Python", "AI"],
    url: "https://www.udemy.com",
    description: "Comprehensive machine learning course with Python",
  },
]

export default function ResourcesPage() {
  const [costFilter, setCostFilter] = useState("all")
  const [skillFilter, setSkillFilter] = useState("all")

  // Extract unique skills
  const allSkills = Array.from(new Set(allResources.flatMap(r => r.skills))).sort()

  const filteredResources = allResources.filter(resource => {
    const matchesCost = costFilter === "all" || 
                       (costFilter === "free" && resource.cost === "Free") ||
                       (costFilter === "paid" && resource.cost === "Paid")
    
    const matchesSkill = skillFilter === "all" || 
                        resource.skills.some(skill => skill === skillFilter)
    
    return matchesCost && matchesSkill
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2 leading-normal pb-2">Learning Resources</h1>
          <p className="text-muted-foreground">
            Curated courses and tutorials to boost your skills
          </p>
        </div>

        {/* Filters */}
        <div className="glass-effect rounded-xl p-6 mb-8 border border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-foreground">Filter Resources</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            {/* Cost Filter */}
            <div className="relative flex-shrink-0 w-full md:w-auto">
              <Filter className="absolute left-3 top-[12px] w-3.5 h-3.5 text-muted-foreground z-10 pointer-events-none" />
              <Select value={costFilter} onValueChange={setCostFilter}>
                <SelectTrigger className="pl-9 pr-3 glass-effect border-gray-300 dark:border-white/10 h-12 w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Cost" />
                </SelectTrigger>
                <SelectContent className="glass-effect border-white/10">
                  <SelectItem value="all">All Resources</SelectItem>
                  <SelectItem value="free">Free Only</SelectItem>
                  <SelectItem value="paid">Paid Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Skill Filter */}
            <div className="relative flex-shrink-0 w-full md:w-auto">
              <Filter className="absolute left-3 top-[12px] w-3.5 h-3.5 text-muted-foreground z-10 pointer-events-none" />
              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger className="pl-9 pr-3 glass-effect border-gray-300 dark:border-white/10 h-12 w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Skill" />
                </SelectTrigger>
                <SelectContent className="glass-effect border-white/10 max-h-[300px]">
                  <SelectItem value="all">All Skills</SelectItem>
                  {allSkills.map(skill => (
                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing <span className="text-foreground font-medium">{filteredResources.length}</span> resources
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} {...resource} />
            ))}
          </div>
        ) : (
          <div className="glass-effect rounded-xl p-12 text-center border border-white/10">
            <p className="text-muted-foreground text-lg">
              No resources found matching your criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
