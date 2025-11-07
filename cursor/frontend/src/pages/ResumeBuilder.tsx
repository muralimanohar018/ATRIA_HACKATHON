import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '../components/common/SectionHeader'
import GlassCard from '../components/common/GlassCard'
import NeonButton from '../components/common/NeonButton'
import { apiRoutes, type Job } from '../lib/api'
import { Download, FileText, Sparkles, Loader2, Upload, CheckCircle, X, AlertCircle, Target, TrendingUp, File, Mail, Zap, Award } from 'lucide-react'

interface ResumeData {
  personalInfo: {
    name: string
    email: string
    phone: string
    address: string
    linkedin: string
    github: string
  }
  summary: string
  experience: Array<{
    company: string
    position: string
    startDate: string
    endDate: string
    description: string
  }>
  education: Array<{
    institution: string
    degree: string
    field: string
    year: string
  }>
  skills: string[]
  achievements: string[]
}

interface MatchAnalysis {
  match_score: number
  matched_skills: string[]
  missing_skills: string[]
  analysis: string
  recommendations: string[]
}

const RESUME_TEMPLATES = [
  { id: 'ats-modern', name: 'ATS Modern', description: 'AI-Enhanced ATS-friendly format', atsOptimized: true },
  { id: 'ats-classic', name: 'ATS Classic', description: 'AI-Optimized traditional format', atsOptimized: true },
  { id: 'professional', name: 'Professional', description: 'AI-Powered professional design', atsOptimized: true },
  { id: 'executive', name: 'Executive', description: 'AI-Enhanced executive style', atsOptimized: true },
]

