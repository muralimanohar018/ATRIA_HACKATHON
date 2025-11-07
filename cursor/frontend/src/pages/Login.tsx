import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import GlassCard from '../components/common/GlassCard'
import NeonButton from '../components/common/NeonButton'
import { apiRoutes } from '../lib/api'
import { Lock, User, Mail, Loader2, Shield, Sparkles } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const response = await apiRoutes.auth.login(formData.username, formData.password)
        if (response.data.success) {
          // Store token
          localStorage.setItem('admin_token', response.data.data.token)
          localStorage.setItem('admin_user', JSON.stringify(response.data.data.user))
          navigate('/admin')
        } else {
          setError(response.data.error || 'Login failed')
        }
      } else {
        const response = await apiRoutes.auth.register(formData.username, formData.email, formData.password)
        if (response.data.success) {
          setError('')
          alert('Admin user created! Please login.')
          setIsLogin(true)
          setFormData({ username: '', email: '', password: '' })
        } else {
          setError(response.data.error || 'Registration failed')
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-full mb-4">
              <Shield className="text-cyan-400" size={40} />
            </div>
            <h1 className="text-3xl font-bold neon-text mb-2">
              {isLogin ? 'Admin Login' : 'Create Admin'}
            </h1>
            <p className="text-gray-400">
              {isLogin 
                ? 'Access the admin dashboard' 
                : 'Create the first admin user'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-gray-300 text-sm mb-2 flex items-center gap-2">
                <User size={16} />
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all"
                placeholder="Enter username"
              />
            </div>

            {/* Email (only for registration) */}
            {!isLogin && (
              <div>
                <label className="block text-gray-300 text-sm mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required={!isLogin}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all"
                  placeholder="Enter email"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-sm mb-2 flex items-center gap-2">
                <Lock size={16} />
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={isLogin ? 1 : 6}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all"
                placeholder={isLogin ? "Enter password" : "Enter password (min 6 characters)"}
              />
            </div>

            {/* Submit Button */}
            <NeonButton
              type="submit"
              disabled={loading}
              className="w-full mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="inline mr-2 animate-spin" size={18} />
                  {isLogin ? 'Logging in...' : 'Creating...'}
                </>
              ) : (
                <>
                  {isLogin ? (
                    <>
                      <Shield className="inline mr-2" size={18} />
                      Login
                    </>
                  ) : (
                    <>
                      <Sparkles className="inline mr-2" size={18} />
                      Create Admin
                    </>
                  )}
                </>
              )}
            </NeonButton>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setFormData({ username: '', email: '', password: '' })
              }}
              className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
            >
              {isLogin 
                ? 'Need to create admin user? Click here' 
                : 'Already have an account? Login here'}
            </button>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </GlassCard>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6"
        >
          <GlassCard className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="text-cyan-400 mt-0.5" size={20} />
              <div className="text-sm text-gray-300">
                <p className="font-semibold text-white mb-1">Admin Access</p>
                <p className="text-gray-400">
                  {isLogin 
                    ? 'Login to manage jobs, applications, and blog posts.'
                    : 'Create the first admin user to access the dashboard.'}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  )
}

