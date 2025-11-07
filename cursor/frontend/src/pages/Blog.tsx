import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '../components/common/SectionHeader'
import GlassCard from '../components/common/GlassCard'
import NeonButton from '../components/common/NeonButton'
import { apiRoutes } from '../lib/api'
import { Sparkles, Plus, Loader2, Zap } from 'lucide-react'
import type { BlogPost } from '../lib/api'

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [summarizing, setSummarizing] = useState<number | null>(null)
  const [summaries, setSummaries] = useState<Record<number, string>>({})

  useEffect(() => {
    loadBlogs()
  }, [])

  const loadBlogs = async () => {
    setLoading(true)
    try {
      const response = await apiRoutes.blogs.list()
      if (response.data.success) {
        setBlogs(response.data.data)
      }
    } catch (error) {
      console.error('Failed to load blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content) return

    setSubmitting(true)
    try {
      const response = await apiRoutes.blogs.create({ title, content })
      if (response.data.success) {
        setTitle('')
        setContent('')
        setShowCreate(false)
        loadBlogs()
      }
    } catch (error: any) {
      console.error('Failed to create blog:', error)
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create blog post'
      alert(`Error: ${errorMessage}\n\nPlease check:\n1. Backend is running on port 5001\n2. Title and content are filled\n3. Try again`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSummarize = async (blogId: number, content: string) => {
    setSummarizing(blogId)
    try {
      const response = await apiRoutes.ai.summarize(content)
      if (response.data.success) {
        setSummaries({ ...summaries, [blogId]: response.data.data.summary })
      }
    } catch (error) {
      console.error('Failed to summarize:', error)
      alert('Failed to generate summary')
    } finally {
      setSummarizing(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <SectionHeader
        title="Blog"
        subtitle="Insights, updates, and AI-powered content"
      />

      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-cyan-400">
          <Sparkles size={20} />
          <span>AI-Powered Blog Posts</span>
        </div>
        <NeonButton onClick={() => setShowCreate(!showCreate)}>
          <Plus size={20} className="mr-2" />
          Create Post
        </NeonButton>
      </div>

      {showCreate && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <GlassCard>
            <h3 className="text-2xl font-bold mb-4 neon-text">Create New Blog Post</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                required
              />
              <textarea
                placeholder="Content (AI will auto-generate summary and SEO description)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                required
              />
              <div className="flex gap-4">
                <NeonButton type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Creating...
                    </>
                  ) : (
                    'Create Post'
                  )}
                </NeonButton>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreate(false)
                    setTitle('')
                    setContent('')
                  }}
                  className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      )}

      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="animate-spin mx-auto text-cyan-400" size={40} />
        </div>
      ) : blogs.length === 0 ? (
        <GlassCard className="text-center py-12">
          <p className="text-gray-300 text-lg">No blog posts yet. Create one to get started!</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard className="h-full">
                <h3 className="text-2xl font-bold mb-2 neon-text">{blog.title}</h3>
                {summaries[blog.id] ? (
                  <p className="text-gray-300 mb-4">{summaries[blog.id]}</p>
                ) : blog.summary ? (
                  <p className="text-gray-300 mb-4 line-clamp-3">{blog.summary}</p>
                ) : null}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-400">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => {
                      // Get full content - in real app, fetch from API
                      const content = blog.summary || 'Blog content here...'
                      handleSummarize(blog.id, content)
                    }}
                    className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-purple-400 text-sm"
                    disabled={summarizing === blog.id}
                  >
                    {summarizing === blog.id ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Summarizing...
                      </>
                    ) : (
                      <>
                        <Zap size={16} />
                        AI Summarize
                      </>
                    )}
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

