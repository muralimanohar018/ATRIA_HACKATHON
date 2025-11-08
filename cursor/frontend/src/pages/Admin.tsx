import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import GlassCard from '../components/common/GlassCard'
import NeonButton from '../components/common/NeonButton'
import { apiRoutes, type Job } from '../lib/api'
import { Plus, Loader2, Briefcase, FileText, Users, Download, Eye, BarChart, Sparkles, TrendingUp } from 'lucide-react'

export default function Admin() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [, setCheckingAuth] = useState(true)
  const [showJobForm, setShowJobForm] = useState(false)
  const [showBlogForm, setShowBlogForm] = useState(false)
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    location: 'Remote',
  })
  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterMatch, setFilterMatch] = useState<number>(0)
  const [analytics, setAnalytics] = useState<any>(null)
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (authenticated) {
      loadData()
    }
  }, [authenticated])

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      setCheckingAuth(false)
      navigate('/login')
      return
    }

    try {
      const response = await apiRoutes.auth.verify()
      if (response.data.success && response.data.data.valid) {
        setAuthenticated(true)
        // User data stored in localStorage, no need for state
      } else {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        navigate('/login')
      }
    } catch (error) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      navigate('/login')
    } finally {
      setCheckingAuth(false)
    }
  }

  // Logout handled via localStorage removal and navigation

  const loadData = async () => {
    setLoading(true)
    try {
      const [jobsRes, appsRes, analyticsRes] = await Promise.all([
        apiRoutes.admin.jobs.list(),
        apiRoutes.admin.applications.list(),
        apiRoutes.admin.analytics(),
      ])
      if (jobsRes.data.success) {
        setJobs(jobsRes.data.data)
      }
      if (appsRes.data.success) {
        setApplications(appsRes.data.data)
      }
      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.data)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAnalytics = async () => {
    setLoadingAnalytics(true)
    try {
      const response = await apiRoutes.admin.analytics()
      if (response.data.success) {
        setAnalytics(response.data.data)
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoadingAnalytics(false)
    }
  }

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await apiRoutes.admin.jobs.create(jobForm)
      if (response.data.success) {
        setJobForm({ title: '', description: '', location: 'Remote' })
        setShowJobForm(false)
        loadData()
      }
    } catch (error) {
      console.error('Failed to create job:', error)
      alert('Failed to create job')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await apiRoutes.admin.blogs.create(blogForm)
      if (response.data.success) {
        setBlogForm({ title: '', content: '' })
        setShowBlogForm(false)
        alert('Blog created successfully!')
        loadData() // Reload data to show new blog
      }
    } catch (error: any) {
      console.error('Failed to create blog:', error)
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create blog'
      alert(`Error: ${errorMessage}\n\nPlease check:\n1. Backend is running on port 5001\n2. Title and content are filled\n3. You are logged in as admin\n4. Try again`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-20">
      {/* Analytics Dashboard */}
      <GlassCard className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold neon-text flex items-center gap-2">
            <BarChart size={28} />
            Analytics Dashboard
          </h2>
          <button
            onClick={loadAnalytics}
            disabled={loadingAnalytics}
            className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400 disabled:opacity-50 flex items-center gap-2"
          >
            {loadingAnalytics ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Loading...
              </>
            ) : (
              <>
                <TrendingUp size={16} />
                Refresh Analytics
              </>
            )}
          </button>
        </div>

        {analytics ? (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold neon-text">{analytics.stats?.jobs || 0}</div>
                <div className="text-sm text-gray-400">Jobs Posted</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold neon-text">{analytics.stats?.applications || 0}</div>
                <div className="text-sm text-gray-400">Applications</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold neon-text">{analytics.stats?.blogs || 0}</div>
                <div className="text-sm text-gray-400">Blog Posts</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold neon-text">{analytics.stats?.contacts || 0}</div>
                <div className="text-sm text-gray-400">Contacts</div>
              </div>
            </div>

            {/* Application Match Analysis */}
            {analytics.applications && (
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-xl font-bold mb-4 neon-text">Application Match Analysis</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-lg font-semibold text-cyan-400">{analytics.applications.average_match}%</div>
                    <div className="text-sm text-gray-400">Avg Match Score</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-400">{analytics.applications.high_match}</div>
                    <div className="text-sm text-gray-400">High Match (80%+)</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-yellow-400">{analytics.applications.medium_match}</div>
                    <div className="text-sm text-gray-400">Medium (60-79%)</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-red-400">{analytics.applications.low_match}</div>
                    <div className="text-sm text-gray-400">Low Match (&lt;60%)</div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Summary */}
            {analytics.ai_summary && (
              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="text-purple-400" size={20} />
                  <h3 className="text-lg font-bold text-purple-400">AI-Generated Summary</h3>
                </div>
                <p className="text-gray-300">{analytics.ai_summary}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">Click "Refresh Analytics" to load dashboard data</p>
          </div>
        )}
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassCard className="text-center">
          <Briefcase className="text-cyan-400 mx-auto mb-4" size={40} />
          <div className="text-3xl font-bold neon-text mb-2">{jobs.length}</div>
          <div className="text-gray-300">Active Jobs</div>
        </GlassCard>
        <GlassCard className="text-center">
          <Users className="text-purple-400 mx-auto mb-4" size={40} />
          <div className="text-3xl font-bold neon-text mb-2">{applications.length}</div>
          <div className="text-gray-300">Applications</div>
        </GlassCard>
        <GlassCard className="text-center">
          <FileText className="text-pink-400 mx-auto mb-4" size={40} />
          <div className="text-3xl font-bold neon-text mb-2">-</div>
          <div className="text-gray-300">Blog Posts</div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <GlassCard>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold neon-text">Jobs</h3>
            <NeonButton onClick={() => setShowJobForm(!showJobForm)}>
              <Plus size={20} className="mr-2" />
              Add Job
            </NeonButton>
          </div>

          {showJobForm && (
            <form onSubmit={handleCreateJob} className="space-y-4 mb-4">
              <input
                type="text"
                placeholder="Job Title"
                value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                required
                disabled={submitting}
              />
              <textarea
                placeholder="Job Description"
                value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                required
                disabled={submitting}
              />
              <input
                type="text"
                placeholder="Location"
                value={jobForm.location}
                onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                required
                disabled={submitting}
              />
              <div className="flex gap-4">
                <NeonButton type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Creating...
                    </>
                  ) : (
                    'Create Job'
                  )}
                </NeonButton>
                <button
                  type="button"
                  onClick={() => setShowJobForm(false)}
                  className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="animate-spin mx-auto text-cyan-400" size={24} />
            </div>
          ) : (
            <div className="space-y-2">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="font-semibold text-white">{job.title}</div>
                  <div className="text-sm text-gray-400">{job.location}</div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold neon-text">Create Blog</h3>
            <NeonButton onClick={() => setShowBlogForm(!showBlogForm)}>
              <Plus size={20} className="mr-2" />
              New Post
            </NeonButton>
          </div>

          {showBlogForm && (
            <form onSubmit={handleCreateBlog} className="space-y-4">
              <input
                type="text"
                placeholder="Blog Title"
                value={blogForm.title}
                onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                required
                disabled={submitting}
              />
              <textarea
                placeholder="Blog Content (AI will generate summary and SEO)"
                value={blogForm.content}
                onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                rows={8}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                required
                disabled={submitting}
              />
              <div className="flex gap-4">
                <NeonButton type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Creating...
                    </>
                  ) : (
                    'Create Blog'
                  )}
                </NeonButton>
                <button
                  type="button"
                  onClick={() => setShowBlogForm(false)}
                  className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </GlassCard>
      </div>

      <GlassCard>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold neon-text">Resume Filtering & Applications</h3>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Status</option>
              <option value="applied">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={filterMatch}
              onChange={(e) => setFilterMatch(parseInt(e.target.value))}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="0">All Match Scores</option>
              <option value="70">70%+ Match</option>
              <option value="80">80%+ Match</option>
              <option value="90">90%+ Match</option>
            </select>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="animate-spin mx-auto text-cyan-400" size={24} />
          </div>
        ) : applications.length === 0 ? (
          <p className="text-gray-300">No applications yet</p>
        ) : (
          <div className="space-y-4">
            {applications
              .filter((app) => {
                if (filterStatus !== 'all' && app.status !== filterStatus) return false
                if (filterMatch > 0 && app.ai_match?.match_score < filterMatch) return false
                return true
              })
              .map((app) => (
                <div
                  key={app.id}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-400/50 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold text-white text-lg">{app.name}</div>
                      <div className="text-sm text-gray-400">{app.email}</div>
                      <div className="text-sm text-gray-400">Job ID: {app.job_id}</div>
                      <div className="mt-2 text-xs text-gray-500">
                        Applied: {new Date(app.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right flex items-start gap-4">
                      <div>
                        {app.ai_match && (
                          <div className={`font-semibold mb-1 ${
                            app.ai_match.match_score >= 80
                              ? 'text-green-400'
                              : app.ai_match.match_score >= 60
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }`}>
                            Match: {app.ai_match.match_score}%
                          </div>
                        )}
                        <div className="text-sm text-gray-400 capitalize">{app.status}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400"
                          title="View Resume"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => {
                            const blob = new Blob([app.resume_text || ''], { type: 'text/plain' })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `${app.name}_resume.txt`
                            a.click()
                            URL.revokeObjectURL(url)
                          }}
                          className="p-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-purple-400"
                          title="Download Resume"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                  {app.ai_match?.matched_skills && app.ai_match.matched_skills.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="text-xs text-gray-400 mb-1">Matched Skills:</div>
                      <div className="flex flex-wrap gap-1">
                        {app.ai_match.matched_skills.map((skill: string, i: number) => (
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
                </div>
              ))}
          </div>
        )}
      </GlassCard>

      {selectedApplication && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedApplication(null)}
        >
          <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <GlassCard>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold neon-text">{selectedApplication.name}</h3>
                <div className="text-gray-400">{selectedApplication.email}</div>
                {selectedApplication.ai_match && (
                  <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedApplication.ai_match.match_score >= 80
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                        : selectedApplication.ai_match.match_score >= 60
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                        : 'bg-red-500/20 text-red-400 border border-red-500/50'
                    }`}>
                      AI Match Score: {selectedApplication.ai_match.match_score}%
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-300 bg-white/5 p-4 rounded-lg border border-white/10">
                {selectedApplication.resume_text || 'No resume text available'}
              </pre>
            </div>
            </GlassCard>
          </div>
        </motion.div>
      )}
    </div>
  )
}

