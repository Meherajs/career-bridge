"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { profileApi } from "@/lib/api"
import { toast } from "sonner"
import { FileDown, Printer, Mail, MapPin, Phone, Linkedin, Github, Globe, Award, Briefcase, GraduationCap, Code, BookOpen } from "lucide-react"

interface ProfileData {
  fullName?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  website?: string
  skills: string[]
  projects: string[]
  targetRoles: string[]
  educationLevel?: string
  experienceLevel?: string
}

export function CVExport() {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const loadProfile = async () => {
    setLoading(true)
    try {
      const data = await profileApi.getProfile()
      setProfile({
        fullName: data.full_name || data.email?.split('@')[0] || 'Your Name',
        email: data.email,
        phone: undefined,
        location: undefined,
        linkedin: undefined,
        github: undefined,
        website: undefined,
        skills: data.skills || [],
        projects: data.projects || [],
        targetRoles: data.target_roles || [],
        educationLevel: data.education_level || undefined,
        experienceLevel: data.experience_level || undefined
      })
      setIsOpen(true)
    } catch (err: any) {
      toast.error(err.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>CV - ${profile?.fullName}</title>
              <style>
                @media print {
                  @page {
                    margin: 0.5in;
                  }
                }
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  background: white;
                  padding: 20px;
                }
                .cv-container {
                  max-width: 800px;
                  margin: 0 auto;
                }
                .cv-header {
                  text-align: center;
                  padding-bottom: 20px;
                  border-bottom: 3px solid #2563eb;
                  margin-bottom: 30px;
                }
                .cv-name {
                  font-size: 32px;
                  font-weight: bold;
                  color: #1e40af;
                  margin-bottom: 10px;
                }
                .cv-contact {
                  display: flex;
                  justify-content: center;
                  flex-wrap: wrap;
                  gap: 15px;
                  font-size: 14px;
                  color: #666;
                }
                .cv-contact-item {
                  display: flex;
                  align-items: center;
                  gap: 5px;
                }
                .cv-section {
                  margin-bottom: 25px;
                }
                .cv-section-title {
                  font-size: 20px;
                  font-weight: bold;
                  color: #1e40af;
                  margin-bottom: 12px;
                  padding-bottom: 8px;
                  border-bottom: 2px solid #e5e7eb;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                }
                .cv-skills {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 8px;
                }
                .cv-skill {
                  background: #eff6ff;
                  color: #1e40af;
                  padding: 6px 12px;
                  border-radius: 6px;
                  font-size: 13px;
                  font-weight: 500;
                  border: 1px solid #bfdbfe;
                }
                .cv-projects {
                  list-style: none;
                }
                .cv-project {
                  padding: 10px 0;
                  padding-left: 20px;
                  position: relative;
                  line-height: 1.7;
                }
                .cv-project:before {
                  content: "▸";
                  position: absolute;
                  left: 0;
                  color: #2563eb;
                  font-weight: bold;
                }
                .cv-roles {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 8px;
                }
                .cv-role {
                  background: #f0fdf4;
                  color: #166534;
                  padding: 6px 12px;
                  border-radius: 6px;
                  font-size: 13px;
                  font-weight: 500;
                  border: 1px solid #bbf7d0;
                }
                .cv-info-item {
                  padding: 8px 0;
                  color: #555;
                }
                .cv-info-label {
                  font-weight: 600;
                  color: #333;
                  margin-right: 8px;
                }
                @media print {
                  body {
                    padding: 0;
                  }
                  .cv-header {
                    page-break-after: avoid;
                  }
                  .cv-section {
                    page-break-inside: avoid;
                  }
                }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 250)
      }
    }
  }

  return (
    <>
      <Button
        onClick={loadProfile}
        disabled={loading}
        className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            Loading...
          </>
        ) : (
          <>
            <FileDown className="w-4 h-4 mr-2" />
            Generate CV
          </>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Your Professional CV</DialogTitle>
            <DialogDescription>
              Preview and print your CV. You can use your browser&apos;s print to PDF feature to save it.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2 mb-4">
            <Button
              onClick={handlePrint}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print / Save as PDF
            </Button>
          </div>

          {/* CV Preview */}
          <div ref={printRef} className="bg-white rounded-lg shadow-lg" style={{ color: '#333' }}>
            <div className="cv-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
              {/* Header */}
              <div className="cv-header" style={{ textAlign: 'center', paddingBottom: '20px', borderBottom: '3px solid #2563eb', marginBottom: '30px' }}>
                <div className="cv-name" style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e40af', marginBottom: '10px' }}>
                  {profile?.fullName}
                </div>
                <div className="cv-contact" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '15px', fontSize: '14px', color: '#666' }}>
                  {profile?.email && (
                    <div className="cv-contact-item" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Mail style={{ width: '16px', height: '16px' }} />
                      {profile.email}
                    </div>
                  )}
                  {profile?.phone && (
                    <div className="cv-contact-item" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Phone style={{ width: '16px', height: '16px' }} />
                      {profile.phone}
                    </div>
                  )}
                  {profile?.location && (
                    <div className="cv-contact-item" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin style={{ width: '16px', height: '16px' }} />
                      {profile.location}
                    </div>
                  )}
                </div>
                {(profile?.linkedin || profile?.github || profile?.website) && (
                  <div className="cv-contact" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '15px', fontSize: '13px', color: '#666', marginTop: '10px' }}>
                    {profile?.linkedin && (
                      <div className="cv-contact-item" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Linkedin style={{ width: '16px', height: '16px' }} />
                        {profile.linkedin}
                      </div>
                    )}
                    {profile?.github && (
                      <div className="cv-contact-item" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Github style={{ width: '16px', height: '16px' }} />
                        {profile.github}
                      </div>
                    )}
                    {profile?.website && (
                      <div className="cv-contact-item" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Globe style={{ width: '16px', height: '16px' }} />
                        {profile.website}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Target Roles */}
              {profile?.targetRoles && profile.targetRoles.length > 0 && (
                <div className="cv-section" style={{ marginBottom: '25px' }}>
                  <div className="cv-section-title" style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e40af', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid #e5e7eb', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <Briefcase style={{ width: '20px', height: '20px', display: 'inline', marginRight: '8px' }} />
                    Career Objective
                  </div>
                  <div className="cv-roles" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {profile.targetRoles.map((role, idx) => (
                      <div key={idx} className="cv-role" style={{ background: '#f0fdf4', color: '#166534', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', border: '1px solid #bbf7d0' }}>
                        {role}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education & Experience */}
              {(profile?.educationLevel || profile?.experienceLevel) && (
                <div className="cv-section" style={{ marginBottom: '25px' }}>
                  <div className="cv-section-title" style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e40af', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid #e5e7eb', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <GraduationCap style={{ width: '20px', height: '20px', display: 'inline', marginRight: '8px' }} />
                    Background
                  </div>
                  {profile.educationLevel && (
                    <div className="cv-info-item" style={{ padding: '8px 0', color: '#555' }}>
                      <span className="cv-info-label" style={{ fontWeight: '600', color: '#333', marginRight: '8px' }}>Education:</span>
                      {profile.educationLevel}
                    </div>
                  )}
                  {profile.experienceLevel && (
                    <div className="cv-info-item" style={{ padding: '8px 0', color: '#555' }}>
                      <span className="cv-info-label" style={{ fontWeight: '600', color: '#333', marginRight: '8px' }}>Experience Level:</span>
                      {profile.experienceLevel}
                    </div>
                  )}
                </div>
              )}

              {/* Skills */}
              {profile?.skills && profile.skills.length > 0 && (
                <div className="cv-section" style={{ marginBottom: '25px' }}>
                  <div className="cv-section-title" style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e40af', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid #e5e7eb', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <Code style={{ width: '20px', height: '20px', display: 'inline', marginRight: '8px' }} />
                    Technical Skills
                  </div>
                  <div className="cv-skills" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {profile.skills.map((skill, idx) => (
                      <div key={idx} className="cv-skill" style={{ background: '#eff6ff', color: '#1e40af', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', border: '1px solid #bfdbfe' }}>
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {profile?.projects && profile.projects.length > 0 && (
                <div className="cv-section" style={{ marginBottom: '25px' }}>
                  <div className="cv-section-title" style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e40af', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid #e5e7eb', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <BookOpen style={{ width: '20px', height: '20px', display: 'inline', marginRight: '8px' }} />
                    Projects & Experience
                  </div>
                  <ul className="cv-projects" style={{ listStyle: 'none' }}>
                    {profile.projects.map((project, idx) => (
                      <li key={idx} className="cv-project" style={{ padding: '10px 0', paddingLeft: '20px', position: 'relative', lineHeight: '1.7' }}>
                        <span style={{ position: 'absolute', left: '0', color: '#2563eb', fontWeight: 'bold' }}>▸</span>
                        {project}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
