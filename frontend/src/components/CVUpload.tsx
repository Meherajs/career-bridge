"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Upload, FileText, CheckCircle, XCircle, Sparkles, FileUp, FileInput } from 'lucide-react'
import { profileApi, aiApi } from '@/lib/api'

interface CVUploadProps {
  onUploadSuccess?: () => void
}

export function CVUpload({ onUploadSuccess }: CVUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload')
  const [cvText, setCvText] = useState('')
  const [extractedData, setExtractedData] = useState<any>(null)
  const [extracting, setExtracting] = useState(false)

  const handleExtractFromText = async () => {
    if (!cvText.trim()) {
      setMessage({ type: 'error', text: 'Please enter CV content' })
      return
    }
    
    setExtracting(true)
    setMessage(null)
    
    try {
      const extractResult = await aiApi.extractSkills(cvText, 'gemini', true)
      setExtractedData(extractResult.extracted_data)
      
      const skillsCount = extractResult.extracted_data?.technical_skills?.length || 0
      setMessage({ 
        type: 'success', 
        text: `Successfully extracted ${skillsCount} technical skills from your CV!` 
      })
      
      onUploadSuccess?.()  
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to extract skills. Please try again.' 
      })
    } finally {
      setExtracting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    
    if (!selectedFile) {
      setFile(null)
      return
    }
    
    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'Please select a PDF file' })
      setFile(null)
      return
    }
    
    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 10MB' })
      setFile(null)
      return
    }
    
    setFile(selectedFile)
    setMessage(null)
  }

  const handleUpload = async () => {
    if (!file) return
    
    setUploading(true)
    setMessage(null)
    
    try {
      const result = await profileApi.uploadCV(file)
      
      // Extract skills automatically if CV text was extracted
      try {
        // Get the profile to access raw_cv_text
        const profile = await profileApi.getProfile()
        if (profile.raw_cv_text) {
          const extractResult = await aiApi.extractSkills(
            profile.raw_cv_text, 
            'gemini', 
            true
          )
          
          setExtractedData(extractResult.extracted_data)
          const skillsCount = extractResult.extracted_data?.technical_skills?.length || 
                             extractResult.skills?.length || 0
          
          setMessage({ 
            type: 'success', 
            text: `CV uploaded successfully! Extracted ${skillsCount} skills automatically.` 
          })
        } else {
          setMessage({ 
            type: 'success', 
            text: `CV uploaded successfully! Extracted ${result.extracted_length} characters.` 
          })
        }
      } catch (extractError) {
        // If skill extraction fails, still show success for upload
        setMessage({ 
          type: 'success', 
          text: `CV uploaded successfully! Extracted ${result.extracted_length} characters.` 
        })
      }
      
      setFile(null)
      
      // Reset file input
      const fileInput = document.getElementById('cv-file-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      
      // Callback for parent component
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

  return (
    <div className="space-y-4">
      <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as 'upload' | 'paste')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 glass-effect">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <FileUp className="w-4 h-4" />
            Upload PDF
          </TabsTrigger>
          <TabsTrigger value="paste" className="flex items-center gap-2">
            <FileInput className="w-4 h-4" />
            Paste Text
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4 mt-4">
          <div>
            <label htmlFor="cv-file-input" className="block text-sm font-medium mb-2 text-foreground">
              Upload CV/Resume (PDF)
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Input
                  id="cv-file-input"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="glass-effect border-white/10 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20"
                />
              </div>
              <Button 
                onClick={handleUpload} 
                disabled={!file || uploading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload CV
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Maximum file size: 10MB. Only PDF files are supported.
            </p>
          </div>
          
          {file && !message && (
            <div className="glass-effect rounded-lg p-3 border border-blue-500/30">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="paste" className="space-y-4 mt-4">
          <div>
            <label htmlFor="cv-text-input" className="block text-sm font-medium mb-2 text-foreground">
              Paste CV/Resume Content
            </label>
            <Textarea
              id="cv-text-input"
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Paste your CV content here...\n\nExample:\nJohn Doe\nSoftware Engineer\n\nSkills: JavaScript, React, Node.js, Python\nExperience: 3 years as Full Stack Developer at Tech Corp"
              className="glass-effect border-white/10 min-h-[200px] font-mono text-sm"
              disabled={extracting}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-muted-foreground">
                {cvText.length} characters
              </p>
              <Button 
                onClick={handleExtractFromText}
                disabled={!cvText.trim() || extracting}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
              >
                {extracting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Extract Skills
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {message && (
        <Alert 
          variant={message.type === 'error' ? 'destructive' : 'default'}
          className={message.type === 'error' ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'}
        >
          <div className="flex items-start gap-2">
            {message.type === 'error' ? (
              <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
            )}
            <AlertDescription className={message.type === 'error' ? 'text-red-200' : 'text-green-200'}>
              {message.text}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {extractedData && (
        <div className="glass-effect rounded-lg p-4 border border-green-500/30 space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold text-foreground">Extraction Results</h3>
          </div>
          
          {extractedData.technical_skills && extractedData.technical_skills.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Technical Skills</p>
              <div className="flex flex-wrap gap-2">
                {extractedData.technical_skills.map((skill: any, idx: number) => (
                  <Badge key={idx} variant="outline" className="border-blue-500/30 bg-blue-500/10">
                    {typeof skill === 'string' ? skill : skill.name}
                    {skill.proficiency && (
                      <span className="ml-1 text-xs text-blue-300">({skill.proficiency})</span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {extractedData.soft_skills && extractedData.soft_skills.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Soft Skills</p>
              <div className="flex flex-wrap gap-2">
                {extractedData.soft_skills.map((skill: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="border-purple-500/30 bg-purple-500/10">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {extractedData.roles && extractedData.roles.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Roles/Positions</p>
              <div className="flex flex-wrap gap-2">
                {extractedData.roles.map((role: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="border-green-500/30 bg-green-500/10">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {extractedData.tools && extractedData.tools.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Tools & Technologies</p>
              <div className="flex flex-wrap gap-2">
                {extractedData.tools.map((tool: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="border-orange-500/30 bg-orange-500/10">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {extractedData.certifications && extractedData.certifications.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Certifications</p>
              <div className="flex flex-wrap gap-2">
                {extractedData.certifications.map((cert: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="border-yellow-500/30 bg-yellow-500/10">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-3">
            ✓ Skills have been added to your profile. You can edit them in the Skills section.
          </p>
        </div>
      )}
    </div>
  )
}
