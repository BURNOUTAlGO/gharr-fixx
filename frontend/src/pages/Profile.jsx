import React from 'react'
import { User, Mail, Phone, MapPin, Shield, Bell } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 bg-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-primary-100">
          {user?.name[0]}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-black text-slate-900">{user?.name}</h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-sm mt-1">{user?.role} Account</p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
            <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100">Verified Professional</span>
            <span className="px-4 py-2 bg-primary-50 text-primary-600 rounded-xl text-xs font-bold border border-primary-100">Premium Member</span>
          </div>
        </div>
        <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><User size={20} className="text-primary-600" /> Personal Details</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <Mail className="text-slate-400" size={18} />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Email Address</p>
                <p className="text-slate-900 font-bold">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <Phone className="text-slate-400" size={18} />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Phone Number</p>
                <p className="text-slate-900 font-bold">{user?.phone || '+91 9876543210'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <MapPin className="text-slate-400" size={18} />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Saved Address</p>
                <p className="text-slate-900 font-bold">{user?.address || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><Shield size={20} className="text-primary-600" /> Account Settings</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
              <div className="flex items-center gap-4">
                <Bell className="text-slate-400 group-hover:text-primary-600" size={18} />
                <span className="font-bold text-slate-700">Notification Preferences</span>
              </div>
              <span className="text-slate-300">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
              <div className="flex items-center gap-4">
                <Shield className="text-slate-400 group-hover:text-primary-600" size={18} />
                <span className="font-bold text-slate-700">Security & Password</span>
              </div>
              <span className="text-slate-300">→</span>
            </button>
            <div className="p-6 bg-primary-600 rounded-2xl text-white">
              <h3 className="font-bold text-lg">Need Help?</h3>
              <p className="text-sm opacity-80 mt-1">Contact our support team for any account issues.</p>
              <button className="mt-4 px-6 py-2 bg-white text-primary-600 rounded-xl font-bold text-xs">Contact Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
