import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '../components/common/SectionHeader'
import GlassCard from '../components/common/GlassCard'
import NeonButton from '../components/common/NeonButton'
import { apiRoutes, type Job } from '../lib/api'
import { MapPin, Loader2, CheckCircle, XCircle, FileText, Download, Upload } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Careers() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume_text: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [generatingPDF, setGeneratingPDF] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    match?: any
    email_sent?: boolean
  } | null>(null)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    setLoading(true)
    try {
      const response = await apiRoutes.jobs.list()
      if (response.data.success) {
        setJobs(response.data.data)
      }
    } catch (error) {
      console.error('Failed to load jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePDFResume = async () => {
    if (!formData.name || !formData.resume_text.trim()) {
      alert('Please fill in your name and resume text to generate PDF')
      return
    }

    setGeneratingPDF(true)
    try {
      // Parse resume text to create resume data structure
      const resumeData = {
        personalInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '',
          address: '',
          linkedin: '',
          github: '',
        },
        summary: formData.resume_text.split('\n').slice(0, 3).join(' ').substring(0, 200),
        experience: [],
        education: [],
        skills: [],
        achievements: [],
      }

      // Generate AI-enhanced PDF resume from backend with email
      const sendEmail = !!formData.email
      const response = await apiRoutes.ai.generateResumePDF(
        resumeData, 
        'ats-modern',
        sendEmail,  // send email if email provided
        formData.email  // user email
      )
      
      // Create blob from response
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers['content-disposition']
      let filename = `${formData.name.replace(/\s+/g, '_')}_resume.pdf`
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
      
      if (sendEmail && formData.email) {
        alert('✅ PDF resume generated and sent to your email!')
      } else {
        alert('✅ PDF resume generated successfully!')
      }
    } catch (error: any) {
      console.error('Failed to generate PDF:', error)
      alert(`Failed to generate PDF: ${error.message || 'Unknown error'}\n\nPlease check:\n1. Backend is running\n2. Resume text is filled\n3. Try again`)
    } finally {
      setGeneratingPDF(false)
    }
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJob || !formData.name || !formData.email || !formData.resume_text) return

    setSubmitting(true)
    setResult(null)
    try {
      const response = await apiRoutes.apply({
        ...formData,
        job_id: selectedJob.id,
      })
      if (response.data.success) {
        setResult({
          success: true,
          match: response.data.data.match,
          email_sent: response.data.data.email_sent,
        })
        // Don't clear form immediately - let user download PDF first
        setTimeout(() => {
          setFormData({ name: '', email: '', phone: '', resume_text: '' })
          setShowForm(false)
          setSelectedJob(null)
          setResult(null)
        }, 10000) // Extended timeout to allow PDF download
      }
    } catch (error: any) {
      setResult({
        success: false,
      })
      console.error('Failed to apply:', error)
      alert(`Failed to submit application: ${error.response?.data?.error || error.message || 'Unknown error'}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <SectionHeader
        title="Careers"
        subtitle="Join our team and build the future with AI"
      />

      <div className="mb-8 flex justify-center gap-4 items-center flex-wrap">
        <Link to="/resume-builder">
          <NeonButton className="flex items-center gap-2">
            <FileText size={20} />
            Build Your Resume with AI
          </NeonButton>
        </Link>
        <div className="text-sm text-gray-400 flex items-center">
          <Upload size={16} className="mr-2" />
          Or paste your resume text when applying
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="animate-spin mx-auto text-cyan-400" size={40} />
        </div>
      ) : jobs.length === 0 ? (
        <GlassCard className="text-center py-12">
          <p className="text-gray-300 text-lg">No job openings at the moment. Check back soon!</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard className="h-full">
                <h3 className="text-2xl font-bold mb-2 neon-text">{job.title}</h3>
                <div className="flex items-center gap-2 text-gray-300 mb-4">
                  <MapPin size={16} />
                  {job.location}
                </div>
                <p className="text-gray-300 mb-4 line-clamp-3">{job.description}</p>
                <NeonButton
                  onClick={() => {
                    setSelectedJob(job)
                    setShowForm(true)
                    setResult(null)
                  }}
                >
                  Apply Now
                </NeonButton>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {showForm && selectedJob && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => {
            if (!submitting) {
              setShowForm(false)
              setSelectedJob(null)
            }
          }}
        >
          <GlassCard
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold mb-2 neon-text">
              Apply for {selectedJob.title}
            </h2>
            <p className="text-gray-300 mb-6">{selectedJob.location}</p>

            {result && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  result.success
                    ? 'bg-green-500/20 border border-green-500/50'
                    : 'bg-red-500/20 border border-red-500/50'
                }`}
              >
                {result.success ? (
                  <div>
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <CheckCircle size={20} />
                      <span className="font-semibold">Application Submitted Successfully!</span>
                    </div>
                    {result.match && (
                      <div className="text-white mb-3">
                        <div className="text-lg font-semibold mb-1">
                          AI Match Score: {result.match.match_score}%
                        </div>
                        {result.match.matched_skills && result.match.matched_skills.length > 0 && (
                          <div className="text-sm text-gray-300 mb-2">
                            Matched Skills: {result.match.matched_skills.join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                    {result.email_sent && (
                      <div className="text-green-400 text-sm mb-3">
                        ✅ Confirmation email sent to {formData.email}!
                      </div>
                    )}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-white font-semibold mb-2">📄 Download Your Resume PDF:</p>
                      <button
                        onClick={generatePDFResume}
                        disabled={generatingPDF || !formData.name || !formData.resume_text.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {generatingPDF ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            Generating PDF...
                          </>
                        ) : (
                          <>
                            <Download size={18} />
                            Download PDF Resume
                          </>
                        )}
                      </button>
                      <p className="text-xs text-gray-400 mt-2">
                        Your AI-enhanced resume in PDF format
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-400">
                    <XCircle size={20} />
                    <span>Failed to submit application. Please try again.</span>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                required
                disabled={submitting}
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                required
                disabled={submitting}
              />
              <input
                type="tel"
                placeholder="Phone (Optional)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                disabled={submitting}
              />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-gray-300 text-sm">Resume Text</label>
                  <button
                    type="button"
                    onClick={generatePDFResume}
                    disabled={generatingPDF || !formData.name || !formData.resume_text.trim()}
                    className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-purple-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {generatingPDF ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        Generate PDF Resume
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  placeholder="Paste your resume text here... (You can generate a PDF before submitting)"
                  value={formData.resume_text}
                  onChange={(e) => setFormData({ ...formData, resume_text: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 font-mono text-sm"
                  required
                  disabled={submitting}
                />
                <p className="text-xs text-gray-400 mt-1">
                  💡 Tip: Generate PDF resume before submitting to review it
                </p>
              </div>
              <div className="flex gap-4">
                <NeonButton type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </NeonButton>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setSelectedJob(null)
                    setResult(null)
                  }}
                  className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      )}
    </div>
  )
}

