import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Mail, Lock, Loader2 } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await login(email, password)
    if (!res.success) {
      setError(res.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Sign in to manage your services</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-500 text-sm">
          Don't have an account? <Link to="/register" className="text-primary-600 font-bold hover:underline">Sign up for free</Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
