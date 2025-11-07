import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import { apiRoutes } from '../../lib/api'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'bot'; content: string }>>([
    { role: 'bot', content: 'Hello! I\'m an AI assistant for Mastersolis Infotech. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages([...messages, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      // Use AI summarize endpoint as a simple chatbot (in production, use a dedicated chatbot API)
      const response = await apiRoutes.ai.summarize(
        `User question: ${userMessage}. Please provide a helpful response about Mastersolis Infotech services.`
      )
      
      const botResponse = response.data.success
        ? response.data.data.summary || 'I\'m here to help! Please contact us for more information.'
        : 'I apologize, but I\'m having trouble processing your request. Please contact us directly at info@mastersolis.com'
      
      setMessages([...messages, { role: 'user', content: userMessage }, { role: 'bot', content: botResponse }])
    } catch (error) {
      setMessages([
        ...messages,
        { role: 'user', content: userMessage },
        { role: 'bot', content: 'I apologize for the error. Please contact us at info@mastersolis.com or call +91 1234567890' }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] z-50"
          >
            <div className="glass-card h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <Bot className="text-cyan-400" size={24} />
                  <div>
                    <div className="font-semibold text-white">AI Assistant</div>
                    <div className="text-xs text-gray-400">Mastersolis Infotech</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-cyan-500/20 border border-cyan-500/50 text-white'
                          : 'bg-white/10 border border-white/20 text-gray-300'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 border border-white/20 p-3 rounded-lg text-gray-300">
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t border-white/20">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    disabled={loading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-cyan-500 hover:bg-cyan-600 rounded-full shadow-lg flex items-center justify-center text-white z-40 neon-button"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  )
}