export default function ResumeBuilder() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [template, setTemplate] = useState('ats-modern')
  const [resumeInputMode, setResumeInputMode] = useState<'builder' | 'upload'>('builder')
  const [resumeText, setResumeText] = useState('')
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      github: '',
    },
    summary: '',
    experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
    education: [{ institution: '', degree: '', field: '', year: '' }],
    skills: [],
    achievements: [],
  })
  const [currentSkill, setCurrentSkill] = useState('')
  const [currentAchievement, setCurrentAchievement] = useState('')
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showSubmit, setShowSubmit] = useState(false)
  const [matchAnalysis, setMatchAnalysis] = useState<MatchAnalysis | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    loadJobs()
  }, [])

  useEffect(() => {
    if (selectedJob && (resumeText || resumeData.personalInfo.name)) {
      analyzeMatch()
    }
  }, [selectedJob, resumeText, resumeData])

  const loadJobs = async () => {
    try {
      const response = await apiRoutes.jobs.list()
      if (response.data.success) {
        setJobs(response.data.data)
      }
    } catch (error) {
      console.error('Failed to load jobs:', error)
    }
  }

  const analyzeMatch = async () => {
    if (!selectedJob) return
    
    setAnalyzing(true)
    try {
      const currentResumeText = resumeInputMode === 'upload' 
        ? resumeText 
        : generateResumeText()
      
      if (!currentResumeText.trim()) {
        setAnalyzing(false)
        return
      }

      const response = await apiRoutes.ai.jobMatch(currentResumeText, selectedJob.description)
      if (response.data.success) {
        const match = response.data.data
        // Extract missing skills from job description
        const jobSkills = extractSkillsFromJob(selectedJob.description)
        const matchedSkills = match.matched_skills || []
        const missingSkills = jobSkills.filter(skill => 
          !matchedSkills.some(ms => ms.toLowerCase().includes(skill.toLowerCase()))
        )

        setMatchAnalysis({
          match_score: match.match_score || 0,
          matched_skills: matchedSkills,
          missing_skills: missingSkills.slice(0, 5),
          analysis: match.analysis || '',
          recommendations: generateRecommendations(match.match_score || 0, missingSkills),
        })
      }
    } catch (error) {
      console.error('Failed to analyze match:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const extractSkillsFromJob = (jobDesc: string): string[] => {
    const commonSkills = [
      'Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'MongoDB', 'PostgreSQL',
      'AWS', 'Docker', 'Kubernetes', 'Git', 'Flask', 'Django', 'FastAPI',
      'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch',
      'HTML', 'CSS', 'TypeScript', 'Vue.js', 'Angular', 'Redux',
      'REST API', 'GraphQL', 'Microservices', 'CI/CD', 'DevOps'
    ]
    const jobLower = jobDesc.toLowerCase()
    return commonSkills.filter(skill => jobLower.includes(skill.toLowerCase()))
  }

  const generateRecommendations = (score: number, missingSkills: string[]): string[] => {
    const recommendations: string[] = []
    
    if (score < 60) {
      recommendations.push('Consider highlighting more relevant experience matching the job requirements')
      recommendations.push('Add keywords from the job description to improve ATS parsing')
    } else if (score < 80) {
      recommendations.push('Good match! Consider adding more specific technical skills')
    } else {
      recommendations.push('Excellent match! Your resume aligns well with the job requirements')
    }

    if (missingSkills.length > 0) {
      recommendations.push(`Consider mentioning: ${missingSkills.slice(0, 3).join(', ')}`)
    }

    return recommendations
  }

  const parseResumeText = (text: string) => {
    // Simple resume parsing - extract key information
    const lines = text.split('\n').filter(l => l.trim())
    const parsed: Partial<ResumeData> = {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        address: '',
        linkedin: '',
        github: '',
      },
      skills: [],
      experience: [],
      education: [],
      achievements: [],
      summary: '',
    }

    // Extract email
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)
    if (emailMatch) parsed.personalInfo!.email = emailMatch[0]

    // Extract phone
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
    if (phoneMatch) parsed.personalInfo!.phone = phoneMatch[0]

    // Extract name (usually first line)
    if (lines.length > 0 && !emailMatch) {
      parsed.personalInfo!.name = lines[0].trim()
    }

    // Extract skills (look for common skill keywords)
    const skillKeywords = extractSkillsFromJob(text)
    parsed.skills = skillKeywords

    setResumeData({
      ...resumeData,
      ...parsed as ResumeData,
    })
  }

  const generateATSResume = (): string => {
    // ATS-optimized resume format
    const lines: string[] = []
    
    // Header - Simple, keyword-rich
    lines.push(resumeData.personalInfo.name.toUpperCase())
    lines.push(`${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone}`)
    if (resumeData.personalInfo.address) lines.push(resumeData.personalInfo.address)
    if (resumeData.personalInfo.linkedin) lines.push(`LinkedIn: ${resumeData.personalInfo.linkedin}`)
    if (resumeData.personalInfo.github) lines.push(`GitHub: ${resumeData.personalInfo.github}`)
    lines.push('')
    
    // Professional Summary - ATS keywords
    if (resumeData.summary) {
      lines.push('PROFESSIONAL SUMMARY')
      lines.push('─'.repeat(50))
      lines.push(resumeData.summary)
      lines.push('')
    }
    
    // Skills - Keyword section for ATS
    if (resumeData.skills.length > 0) {
      lines.push('TECHNICAL SKILLS')
      lines.push('─'.repeat(50))
      lines.push(resumeData.skills.join(' | '))
      lines.push('')
    }
    
    // Experience - Standard format
    if (resumeData.experience.some(e => e.company || e.position)) {
      lines.push('PROFESSIONAL EXPERIENCE')
      lines.push('─'.repeat(50))
      resumeData.experience.forEach((exp) => {
        if (exp.company || exp.position) {
          lines.push(`${exp.position} | ${exp.company}`)
          if (exp.startDate || exp.endDate) {
            lines.push(`${exp.startDate} - ${exp.endDate || 'Present'}`)
          }
          if (exp.description) {
            lines.push(exp.description)
          }
          lines.push('')
        }
      })
    }
    
    // Education
    if (resumeData.education.some(e => e.institution)) {
      lines.push('EDUCATION')
      lines.push('─'.repeat(50))
      resumeData.education.forEach((edu) => {
        if (edu.institution) {
          lines.push(`${edu.degree} in ${edu.field}`)
          lines.push(`${edu.institution}, ${edu.year}`)
          lines.push('')
        }
      })
    }
    
    // Achievements
    if (resumeData.achievements.length > 0) {
      lines.push('KEY ACHIEVEMENTS')
      lines.push('─'.repeat(50))
      resumeData.achievements.forEach((ach) => {
        lines.push(`• ${ach}`)
      })
    }
    
    return lines.join('\n')
  }

  const generateResumeText = (): string => {
    if (template.startsWith('ats-')) {
      return generateATSResume()
    }
    
    // Original format for non-ATS templates
    let text = `RESUME\n\n`
    text += `${resumeData.personalInfo.name}\n`
    text += `${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone}\n`
    if (resumeData.personalInfo.address) text += `${resumeData.personalInfo.address}\n`
    if (resumeData.personalInfo.linkedin) text += `LinkedIn: ${resumeData.personalInfo.linkedin}\n`
    if (resumeData.personalInfo.github) text += `GitHub: ${resumeData.personalInfo.github}\n`
    text += `\nSUMMARY\n${resumeData.summary}\n\n`
    
    text += `EXPERIENCE\n`
    resumeData.experience.forEach((exp) => {
      if (exp.company || exp.position) {
        text += `${exp.position} at ${exp.company}\n`
        text += `${exp.startDate} - ${exp.endDate}\n`
        text += `${exp.description}\n\n`
      }
    })
    
    text += `EDUCATION\n`
    resumeData.education.forEach((edu) => {
      if (edu.institution) {
        text += `${edu.degree} in ${edu.field}\n`
        text += `${edu.institution}, ${edu.year}\n\n`
      }
    })
    
    text += `SKILLS\n${resumeData.skills.join(', ')}\n\n`
    
    if (resumeData.achievements.length > 0) {
      text += `ACHIEVEMENTS\n`
      resumeData.achievements.forEach((ach) => {
        text += `• ${ach}\n`
      })
    }
    
    return text
  }

  const downloadResume = async () => {
    setLoading(true)
    try {
      // Generate AI-enhanced PDF resume from backend
      const response = await apiRoutes.ai.generateResumePDF(resumeData, template)
      
      // Create blob from response
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers['content-disposition']
      let filename = `${resumeData.personalInfo.name || 'resume'}_${template}_resume.pdf`
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }
      
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      alert('✅ PDF resume generated successfully!')
    } catch (error: any) {
      console.error('Failed to generate PDF:', error)
      const errorMessage = error.response?.data?.error || error.message || 'Failed to generate PDF resume'
      alert(`Error: ${errorMessage}\n\nPlease check:\n1. Backend is running on port 5001\n2. You have filled in resume data\n3. Try again`)
    } finally {
      setLoading(false)
    }
  }

  const downloadResumeOld = async () => {
    // Old client-side PDF generation (kept as fallback)
    setLoading(true)
    try {
      // Generate AI-enhanced resume
      const response = await apiRoutes.ai.generateResume(resumeData, template)
      if (!response.data.success) {
        throw new Error('Failed to generate resume')
      }

      const enhancedResume = response.data.data.resume
      const formattedResume = response.data.data.enhanced

      // Generate PDF using jsPDF
      let jsPDF
      try {
        const jspdfModule = await import('jspdf')
        jsPDF = jspdfModule.jsPDF || jspdfModule.default?.jsPDF || jspdfModule.default
      } catch (error) {
        throw new Error('jsPDF not available. Please install: npm install jspdf')
      }
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Set font
      doc.setFont('helvetica')

      // Colors
      const primaryColor = [0, 184, 212] // Cyan
      const secondaryColor = [139, 92, 246] // Purple
      const textColor = [51, 51, 51]
      const lightGray = [200, 200, 200]

      let yPos = 20

      // Header with gradient effect
      doc.setFillColor(...primaryColor)
      doc.rect(0, 0, 210, 50, 'F')
      
      // Name
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.text(enhancedResume.header.name || 'Your Name', 20, yPos + 15)

      // Contact Info
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const contactInfo = [
        enhancedResume.header.email,
        enhancedResume.header.phone,
        enhancedResume.header.address
      ].filter(Boolean).join(' | ')
      doc.text(contactInfo, 20, yPos + 25)

      // Links
      const links = []
      if (enhancedResume.header.linkedin) links.push(`LinkedIn: ${enhancedResume.header.linkedin}`)
      if (enhancedResume.header.github) links.push(`GitHub: ${enhancedResume.header.github}`)
      if (links.length > 0) {
        doc.text(links.join(' | '), 20, yPos + 30)
      }

      yPos = 60

      // Professional Summary
      if (enhancedResume.summary) {
        doc.setTextColor(...textColor)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.setFillColor(...primaryColor)
        doc.rect(20, yPos - 5, 170, 8, 'F')
        doc.setTextColor(255, 255, 255)
        doc.text('PROFESSIONAL SUMMARY', 20, yPos)
        
        doc.setTextColor(...textColor)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        const summaryLines = doc.splitTextToSize(enhancedResume.summary, 170)
        doc.text(summaryLines, 20, yPos + 10)
        yPos += 10 + (summaryLines.length * 5) + 5
      }

      // Technical Skills
      if (enhancedResume.skills && enhancedResume.skills.length > 0) {
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.setFillColor(...primaryColor)
        doc.rect(20, yPos - 5, 170, 8, 'F')
        doc.setTextColor(255, 255, 255)
        doc.text('TECHNICAL SKILLS', 20, yPos)
        
        doc.setTextColor(...textColor)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        const skillsText = enhancedResume.skills.join(' • ')
        const skillsLines = doc.splitTextToSize(skillsText, 170)
        doc.text(skillsLines, 20, yPos + 10)
        yPos += 10 + (skillsLines.length * 5) + 5
      }

      // Professional Experience
      if (enhancedResume.experience && enhancedResume.experience.length > 0) {
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.setFillColor(...primaryColor)
        doc.rect(20, yPos - 5, 170, 8, 'F')
        doc.setTextColor(255, 255, 255)
        doc.text('PROFESSIONAL EXPERIENCE', 20, yPos)
        yPos += 10

        doc.setTextColor(...textColor)
        for (const exp of enhancedResume.experience) {
          if (yPos > 270) {
            doc.addPage()
            yPos = 20
          }

          // Position and Company
          doc.setFontSize(12)
          doc.setFont('helvetica', 'bold')
          doc.text(`${exp.position}`, 20, yPos)
          
          doc.setFontSize(10)
          doc.setFont('helvetica', 'normal')
          doc.text(`${exp.company}`, 20, yPos + 5)
          
          // Period
          doc.setFont('helvetica', 'italic')
          doc.setTextColor(100, 100, 100)
          doc.text(exp.period, 20, yPos + 10)
          yPos += 12

          // Description
          if (exp.description) {
            doc.setTextColor(...textColor)
            doc.setFont('helvetica', 'normal')
            const descLines = doc.splitTextToSize(exp.description, 170)
            doc.text(descLines, 20, yPos)
            yPos += descLines.length * 5 + 5
          }
        }
        yPos += 5
      }

      // Education
      if (enhancedResume.education && enhancedResume.education.length > 0) {
        if (yPos > 250) {
          doc.addPage()
          yPos = 20
        }

        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.setFillColor(...primaryColor)
        doc.rect(20, yPos - 5, 170, 8, 'F')
        doc.setTextColor(255, 255, 255)
        doc.text('EDUCATION', 20, yPos)
        yPos += 10

        doc.setTextColor(...textColor)
        for (const edu of enhancedResume.education) {
          doc.setFontSize(11)
          doc.setFont('helvetica', 'bold')
          doc.text(`${edu.degree} in ${edu.field}`, 20, yPos)
          
          doc.setFontSize(10)
          doc.setFont('helvetica', 'normal')
          doc.text(`${edu.institution}, ${edu.year}`, 20, yPos + 5)
          yPos += 10
        }
        yPos += 5
      }

      // Key Achievements
      if (enhancedResume.achievements && enhancedResume.achievements.length > 0) {
        if (yPos > 250) {
          doc.addPage()
          yPos = 20
        }

        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.setFillColor(...primaryColor)
        doc.rect(20, yPos - 5, 170, 8, 'F')
        doc.setTextColor(255, 255, 255)
        doc.text('KEY ACHIEVEMENTS', 20, yPos)
        yPos += 10

        doc.setTextColor(...textColor)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        for (const achievement of enhancedResume.achievements) {
          doc.text(`• ${achievement}`, 20, yPos)
          yPos += 6
        }
      }

      // Save PDF
      const fileName = `${enhancedResume.header.name || 'resume'}_${template}_resume.pdf`
      doc.save(fileName)
    } catch (error: any) {
      console.error('Failed to generate PDF:', error)
      const errorMessage = error.response?.data?.error || error.message || 'Failed to generate PDF resume'
      alert(`Error: ${errorMessage}\n\nPlease check:\n1. Backend is running on port 5001\n2. You have filled in resume data\n3. Try again`)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedJob) {
      alert('Please select a job to apply for')
      return
    }
    
    if (!resumeData.personalInfo.email) {
      alert('Please provide your email address')
      return
    }
    
    setSubmitting(true)
    try {
      const finalResumeText = resumeInputMode === 'upload' ? resumeText : generateResumeText()
      const response = await apiRoutes.apply({
        name: resumeData.personalInfo.name || 'Candidate',
        email: resumeData.personalInfo.email || '',
        phone: resumeData.personalInfo.phone || '',
        job_id: selectedJob.id,
        resume_text: finalResumeText,
      })
      
      if (response.data.success) {
        const matchScore = response.data.data.match?.match_score || 0
        const emailSent = response.data.data.email_sent
        
        // Show success message with email confirmation
        const message = `✅ Application submitted successfully!\n\n` +
          `📊 Match Score: ${matchScore}%\n` +
          `${emailSent ? '📧 Confirmation email sent to ' + resumeData.personalInfo.email : '⚠️ Email notification could not be sent'}\n\n` +
          `Thank you for applying to ${selectedJob.title}!`
        
        alert(message)
        setShowSubmit(false)
        
        // Reset form after successful submission
        if (resumeInputMode === 'builder') {
          setResumeData({
            personalInfo: { name: '', email: '', phone: '', address: '', linkedin: '', github: '' },
            summary: '',
            experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
            education: [{ institution: '', degree: '', field: '', year: '' }],
            skills: [],
            achievements: [],
          })
        } else {
          setResumeText('')
          setUploadedFile(null)
          setUploadSuccess(false)
        }
        setSelectedJob(null)
        setMatchAnalysis(null)
      }
    } catch (error) {
      console.error('Failed to submit:', error)
      alert('Failed to submit resume. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const addSkill = () => {
    if (currentSkill.trim()) {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, currentSkill.trim()],
      })
      setCurrentSkill('')
    }
  }

  const removeSkill = (index: number) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((_, i) => i !== index),
    })
  }

  const addAchievement = () => {
    if (currentAchievement.trim()) {
      setResumeData({
        ...resumeData,
        achievements: [...resumeData.achievements, currentAchievement.trim()],
      })
      setCurrentAchievement('')
    }
  }

  const removeAchievement = (index: number) => {
    setResumeData({
      ...resumeData,
      achievements: resumeData.achievements.filter((_, i) => i !== index),
    })
  }

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, { company: '', position: '', startDate: '', endDate: '', description: '' }],
    })
  }

  const updateExperience = (index: number, field: string, value: string) => {
    const updated = [...resumeData.experience]
    updated[index] = { ...updated[index], [field]: value }
    setResumeData({ ...resumeData, experience: updated })
  }

  const removeExperience = (index: number) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((_, i) => i !== index),
    })
  }

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, { institution: '', degree: '', field: '', year: '' }],
    })
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...resumeData.education]
    updated[index] = { ...updated[index], [field]: value }
    setResumeData({ ...resumeData, education: updated })
  }

  const removeEducation = (index: number) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <SectionHeader
        title="Resume Builder & Job Match Analyzer"
        subtitle="Create ATS-optimized resumes and analyze job matches with AI"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Resume Input Mode Selection */}
          <GlassCard>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setResumeInputMode('builder')}
                className={`flex-1 px-4 py-3 rounded-lg transition-all ${
                  resumeInputMode === 'builder'
                    ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                    : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
                }`}
              >
                <FileText className="mx-auto mb-2" size={24} />
                Build Resume
              </button>
              <button
                onClick={() => setResumeInputMode('upload')}
                className={`flex-1 px-4 py-3 rounded-lg transition-all ${
                  resumeInputMode === 'upload'
                    ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                    : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
                }`}
              >
                <Upload className="mx-auto mb-2" size={24} />
                Upload/Input Resume
              </button>
            </div>

            {resumeInputMode === 'upload' ? (
              <div className="space-y-6">
                {/* PDF Upload Section */}
                <div>
                  <h3 className="text-xl font-bold mb-4 neon-text flex items-center gap-2">
                    <File className="text-cyan-400" size={24} />
                    Upload Your Resume (PDF/DOCX)
                  </h3>
                  
                  {/* Drag and Drop Zone */}
                  <div
                    onDragEnter={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setDragActive(true)
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setDragActive(false)
                    }}
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setDragActive(false)
                      const files = Array.from(e.dataTransfer.files)
                      if (files.length > 0) {
                        handleFileUpload(files[0])
                      }
                    }}
                    className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                      dragActive
                        ? 'border-cyan-400 bg-cyan-400/10 scale-105'
                        : 'border-white/30 bg-white/5 hover:border-cyan-400/50 hover:bg-cyan-400/5'
                    }`}
                  >
                    <input
                      type="file"
                      id="resume-upload"
                      accept=".pdf,.docx,.doc"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file)
                      }}
                      className="hidden"
                    />
                    
                    {uploading ? (
                      <div className="space-y-4">
                        <Loader2 className="mx-auto animate-spin text-cyan-400" size={48} />
                        <p className="text-gray-300">Processing your resume...</p>
                      </div>
                    ) : uploadSuccess ? (
                      <div className="space-y-4">
                        <CheckCircle className="mx-auto text-green-400" size={48} />
                        <p className="text-green-400 font-semibold">Resume processed successfully!</p>
                        {uploadedFile && (
                          <p className="text-gray-400 text-sm">{uploadedFile.name}</p>
                        )}
                        <button
                          onClick={() => {
                            setUploadedFile(null)
                            setUploadSuccess(false)
                            setResumeText('')
                          }}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm"
                        >
                          Upload Another File
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-full flex items-center justify-center">
                          <Upload className="text-cyan-400" size={40} />
                        </div>
                        <div>
                          <p className="text-white text-lg font-semibold mb-2">
                            Drag & drop your resume here
                          </p>
                          <p className="text-gray-400 text-sm mb-4">
                            or click to browse
                          </p>
                          <label
                            htmlFor="resume-upload"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg cursor-pointer hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                          >
                            <File className="inline mr-2" size={18} />
                            Choose File
                          </label>
                          <p className="text-gray-500 text-xs mt-3">
                            Supported formats: PDF, DOCX, DOC (Max 10MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Input Fallback */}
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-300 flex items-center gap-2">
                    <FileText size={20} />
                    Or Paste Resume Text
                  </h3>
                  <textarea
                    value={resumeText}
                    onChange={(e) => {
                      setResumeText(e.target.value)
                      parseResumeText(e.target.value)
                    }}
                    rows={12}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 font-mono text-sm resize-none"
                    placeholder="Paste your resume content here. We'll analyze it and extract information automatically..."
                  />
                  <button
                    onClick={() => parseResumeText(resumeText)}
                    className="mt-3 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-purple-400 text-sm transition-all"
                  >
                    <Sparkles className="inline mr-2" size={16} />
                    Auto-Parse Resume Text
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Template Selection */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3 neon-text">Select ATS Template</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {RESUME_TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTemplate(t.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          template === t.id
                            ? 'border-cyan-400 bg-cyan-400/20'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <div className="font-semibold text-white text-sm">{t.name}</div>
                        <div className="text-xs text-gray-400">{t.description}</div>
                        {t.atsOptimized && (
                          <div className="text-xs text-green-400 mt-1">✓ ATS Optimized</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-bold mb-3 neon-text">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={resumeData.personalInfo.name}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, name: e.target.value },
                        })
                      }
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    />
                    <input
                      type="email"
                      placeholder="Email *"
                      value={resumeData.personalInfo.email}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, email: e.target.value },
                        })
                      }
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    />
                    <input
                      type="tel"
                      placeholder="Phone *"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, phone: e.target.value },
                        })
                      }
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={resumeData.personalInfo.address}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, address: e.target.value },
                        })
                      }
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    />
                    <input
                      type="text"
                      placeholder="LinkedIn URL"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value },
                        })
                      }
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    />
                    <input
                      type="text"
                      placeholder="GitHub URL"
                      value={resumeData.personalInfo.github}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, github: e.target.value },
                        })
                      }
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h3 className="text-xl font-bold mb-3 neon-text">Professional Summary</h3>
                  <textarea
                    placeholder="Write a brief summary optimized with relevant keywords..."
                    value={resumeData.summary}
                    onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Experience */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold neon-text">Experience</h3>
                    <button
                      onClick={addExperience}
                      className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400 text-sm"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="space-y-4">
                    {resumeData.experience.map((exp, index) => (
                      <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <input
                            type="text"
                            placeholder="Company *"
                            value={exp.company}
                            onChange={(e) => updateExperience(index, 'company', e.target.value)}
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                          />
                          <input
                            type="text"
                            placeholder="Position *"
                            value={exp.position}
                            onChange={(e) => updateExperience(index, 'position', e.target.value)}
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                          />
                          <input
                            type="text"
                            placeholder="Start Date (MM/YYYY)"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                          />
                          <input
                            type="text"
                            placeholder="End Date (MM/YYYY) or Present"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                        <textarea
                          placeholder="Description with keywords and achievements..."
                          value={exp.description}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 mb-2"
                        />
                        {resumeData.experience.length > 1 && (
                          <button
                            onClick={() => removeExperience(index)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold neon-text">Education</h3>
                    <button
                      onClick={addEducation}
                      className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400 text-sm"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="space-y-4">
                    {resumeData.education.map((edu, index) => (
                      <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Institution *"
                            value={edu.institution}
                            onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                          />
                          <input
                            type="text"
                            placeholder="Degree *"
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                          />
                          <input
                            type="text"
                            placeholder="Field of Study"
                            value={edu.field}
                            onChange={(e) => updateEducation(index, 'field', e.target.value)}
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                          />
                          <input
                            type="text"
                            placeholder="Year"
                            value={edu.year}
                            onChange={(e) => updateEducation(index, 'year', e.target.value)}
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                        {resumeData.education.length > 1 && (
                          <button
                            onClick={() => removeEducation(index)}
                            className="mt-2 text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-xl font-bold mb-3 neon-text">Skills (Keywords for ATS)</h3>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Add a skill"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      onClick={addSkill}
                      className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-400"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(index)}
                          className="text-cyan-400 hover:text-red-400"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-xl font-bold mb-3 neon-text">Key Achievements</h3>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Add an achievement"
                      value={currentAchievement}
                      onChange={(e) => setCurrentAchievement(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      onClick={addAchievement}
                      className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {resumeData.achievements.map((achievement, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                      >
                        <span className="text-gray-300">• {achievement}</span>
                        <button
                          onClick={() => removeAchievement(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </GlassCard>
        </div>

        {/* Sidebar - Job Selection & Match Analysis */}
        <div className="lg:col-span-1 space-y-6">
          {/* Job Selection */}
          <GlassCard className="sticky top-20">
            <h3 className="text-xl font-bold mb-4 neon-text">Select Job to Analyze</h3>
            
            {jobs.length > 0 ? (
              <select
                value={selectedJob?.id || ''}
                onChange={(e) => {
                  const job = jobs.find((j) => j.id === parseInt(e.target.value))
                  setSelectedJob(job || null)
                  setMatchAnalysis(null)
                }}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400 mb-4"
              >
                <option value="">Select a job...</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-400 text-sm mb-4">No jobs available</p>
            )}

            {/* Match Analysis */}
            {selectedJob && (
              <div className="mt-4">
                {analyzing ? (
                  <div className="text-center py-4">
                    <Loader2 className="animate-spin mx-auto text-cyan-400 mb-2" size={24} />
                    <p className="text-gray-400 text-sm">Analyzing match...</p>
                  </div>
                ) : matchAnalysis ? (
                  <div className="space-y-4">
                    {/* Match Score */}
                    <div className={`p-4 rounded-lg border-2 ${
                      matchAnalysis.match_score >= 80
                        ? 'bg-green-500/20 border-green-500/50'
                        : matchAnalysis.match_score >= 60
                        ? 'bg-yellow-500/20 border-yellow-500/50'
                        : 'bg-red-500/20 border-red-500/50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">Match Score</span>
                        <span className={`text-2xl font-bold ${
                          matchAnalysis.match_score >= 80
                            ? 'text-green-400'
                            : matchAnalysis.match_score >= 60
                            ? 'text-yellow-400'
                            : 'text-red-400'
                        }`}>
                          {matchAnalysis.match_score}%
                        </span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            matchAnalysis.match_score >= 80
                              ? 'bg-green-400'
                              : matchAnalysis.match_score >= 60
                              ? 'bg-yellow-400'
                              : 'bg-red-400'
                          }`}
                          style={{ width: `${matchAnalysis.match_score}%` }}
                        />
                      </div>
                    </div>

                    {/* Matched Skills */}
                    {matchAnalysis.matched_skills.length > 0 && (
                      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="text-green-400" size={16} />
                          <span className="text-green-400 font-semibold text-sm">Matched Skills</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {matchAnalysis.matched_skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-green-500/20 border border-green-500/50 rounded text-xs text-green-400"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing Skills */}
                    {matchAnalysis.missing_skills.length > 0 && (
                      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="text-yellow-400" size={16} />
                          <span className="text-yellow-400 font-semibold text-sm">Consider Adding</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {matchAnalysis.missing_skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded text-xs text-yellow-400"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {matchAnalysis.recommendations.length > 0 && (
                      <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="text-purple-400" size={16} />
                          <span className="text-purple-400 font-semibold text-sm">Recommendations</span>
                        </div>
                        <ul className="space-y-1">
                          {matchAnalysis.recommendations.map((rec, i) => (
                            <li key={i} className="text-xs text-gray-300">• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Analysis */}
                    {matchAnalysis.analysis && (
                      <div className="p-3 bg-white/5 border border-white/20 rounded-lg">
                        <p className="text-xs text-gray-300">{matchAnalysis.analysis}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    {resumeInputMode === 'upload' 
                      ? (resumeText.trim() ? 'Enter resume text to analyze' : 'Add resume content to see match analysis')
                      : (resumeData.personalInfo.name ? 'Enter more details to analyze' : 'Fill in resume details to see match analysis')
                    }
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <NeonButton
                onClick={downloadResume}
                className="w-full flex items-center justify-center gap-2"
                disabled={resumeInputMode === 'builder' && !resumeData.personalInfo.name}
              >
                <Download size={20} />
                Download ATS Resume
              </NeonButton>

              {selectedJob && (
                <NeonButton
                  onClick={() => setShowSubmit(true)}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600"
                  disabled={resumeInputMode === 'upload' ? !resumeText.trim() : !resumeData.personalInfo.name}
                >
                  <Send size={20} />
                  Apply for Job
                </NeonButton>
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmit && selectedJob && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => !submitting && setShowSubmit(false)}
        >
          <GlassCard className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-4 neon-text">Confirm Application</h3>
            <p className="text-gray-300 mb-2">
              Apply for <strong>{selectedJob.title}</strong>?
            </p>
            {matchAnalysis && (
              <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="text-sm text-gray-300">
                  Your resume matches this job at <strong>{matchAnalysis.match_score}%</strong>
                </p>
              </div>
            )}
            <div className="flex gap-4">
              <NeonButton onClick={handleSubmit} disabled={submitting} className="flex-1">
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={20} className="mr-2" />
                    Submit Application
                  </>
                )}
              </NeonButton>
              <button
                onClick={() => setShowSubmit(false)}
                className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  )
}
