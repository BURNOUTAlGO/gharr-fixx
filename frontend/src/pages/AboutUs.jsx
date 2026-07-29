import React from 'react'
import { CheckCircle2, Star, Users, Zap } from 'lucide-react'

const AboutUs = () => {
  const stats = [
    { label: 'Happy Customers', value: '10K+', icon: <Users /> },
    { label: 'Service Experts', value: '500+', icon: <Star /> },
    { label: 'Cities Covered', value: '25+', icon: <CheckCircle2 /> },
    { label: 'Instant Bookings', value: '50K+', icon: <Zap /> },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-20 py-10">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-black text-slate-900 leading-tight">
          GharFix is your home's <br />
          <span className="text-primary-600">new best friend.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          We are on a mission to simplify home maintenance by connecting you with trusted local professionals instantly.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center space-y-2">
            <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {stat.icon}
            </div>
            <div className="text-3xl font-black text-slate-900">{stat.value}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800" alt="About Us" className="w-full h-full object-cover" />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900">Our Story</h2>
          <p className="text-slate-600 leading-relaxed">
            Founded in 2024, GharFix started with a simple idea: why should finding a plumber or an electrician be so stressful? We built a platform where quality meets convenience. 
          </p>
          <p className="text-slate-600 leading-relaxed">
            Our unique bargaining system ensures you always get a fair price, while our real-time tracking gives you peace of mind from request to completion.
          </p>
          <div className="flex gap-4 pt-4">
            <button className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-200">Our Vision</button>
            <button className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold">Contact Team</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
