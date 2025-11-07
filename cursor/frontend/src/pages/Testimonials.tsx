import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '../components/common/SectionHeader'
import GlassCard from '../components/common/GlassCard'
import NeonButton from '../components/common/NeonButton'
import { apiRoutes } from '../lib/api'
import { Sparkles, Plus, Loader2, MessageSquare, FileText, Upload, Zap } from 'lucide-react'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [caseStudies, setCaseStudies] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showTestimonialForm, setShowTestimonialForm] = useState(false)
  const [showCaseStudyForm, setShowCaseStudyForm] = useState(false)
  const [testimonialForm, setTestimonialForm] = useState({
    raw_text: '',
    author: '',
  })
  const [caseStudyForm, setCaseStudyForm] = useState({
    content: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [testRes, caseRes] = await Promise.all([
        apiRoutes.testimonials.list(),
        apiRoutes.caseStudies.list(),
      ])
      if (testRes.data.success) {
        setTestimonials(testRes.data.data)
      }
      if (caseRes.data.success) {
        setCaseStudies(caseRes.data.data)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!testimonialForm.raw_text.trim()) return

    setSubmitting(true)
    try {
      const response = await apiRoutes.testimonials.create(testimonialForm)
      if (response.data.success) {
        setTestimonialForm({ raw_text: '', author: '' })
        setShowTestimonialForm(false)
        loadData()
        alert('✅ Testimonial created with AI enhancement!')
      }
    } catch (error: any) {
      console.error('Failed to create testimonial:', error)
      alert(`Error: ${error.response?.data?.error || error.message || 'Failed to create testimonial'}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCaseStudySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!caseStudyForm.content.trim()) return

    setSubmitting(true)
    try {
      const response = await apiRoutes.caseStudies.analyze(caseStudyForm)
      if (response.data.success) {
        setCaseStudyForm({ content: '' })
        setShowCaseStudyForm(false)
        loadData()
        alert('✅ Case study analyzed with AI!')
      }
    } catch (error: any) {
      console.error('Failed to analyze case study:', error)
      alert(`Error: ${error.response?.data?.error || error.message || 'Failed to analyze case study'}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <SectionHeader
        title="Testimonials & Case Studies"
        subtitle="Client success stories and AI-powered insights"
      />

      <div className="mb-8 flex gap-4 justify-center flex-wrap">
        <NeonButton onClick={() => setShowTestimonialForm(!showTestimonialForm)}>
          <Plus size={20} className="mr-2" />
          Add Testimonial
        </NeonButton>
        <NeonButton onClick={() => setShowCaseStudyForm(!showCaseStudyForm)}>
          <Upload size={20} className="mr-2" />
          Upload Case Study
        </NeonButton>
      </div>

      {showTestimonialForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <GlassCard>
            <h3 className="text-2xl font-bold mb-4 neon-text">Create Testimonial (AI-Enhanced)</h3>
            <form onSubmit={handleTestimonialSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Author Name (optional)"
                value={testimonialForm.author}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, author: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                disabled={submitting}
              />
              <textarea
                placeholder="Raw testimonial text (AI will enhance and rephrase it)"
                value={testimonialForm.raw_text}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, raw_text: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                required
                disabled={submitting}
              />
              <div className="flex gap-4">
                <NeonButton type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} className="mr-2" />
                      AI Enhance & Save
                    </>
                  )}
                </NeonButton>
                <button
                  type="button"
                  onClick={() => {
                    setShowTestimonialForm(false)
                    setTestimonialForm({ raw_text: '', author: '' })
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white"
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      )}

      {showCaseStudyForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <GlassCard>
            <h3 className="text-2xl font-bold mb-4 neon-text">Upload Case Study (AI Analysis)</h3>
            <form onSubmit={handleCaseStudySubmit} className="space-y-4">
              <textarea
                placeholder="Case study content (AI will analyze and generate summary)"
                value={caseStudyForm.content}
                onChange={(e) => setCaseStudyForm({ ...caseStudyForm, content: e.target.value })}
                rows={10}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                required
                disabled={submitting}
              />
              <div className="flex gap-4">
                <NeonButton type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap size={20} className="mr-2" />
                      AI Analyze & Save
                    </>
                  )}
                </NeonButton>
                <button
                  type="button"
                  onClick={() => {
                    setShowCaseStudyForm(false)
                    setCaseStudyForm({ content: '' })
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white"
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      )}

      {/* Testimonials Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 neon-text flex items-center gap-2">
          <MessageSquare size={28} />
          Testimonials
        </h2>
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="animate-spin mx-auto text-cyan-400" size={32} />
          </div>
        ) : testimonials.length === 0 ? (
          <GlassCard className="text-center py-8">
            <p className="text-gray-300">No testimonials yet. Add one above!</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard className="h-full">
                  <div className="flex items-start gap-2 mb-3">
                    <Sparkles className="text-purple-400 flex-shrink-0 mt-1" size={20} />
                    <p className="text-gray-300 italic leading-relaxed">{testimonial.polished_text}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-sm font-semibold text-cyan-400">— {testimonial.author || 'Anonymous'}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(testimonial.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Case Studies Section */}
      <div>
        <h2 className="text-3xl font-bold mb-6 neon-text flex items-center gap-2">
          <FileText size={28} />
          Case Studies
        </h2>
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="animate-spin mx-auto text-cyan-400" size={32} />
          </div>
        ) : caseStudies.length === 0 ? (
          <GlassCard className="text-center py-8">
            <p className="text-gray-300">No case studies yet. Upload one above!</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {caseStudies.map((caseStudy, index) => (
              <motion.div
                key={caseStudy.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard>
                  <div className="mb-4">
                    <div className="text-xs text-gray-400 mb-2">
                      {new Date(caseStudy.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-gray-300 whitespace-pre-wrap mb-4">{caseStudy.content}</div>
                  </div>
                  {caseStudy.ai_analysis && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="text-yellow-400" size={18} />
                        <h4 className="font-semibold text-yellow-400">AI Analysis:</h4>
                      </div>
                      <div className="text-sm text-gray-300 bg-white/5 p-4 rounded-lg border border-white/10">
                        {typeof caseStudy.ai_analysis === 'string' 
                          ? caseStudy.ai_analysis 
                          : JSON.stringify(caseStudy.ai_analysis, null, 2)}
                      </div>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

