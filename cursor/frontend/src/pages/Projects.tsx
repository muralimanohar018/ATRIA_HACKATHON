import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '../components/common/SectionHeader'
import GlassCard from '../components/common/GlassCard'
import { ExternalLink, Github } from 'lucide-react'

export default function Projects() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  
  const projects = [
    {
      id: 1,
      title: 'AI-Powered E-Commerce Platform',
      description: 'Machine learning recommendations engine increasing sales by 40%',
      tech: ['Python', 'TensorFlow', 'React', 'PostgreSQL'],
      tags: ['AI/ML', 'E-Commerce', 'Python', 'React'],
      status: 'Live',
    },
    {
      id: 2,
      title: 'Healthcare Analytics Dashboard',
      description: 'Real-time analytics platform for hospital management systems',
      tech: ['Python', 'FastAPI', 'React', 'MongoDB'],
      tags: ['Healthcare', 'Analytics', 'Python', 'React'],
      status: 'Live',
    },
    {
      id: 3,
      title: 'Financial Fraud Detection System',
      description: 'AI model detecting fraudulent transactions with 99% accuracy',
      tech: ['Python', 'PyTorch', 'Flask', 'Redis'],
      tags: ['AI/ML', 'Finance', 'Python', 'Security'],
      status: 'In Development',
    },
    {
      id: 4,
      title: 'Smart City IoT Platform',
      description: 'Integrated IoT solution for smart city infrastructure management',
      tech: ['Node.js', 'React', 'MongoDB', 'AWS'],
      tags: ['IoT', 'Cloud', 'Node.js', 'React'],
      status: 'Live',
    },
  ]

  const allTags = Array.from(new Set(projects.flatMap(p => p.tags)))
  const filteredProjects = selectedTag
    ? projects.filter(p => p.tags.includes(selectedTag))
    : projects

  return (
    <div className="container mx-auto px-4 py-20">
      <SectionHeader
        title="Our Projects"
        subtitle="Showcasing innovation and excellence"
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-4 py-2 rounded-lg transition-all ${
            selectedTag === null
              ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
              : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
          }`}
        >
          All Projects
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTag === tag
                ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <GlassCard className="h-full">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold neon-text">{project.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  project.status === 'Live'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-gray-300 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-sm text-cyan-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300">
                  <ExternalLink size={16} />
                  View Demo
                </button>
                <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300">
                  <Github size={16} />
                  Code
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

