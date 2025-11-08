import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="glass-card rounded-none border-x-0 border-b-0 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold neon-text mb-4">Mastersolis Infotech</h3>
            <p className="text-gray-300">
              AI-Powered Solutions for the Future
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-cyan-400">About</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-cyan-400">Services</Link></li>
              <li><Link to="/careers" className="text-gray-300 hover:text-cyan-400">Careers</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-cyan-400">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                info@mastersolis.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                +91 1234567890
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                Bengaluru, India
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-4 text-center text-gray-400">
          <p>&copy; 2024 Mastersolis Infotech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

