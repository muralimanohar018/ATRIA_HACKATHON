import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '../components/common/SectionHeader'
import GlassCard from '../components/common/GlassCard'
import NeonButton from '../components/common/NeonButton'
import { apiRoutes } from '../lib/api'
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [emailPreview, setEmailPreview] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // Store in database and send AI-generated email
      const response = await apiRoutes.contact.submit(formData)
      if (response.data.success) {
        // Get email preview for display
        const emailRes = await apiRoutes.ai.emailPreview(formData.name, 'contact')
        if (emailRes.data.success) {
          setEmailPreview(emailRes.data.data.body)
          setShowPreview(true)
        }
        setFormData({ name: '', email: '', message: '' })
        alert('✅ Message sent successfully! We\'ll get back to you soon.')
      }
    } catch (error: any) {
      console.error('Failed to submit contact:', error)
      alert(`Error: ${error.response?.data?.error || error.message || 'Failed to send message'}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <SectionHeader
        title="Contact Us"
        subtitle="Get in touch with our team"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard>
            <h3 className="text-2xl font-bold mb-6 neon-text">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Mail className="text-cyan-400" size={24} />
                <div>
                  <div className="text-gray-300">Email</div>
                  <div className="text-white">info@mastersolis.com</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-purple-400" size={24} />
                <div>
                  <div className="text-gray-300">Phone</div>
                  <div className="text-white">+91 1234567890</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="text-pink-400" size={24} />
                <div>
                  <div className="text-gray-300">Address</div>
                  <div className="text-white">Bengaluru, India</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard>
            <h3 className="text-2xl font-bold mb-6 neon-text">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                required
                disabled={submitting}
              />
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                required
                disabled={submitting}
              />
              <textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                required
                disabled={submitting}
              />
              <NeonButton type="submit" disabled={submitting} className="w-full">
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} className="mr-2" />
                    Send Message
                  </>
                )}
              </NeonButton>
            </form>

            {showPreview && emailPreview && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-cyan-500/20 border border-cyan-500/50 rounded-lg"
              >
                <h4 className="font-semibold text-cyan-400 mb-2">AI-Generated Email Preview:</h4>
                <pre className="text-white text-sm whitespace-pre-wrap">{emailPreview}</pre>
              </motion.div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}

