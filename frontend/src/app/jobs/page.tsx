"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import JobCard from "@/components/JobCard"
import JobDetailsModal from "@/components/JobDetailsModal"
import Footer from "@/components/Footer"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

const allJobs = [
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
    description: "Join our team as a Frontend Developer and help build amazing user experiences with modern technologies.",
    responsibilities: [
      "Develop responsive web applications using React and TypeScript",
      "Collaborate with designers to implement UI/UX designs",
      "Optimize application performance and user experience",
      "Write clean, maintainable code following best practices",
    ],
    requirements: [
      "Strong knowledge of React and modern JavaScript",
      "Experience with TypeScript and CSS frameworks",
      "Understanding of web performance optimization",
      "Good communication and teamwork skills",
    ],
    benefits: ["Health insurance", "Remote work", "Learning budget", "Flexible hours"],
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
    description: "Looking for a passionate full stack developer to join our growing team and work on exciting projects.",
    responsibilities: [
      "Build and maintain web applications using MERN stack",
      "Work with RESTful APIs and databases",
      "Participate in code reviews and team discussions",
      "Contribute to technical documentation",
    ],
    requirements: [
      "Knowledge of JavaScript and Node.js",
      "Familiarity with React or similar frameworks",
      "Basic understanding of databases",
      "Problem-solving mindset",
    ],
    benefits: ["401(k) matching", "Health insurance", "Career development"],
  },
  {
    id: "3",
    title: "UI/UX Designer",
    company: "DesignStudio",
    location: "San Francisco, CA",
    type: "Full-time",
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    postedDate: "3 days ago",
    salary: "$65k - $85k",
    experience: "1-3 years",
    description: "Create beautiful and intuitive user experiences for our digital products.",
    responsibilities: [
      "Design user interfaces for web and mobile applications",
      "Conduct user research and usability testing",
      "Create wireframes, prototypes, and high-fidelity designs",
      "Collaborate with developers to ensure design implementation",
    ],
    requirements: [
      "Proficiency in Figma or Adobe XD",
      "Strong portfolio showcasing UI/UX work",
      "Understanding of design systems and accessibility",
      "Excellent communication skills",
    ],
    benefits: ["Creative freedom", "Latest tools", "Team outings"],
  },
  {
    id: "4",
    title: "Data Analyst Intern",
    company: "DataCo",
    location: "Remote",
    type: "Internship",
    skills: ["Python", "SQL", "Excel", "Tableau"],
    postedDate: "5 days ago",
    salary: "$30k - $40k",
    experience: "0-1 years",
    description: "Learn and grow as a data analyst while working on real-world projects.",
    responsibilities: [
      "Analyze data and create reports",
      "Build dashboards using Tableau",
      "Work with SQL databases",
      "Support data-driven decision making",
    ],
    requirements: [
      "Basic knowledge of Python and SQL",
      "Understanding of data analysis concepts",
      "Eagerness to learn",
      "Good analytical skills",
    ],
    benefits: ["Mentorship program", "Flexible schedule", "Potential for full-time"],
  },
  {
    id: "5",
    title: "Backend Developer",
    company: "CloudTech",
    location: "Austin, TX",
    type: "Full-time",
    skills: ["Python", "Django", "PostgreSQL", "AWS"],
    postedDate: "1 week ago",
    salary: "$70k - $90k",
    experience: "2-4 years",
    description: "Build scalable backend systems for our cloud-based platform.",
    responsibilities: [
      "Design and develop RESTful APIs",
      "Optimize database queries and performance",
      "Deploy and maintain cloud infrastructure",
      "Write unit and integration tests",
    ],
    requirements: [
      "Strong Python and Django experience",
      "Knowledge of relational databases",
      "Experience with AWS or similar cloud platforms",
      "Understanding of microservices architecture",
    ],
    benefits: ["Stock options", "Gym membership", "Relocation assistance"],
  },
  {
    id: "6",
    title: "Mobile App Developer",
    company: "AppWorks",
    location: "Remote",
    type: "Contract",
    skills: ["React Native", "iOS", "Android", "JavaScript"],
    postedDate: "4 days ago",
    salary: "$50k - $70k",
    experience: "1-3 years",
    description: "Develop cross-platform mobile applications using React Native.",
    responsibilities: [
      "Build mobile apps for iOS and Android",
      "Integrate with backend APIs",
      "Ensure app performance and responsiveness",
      "Fix bugs and implement new features",
    ],
    requirements: [
      "Experience with React Native",
      "Knowledge of mobile app development lifecycle",
      "Understanding of mobile UI/UX principles",
      "Ability to work independently",
    ],
    benefits: ["Flexible hours", "Remote work", "Project bonuses"],
  },
]

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedJob, setSelectedJob] = useState<typeof allJobs[0] | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleViewJobDetails = (jobId: string) => {
    const job = allJobs.find(j => j.id === jobId)
    if (job) {
      setSelectedJob(job)
      setModalOpen(true)
    }
  }

  const filteredJobs = allJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesLocation = locationFilter === "all" || 
                           (locationFilter === "remote" && job.location.toLowerCase().includes("remote")) ||
                           (locationFilter === "onsite" && !job.location.toLowerCase().includes("remote"))
    
    const matchesType = typeFilter === "all" || job.type.toLowerCase() === typeFilter.toLowerCase()
    
    return matchesSearch && matchesLocation && matchesType
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Explore Jobs</h1>
          <p className="text-muted-foreground">
            Find your perfect opportunity from {allJobs.length}+ available positions
          </p>
        </div>

        {/* Search and Filters */}
        <div className="glass-effect rounded-xl p-6 mb-8 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search jobs, companies, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass-effect border-white/10 focus:border-blue-500 h-12"
                />
              </div>
            </div>

            {/* Location Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="pl-10 glass-effect border-white/10 h-12">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="glass-effect border-white/10">
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="pl-10 glass-effect border-white/10 h-12">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent className="glass-effect border-white/10">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing <span className="text-foreground font-medium">{filteredJobs.length}</span> results
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                {...job}
                onViewDetails={handleViewJobDetails}
              />
            ))}
          </div>
        ) : (
          <div className="glass-effect rounded-xl p-12 text-center border border-white/10">
            <p className="text-muted-foreground text-lg">
              No jobs found matching your criteria. Try adjusting your filters.
            </p>
          </div>
        )}
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
