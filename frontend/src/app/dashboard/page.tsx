"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import JobCard from "@/components/JobCard"
import ResourceCard from "@/components/ResourceCard"
import JobDetailsModal from "@/components/JobDetailsModal"
import Footer from "@/components/Footer"
import { GraduationCap, Briefcase, Target, TrendingUp } from "lucide-react"

const mockUser = {
  name: "Alex Johnson",
  education: "Bachelor's in Computer Science",
  track: "Software Development",
  experience: "Fresher (0-1 years)",
}

const mockJobs = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "TechCorp",
    location: "Remote",
    type: "Full-time",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    postedDate: "2 days ago",
    salary: "$60k - $80k",
    experience: "0-2 years",
    description: "Join our team as a Frontend Developer and help build amazing user experiences.",
    responsibilities: [
      "Develop responsive web applications using React and TypeScript",
      "Collaborate with designers to implement UI/UX designs",
      "Optimize application performance and user experience",
    ],
    requirements: [
      "Strong knowledge of React and modern JavaScript",
      "Experience with TypeScript and CSS frameworks",
      "Understanding of web performance optimization",
    ],
    benefits: ["Health insurance", "Remote work", "Learning budget"],
  },
  {
    id: "2",
    title: "Junior Full Stack Developer",
    company: "StartupHub",
    location: "New York, NY",
    type: "Full-time",
    skills: ["Node.js", "React", "MongoDB", "Express"],
    postedDate: "1 week ago",
    salary: "$55k - $75k",
    experience: "0-2 years",
    description: "Looking for a passionate full stack developer to join our growing team.",
    responsibilities: [
      "Build and maintain web applications",
      "Work with RESTful APIs and databases",
      "Participate in code reviews and team discussions",
    ],
    requirements: [
      "Knowledge of JavaScript and Node.js",
      "Familiarity with React or similar frameworks",
      "Basic understanding of databases",
    ],
  },
]

const mockResources = [
  {
    id: "1",
    title: "Complete React Developer Course",
    platform: "Udemy",
    cost: "Paid" as const,
    price: "$49",
    skills: ["React", "JavaScript", "Web Development"],
    url: "https://www.udemy.com",
    description: "Master React from basics to advanced concepts",
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
    description: "Complete TypeScript tutorial for beginners",
  },
]

export default function DashboardPage() {
  const [selectedJob, setSelectedJob] = useState<typeof mockJobs[0] | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleViewJobDetails = (jobId: string) => {
    const job = mockJobs.find(j => j.id === jobId)
    if (job) {
      setSelectedJob(job)
      setModalOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* User Summary Card */}
        <div className="glass-effect rounded-2xl p-8 mb-8 border-glow-blue">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Welcome back, <span className="text-gradient">{mockUser.name}</span>!
                </h1>
                <p className="text-muted-foreground">Here's your career dashboard overview</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Education</p>
                    <p className="text-sm font-medium text-foreground">{mockUser.education}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Career Track</p>
                    <p className="text-sm font-medium text-foreground">{mockUser.track}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="text-sm font-medium text-foreground">{mockUser.experience}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-effect rounded-xl p-6 border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">85%</p>
                  <p className="text-xs text-muted-foreground">Profile Match</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Jobs Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Recommended Jobs</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Jobs matched to your skills and interests
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockJobs.map((job) => (
              <JobCard
                key={job.id}
                {...job}
                onViewDetails={handleViewJobDetails}
              />
            ))}
          </div>
        </section>

        {/* Learning Resources Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Learning Resources</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Curated resources to boost your skills
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockResources.map((resource) => (
              <ResourceCard key={resource.id} {...resource} />
            ))}
          </div>
        </section>
      </main>

      <JobDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        job={selectedJob}
      />

      <Footer />
    </div>
  )
}
