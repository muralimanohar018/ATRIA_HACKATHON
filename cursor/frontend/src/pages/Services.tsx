import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '../components/common/SectionHeader'
import GlassCard from '../components/common/GlassCard'
import Chatbot from '../components/common/Chatbot'
import { Brain, Code, Database, Cloud, Shield, BarChart, Sparkles, Loader2 } from 'lucide-react'
import { apiRoutes } from '../lib/api'

export default function Services() {
  const [services, setServices] = useState([
    {
      icon: Brain,
      title: 'AI & Machine Learning',
      description: 'Custom AI models and ML solutions tailored to your business needs',
      iconClass: 'text-cyan-400',
      originalDesc: 'Custom AI models and ML solutions tailored to your business needs',
    },
    {
      icon: Code,
      title: 'Software Development',
      description: 'Full-stack development with modern technologies and best practices',
      iconClass: 'text-purple-400',
    },
    {
      icon: Database,
      title: 'Data Analytics',
      description: 'Transform raw data into actionable insights with advanced analytics',
      iconClass: 'text-pink-400',
    },
    {
      icon: Cloud,
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure and migration services',
      iconClass: 'text-cyan-400',
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Enterprise-grade security solutions and compliance management',
      iconClass: 'text-purple-400',
    },
    {
      icon: BarChart,
      title: 'Business Intelligence',
      description: 'Powerful BI tools and dashboards for data-driven decisions',
      iconClass: 'text-pink-400',
      originalDesc: 'Powerful BI tools and dashboards for data-driven decisions',
    },
  ])
  const [generating, setGenerating] = useState<Record<number, boolean>>({})

  const generateAIDescription = async (index: number) => {
    setGenerating({ ...generating, [index]: true })
    try {
      const service = services[index]
      const prompt = `Generate a professional, compelling description for ${service.title} service. Make it engaging and highlight key benefits.`
      const response = await apiRoutes.ai.summarize(prompt + ' ' + service.originalDesc)
      if (response.data.success) {
        const newServices = [...services]
        newServices[index].description = response.data.data.summary || service.originalDesc
        setServices(newServices)
      }
    } catch (error) {
      console.error('Failed to generate AI description:', error)
    } finally {
      setGenerating({ ...generating, [index]: false })
    }
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <SectionHeader
        title="Our Services"
        subtitle="Comprehensive solutions for your business needs"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <GlassCard className="h-full hover:scale-105 transition-transform">
              <div className="flex items-start justify-between mb-2">
                <service.icon className={`${service.iconClass} mb-4`} size={40} />
                <button
                  onClick={() => generateAIDescription(index)}
                  disabled={generating[index]}
                  className="p-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-purple-400 disabled:opacity-50"
                  title="Generate AI description"
                >
                  {generating[index] ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Sparkles size={16} />
                  )}
                </button>
              </div>
              <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-300">{service.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
      <Chatbot />
    </div>
  )
}

