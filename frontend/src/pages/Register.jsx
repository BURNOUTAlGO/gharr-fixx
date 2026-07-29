import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Phone, MapPin, Briefcase, Loader2 } from 'lucide-react'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', address: '', role: 'USER'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await register(formData)
    if (!res.success) {
      setError(res.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
          <p className="text-slate-500 mt-2">Join GharFix as a Customer or Vendor</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Role Selection */}
          <div className="md:col-span-2 flex gap-4">
            {['USER', 'VENDOR'].map(role => (
              <button
                key={role}
                type="button"
                onClick={() => setFormData({...formData, role})}
                className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  formData.role === role 
                  ? 'border-primary-600 bg-primary-50 text-primary-700' 
                  : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                }`}
              >
                {role === 'USER' ? <User size={24} /> : <Briefcase size={24} />}
                <span className="font-bold">{role === 'USER' ? 'Customer' : 'Vendor'}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-400"><User size={18} /></div>
              <input 
                type="text" required
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="John Doe"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-400"><Mail size={18} /></div>
              <input 
                type="email" required
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="john@example.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-400"><Phone size={18} /></div>
              <input 
                type="tel" required
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-400"><Lock size={18} /></div>
              <input 
                type="password" required
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-400"><MapPin size={18} /></div>
              <input 
                type="text" required
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="123 Street, City"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </div>

          <div className="md:col-span-2 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-slate-500 text-sm">
          Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Sign in</Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
