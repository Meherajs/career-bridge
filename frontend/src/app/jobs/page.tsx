"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Navbar from "@/components/Navbar"
import JobCard from "@/components/JobCard"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, ChevronLeft, ChevronRight, Globe, Building, Landmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { jobsApi, externalJobsApi, ExternalJob } from "@/lib/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Lazy load heavy components
const JobDetailsModal = dynamic(() => import("@/components/JobDetailsModal"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="h-32" />,
});

export default function JobsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [allJobs, setAllJobs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<any | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState("all")
  const [externalJobs, setExternalJobs] = useState<ExternalJob[]>([])
  const [isLoadingExternal, setIsLoadingExternal] = useState(false)

  useEffect(() => {
    const loadJobs = async () => {
      try {
        console.log('🔍 Fetching jobs from API...')
        const jobsData = await jobsApi.getRecommendations()
        console.log('✅ Jobs received:', jobsData)
        console.log('📊 Jobs count:', jobsData.length)
        
        // Transform jobs data to match JobCard component
        const transformedJobs = jobsData.map((item: any) => {
          const skills = item.job.required_skills || []
          const experienceLevel = item.job.experience_level || "junior"
          
          return {
            id: item.job.id.toString(),
            title: item.job.job_title,
            company: item.job.company,
            location: item.job.location,
            type: item.job.job_type,
            skills: skills,
            postedDate: "Recently",
            salary: item.job.salary_min && item.job.salary_max 
              ? `$${item.job.salary_min}k - $${item.job.salary_max}k`
              : "Not specified",
            experience: experienceLevel,
            description: item.job.job_description || "",
            responsibilities: item.job.responsibilities || [],
            requirements: item.job.requirements || [],
            benefits: item.job.benefits || [],
            matchScore: item.match_score ?? null,
            matchedSkills: item.matched_skills || [],
            missingSkills: item.missing_skills || [],
            matchExplanation: item.match_explanation || null,
            strengths: item.strengths || [],
            improvementAreas: item.improvement_areas || [],
            experienceAlignment: item.experience_alignment ?? null,
            trackAlignment: item.track_alignment ?? null,
            skillOverlap: item.skill_overlap ?? null,
            platformLinks: item.platform_links || null,
          }
        })

        console.log('🔄 Transformed jobs count:', transformedJobs.length)
        setAllJobs(transformedJobs)
      } catch (err: any) {
        console.error('❌ Error loading jobs:', err)
        console.error('Error details:', err.message)
        if (err.message.includes('Session expired')) {
          console.log('🔐 Redirecting to login...')
          router.push('/login')
        } else if (err.message.includes('Failed to fetch') || err.message.includes('Network')) {
          toast.error('Unable to connect to server. Please ensure the backend is running.')
        } else {
          toast.error('Failed to load jobs: ' + err.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadJobs()
  }, [router])

  // Load external jobs when tab changes
  useEffect(() => {
    const loadExternalJobs = async () => {
      setIsLoadingExternal(true)
      try {
        let jobs: ExternalJob[] = []
        
        if (activeTab === "all") {
          // Combine platform jobs and all external jobs
          const externalJobs = await externalJobsApi.getAll()
          // Transform platform jobs to match ExternalJob format
          const platformAsExternal: ExternalJob[] = allJobs.map(job => ({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description || "",
            url: `#job-${job.id}`, // Will be handled to open modal
            posted_date: job.postedDate || new Date().toISOString(),
            source: "CareerBridge",
            job_type: job.type,
            experience_level: job.experience,
            skills: job.skills || [],
            salary: job.salary,
          }))
          jobs = [...platformAsExternal, ...externalJobs]
        } else if (activeTab === "local") {
          // Only show Bangladeshi jobs (NGO, govt, local boards)
          const [ngoJobs, govtJobs, localJobs] = await Promise.all([
            externalJobsApi.getNGO(),
            externalJobsApi.getGovt(),
            externalJobsApi.getLocal()
          ])
          jobs = [...ngoJobs, ...govtJobs, ...localJobs]
        }

        setExternalJobs(jobs)
      } catch (err: any) {
        console.error('Error loading external jobs:', err)
        toast.error('Failed to load external jobs: ' + err.message)
        setExternalJobs([])
      } finally {
        setIsLoadingExternal(false)
      }
    }

    loadExternalJobs()
  }, [activeTab, allJobs])

  const handleViewJobDetails = (jobId: string) => {
    const job = allJobs.find(j => j.id === jobId)
    if (job) {
      setSelectedJob(job)
      setModalOpen(true)
    }
  }

  const handleViewExternalJob = (job: ExternalJob) => {
    // For local jobs, open the URL directly
    if (activeTab === "local") {
      window.open(job.url, '_blank', 'noopener,noreferrer')
    } 
    // For CareerBridge platform jobs, open the modal
    else if (job.source === "CareerBridge") {
      const platformJob = allJobs.find(j => j.id === job.id)
      if (platformJob) {
        setSelectedJob(platformJob)
        setModalOpen(true)
      }
    }
    // For other external jobs, open URL
    else {
      window.open(job.url, '_blank', 'noopener,noreferrer')
    }
  }

  const filteredJobs = allJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.skills.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesLocation = locationFilter === "all" || 
                           (locationFilter === "remote" && job.location.toLowerCase().includes("remote")) ||
                           (locationFilter === "onsite" && !job.location.toLowerCase().includes("remote"))
    
    const matchesType = typeFilter === "all" || job.type.toLowerCase() === typeFilter.toLowerCase()
    
    return matchesSearch && matchesLocation && matchesType
  })

  // Filter external jobs
  const filteredExternalJobs = externalJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.skills.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesSearch
  })

  // Pagination calculations for platform jobs
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex)

  // Pagination calculations for external jobs
  const totalPagesExternal = Math.ceil(filteredExternalJobs.length / itemsPerPage)
  const startIndexExternal = (currentPage - 1) * itemsPerPage
  const endIndexExternal = startIndexExternal + itemsPerPage
  const paginatedExternalJobs = filteredExternalJobs.slice(startIndexExternal, endIndexExternal)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, locationFilter, typeFilter, itemsPerPage, activeTab])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading jobs...</div>
      </div>
    )
  }

  const renderPaginationControls = (totalPgs: number) => {
    if (totalPgs <= 1) return null
    
    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="glass-effect border-purple-300 dark:border-purple-500/20 hover:bg-purple-500/10 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPgs }, (_, i) => i + 1).map((page) => {
            if (
              page === 1 ||
              page === totalPgs ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page 
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white" 
                    : "glass-effect border-purple-300 dark:border-purple-500/20 hover:bg-purple-500/10"
                  }
                >
                  {page}
                </Button>
              )
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return <span key={page} className="text-muted-foreground">...</span>
            }
            return null
          })}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(prev => Math.min(totalPgs, prev + 1))}
          disabled={currentPage === totalPgs}
          className="glass-effect border-purple-300 dark:border-purple-500/20 hover:bg-purple-500/10 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Explore Jobs</h1>
          <p className="text-muted-foreground">
            Discover opportunities from all sources or focus on local Bangladeshi jobs from NGOs, government, and job boards
          </p>
        </div>

        {/* Job Source Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="glass-effect border border-purple-200 dark:border-purple-500/20">
            <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              <Globe className="w-4 h-4 mr-2" />
              All Jobs
            </TabsTrigger>
            <TabsTrigger value="local" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <Building className="w-4 h-4 mr-2" />
              Local Jobs
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search and Filters */}
        <div className="glass-effect rounded-xl p-6 mb-8 border border-purple-200 dark:border-purple-500/20">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-[14px] w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search jobs, companies, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass-effect border-purple-200 dark:border-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 h-12"
                />
              </div>
            </div>

            {/* Location Filter */}
            <div className="relative flex-shrink-0 w-full md:w-auto">
              <Filter className="absolute left-3 top-[12px] w-3.5 h-3.5 text-muted-foreground z-10 pointer-events-none" />
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="pl-9 pr-3 glass-effect border-purple-200 dark:border-purple-500/20 h-12 w-full md:w-[180px]">
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
            <div className="relative flex-shrink-0 w-full md:w-auto">
              <Filter className="absolute left-3 top-[12px] w-3.5 h-3.5 text-muted-foreground z-10 pointer-events-none" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="pl-9 pr-3 glass-effect border-purple-200 dark:border-purple-500/20 h-12 w-full md:w-[180px]">
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

          {/* Results count and items per page */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              <>Showing <span className="text-foreground font-medium">{startIndexExternal + 1}-{Math.min(endIndexExternal, filteredExternalJobs.length)}</span> of <span className="text-foreground font-medium">{filteredExternalJobs.length}</span> results</>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Jobs per page:</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-[80px] h-9 glass-effect border-purple-200 dark:border-purple-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-effect border-white/10">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {
          isLoadingExternal ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-muted-foreground">Loading external jobs...</div>
            </div>
          ) : filteredExternalJobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedExternalJobs.map((job) => (
                  <div
                    key={job.id}
                    className="glass-effect rounded-xl p-6 border border-purple-200 dark:border-purple-500/20 hover:border-purple-500 dark:hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer"
                    onClick={() => handleViewExternalJob(job)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg text-foreground line-clamp-2">{job.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 whitespace-nowrap ml-2">
                        {job.source}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        {job.company}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        {job.location}
                      </p>
                      {job.salary && (
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
                          {job.salary}
                        </p>
                      )}
                    </div>

                    {job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-md text-xs text-indigo-700 dark:text-indigo-300"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-md text-xs text-indigo-600 dark:text-indigo-400">
                            +{job.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Posted: {new Date(job.posted_date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
              {renderPaginationControls(totalPagesExternal)}
            </>
          ) : (
            <div className="glass-effect rounded-xl p-12 text-center border border-white/10">
              <p className="text-muted-foreground text-lg">
                No jobs found. Try a different filter or check back later.
              </p>
            </div>
          )
        }
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
