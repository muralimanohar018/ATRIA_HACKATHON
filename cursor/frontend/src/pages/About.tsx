import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '../components/common/SectionHeader'
import GlassCard from '../components/common/GlassCard'
import { Target, Users, Award, Rocket, Sparkles, Loader2 } from 'lucide-react'
import { apiRoutes } from '../lib/api'

export default function About() {
  const [teamIntro, setTeamIntro] = useState('')
  const [milestones, setMilestones] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    generateTeamIntro()
    loadMilestones()
  }, [])

  const generateTeamIntro = async () => {
    setLoading(true)
    try {
      // Generate AI team introduction
      const prompt = "Mastersolis Infotech team: 50+ skilled professionals specializing in AI, ML, software development, and data analytics. Diverse expertise across Python, React, cloud technologies, and enterprise solutions."
      const response = await apiRoutes.ai.summarize(prompt)
      if (response.data.success) {
        setTeamIntro(response.data.data.summary || "Our team of 50+ skilled professionals brings together diverse expertise in AI, machine learning, software development, and data analytics. We're passionate about delivering innovative solutions that drive business success.")
      }
    } catch (error) {
      console.error('Failed to generate team intro:', error)
      setTeamIntro("Our team of 50+ skilled professionals brings together diverse expertise in AI, machine learning, software development, and data analytics. We're passionate about delivering innovative solutions that drive business success.")
    } finally {
      setLoading(false)
    }
  }

  const loadMilestones = () => {
    // Company milestones
    setMilestones([
      { year: '2015', event: 'Company Founded', description: 'Started with a vision to democratize AI technology' },
      { year: '2017', event: 'First Major Client', description: 'Secured partnership with Fortune 500 company' },
      { year: '2019', event: 'AI Lab Launch', description: 'Opened dedicated AI research and development lab' },
      { year: '2021', event: '100+ Projects', description: 'Reached milestone of 100+ successful project deliveries' },
      { year: '2023', event: 'Global Expansion', description: 'Expanded operations to serve clients worldwide' },
      { year: '2024', event: 'Industry Recognition', description: 'Received multiple awards for innovation and excellence' },
    ])
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <SectionHeader
        title="About Us"
        subtitle="Leading the AI revolution with innovative solutions"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard>
            <h3 className="text-2xl font-bold mb-4 neon-text">Our Mission</h3>
            <p className="text-gray-300 leading-relaxed">
              To empower businesses with cutting-edge AI technology, transforming how they operate
              and compete in the digital age. We believe in making AI accessible and impactful for
              organizations of all sizes.
            </p>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard>
            <h3 className="text-2xl font-bold mb-4 neon-text">Our Vision</h3>
            <p className="text-gray-300 leading-relaxed">
              To be the global leader in AI-powered solutions, recognized for innovation,
              excellence, and creating transformative experiences that drive business success
              and societal progress.
            </p>
          </GlassCard>
        </motion.div>
      </div>

      {/* AI-Generated Team Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-purple-400" size={24} />
            <h3 className="text-2xl font-bold neon-text">Our Team</h3>
          </div>
          {loading ? (
            <div className="flex items-center gap-2 text-gray-300">
              <Loader2 className="animate-spin" size={20} />
              <span>Generating team introduction...</span>
            </div>
          ) : (
            <p className="text-gray-300 leading-relaxed text-lg">{teamIntro}</p>
          )}
        </GlassCard>
      </motion.div>

      {/* Company Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <h3 className="text-3xl font-bold mb-8 neon-text text-center">Company Milestones</h3>
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="text-3xl font-bold neon-text">{milestone.year}</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">{milestone.event}</h4>
                    <p className="text-gray-300">{milestone.description}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Target, label: '100+', title: 'Projects' },
          { icon: Users, label: '50+', title: 'Team Members' },
          { icon: Award, label: '25+', title: 'Awards' },
          { icon: Rocket, label: '10+', title: 'Years Experience' },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <GlassCard className="text-center">
              <item.icon className="text-cyan-400 mx-auto mb-4" size={40} />
              <div className="text-4xl font-bold neon-text mb-2">{item.label}</div>
              <div className="text-gray-300">{item.title}</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

