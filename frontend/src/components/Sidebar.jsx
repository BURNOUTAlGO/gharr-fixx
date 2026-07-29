import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, User, ShoppingBag, HelpCircle, Phone, Mail, 
  Settings, LogOut, Info, ShieldCheck, Heart
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()

  const menuItems = [
    { icon: <ShoppingBag size={20} />, label: 'My Bookings', path: user?.role === 'VENDOR' ? '/vendor/dashboard' : '/user/dashboard' },
    { icon: <User size={20} />, label: 'Profile Settings', path: '/profile' },
    { icon: <Heart size={20} />, label: 'Saved Services', path: '/' }, // Redirect to home for now
    { icon: <HelpCircle size={20} />, label: 'Help Center', path: '/help' },
    { icon: <Info size={20} />, label: 'About GharFix', path: '/about' },
    { icon: <ShieldCheck size={20} />, label: 'Terms & Privacy', path: '/terms' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center font-bold text-xl">
                  {user ? user.name[0] : 'G'}
                </div>
                <div>
                  <h3 className="font-bold">{user ? user.name : 'Welcome to GharFix'}</h3>
                  <p className="text-xs text-slate-400">{user ? user.role || 'Guest' : 'Guest'}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {menuItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={onClose}
                  className="flex items-center gap-4 p-4 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-all group"
                >
                  <span className="text-slate-400 group-hover:text-primary-500 transition-colors">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Support Section */}
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Support & Contact</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-primary-500">
                    <Mail size={16} />
                  </div>
                  <a href="mailto:dixitsaurabh416@gmail.com" className="hover:text-primary-600 transition-colors">
                    dixitsaurabh416@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-primary-500">
                    <Phone size={16} />
                  </div>
                  <a href="tel:+917985834815" className="hover:text-primary-600 transition-colors">
                    +91 7985834815
                  </a>
                </div>
              </div>

              {user && (
                <button 
                  onClick={() => { logout(); onClose(); }}
                  className="w-full mt-8 flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all"
                >
                  <LogOut size={20} /> Sign Out
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Sidebar
