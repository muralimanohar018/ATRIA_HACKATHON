import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Zap, Brain } from 'lucide-react'
import NeonButton from '../components/common/NeonButton'
import GlassCard from '../components/common/GlassCard'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mb-4 px-4 py-2 bg-cyan-500/20 rounded-full border border-cyan-500/50">
            <span className="flex items-center gap-2 text-cyan-400">
              <Sparkles size={16} />
              AI-Powered Solutions
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 neon-text">
            Mastersolis Infotech
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Transforming businesses with cutting-edge AI technology and innovative solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/careers">
              <NeonButton className="flex items-center gap-2">
                Explore Careers <ArrowRight size={20} />
              </NeonButton>
            </Link>
            <Link to="/projects">
              <NeonButton className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30">
                View Projects <ArrowRight size={20} />
              </NeonButton>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard>
              <Zap className="text-cyan-400 mb-4" size={40} />
              <h3 className="text-2xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-gray-300">
                Optimized AI solutions that deliver results in milliseconds
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard>
              <Brain className="text-purple-400 mb-4" size={40} />
              <h3 className="text-2xl font-bold mb-2">AI-Powered</h3>
              <p className="text-gray-300">
                Advanced machine learning models for intelligent automation
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GlassCard>
              <Sparkles className="text-pink-400 mb-4" size={40} />
              <h3 className="text-2xl font-bold mb-2">Innovative</h3>
              <p className="text-gray-300">
                Cutting-edge technology solutions for tomorrow's challenges
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 neon-text">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              text: "Mastersolis Infotech transformed our business with their AI solutions. The results exceeded our expectations!",
              author: "Sarah Johnson",
              role: "CEO, TechCorp",
            },
            {
              text: "Outstanding service and innovative approach. Their team delivered exactly what we needed on time and within budget.",
              author: "Michael Chen",
              role: "CTO, InnovateLabs",
            },
            {
              text: "The AI-powered analytics platform they built for us has revolutionized our decision-making process. Highly recommended!",
              author: "Emily Rodriguez",
              role: "Director, DataFlow Inc",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard className="h-full">
                <p className="text-gray-300 italic mb-4 leading-relaxed">"{testimonial.text}"</p>
                <div className="border-t border-white/10 pt-4">
                  <div className="font-semibold text-cyan-400">{testimonial.author}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/testimonials">
            <NeonButton className="bg-white/10 hover:bg-white/20 border border-white/30">
              View All Testimonials
            </NeonButton>
          </Link>
        </div>
      </section>

      {/* Service Highlights */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 neon-text">Our Core Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "AI & Machine Learning",
              description: "Custom AI models and ML solutions tailored to your business needs",
              icon: Brain,
            },
            {
              title: "Software Development",
              description: "Full-stack development with modern technologies and best practices",
              icon: Zap,
            },
            {
              title: "Data Analytics",
              description: "Transform raw data into actionable insights with advanced analytics",
              icon: Sparkles,
            },
          ].map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard className="h-full text-center">
                <service.icon className="text-cyan-400 mx-auto mb-4" size={40} />
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/services">
            <NeonButton>Explore All Services</NeonButton>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <GlassCard className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold neon-text mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join us in building the future with AI-powered solutions
          </p>
          <Link to="/contact">
            <NeonButton>Get Started</NeonButton>
          </Link>
        </GlassCard>
      </section>
    </div>
  )
}

