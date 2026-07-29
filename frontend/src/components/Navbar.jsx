import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import { ShoppingBag, Bell, LogOut, User, Menu } from 'lucide-react'
import Sidebar from './Sidebar'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { notifications, markAsRead } = useNotifications()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Menu Trigger */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
          >
            <Menu size={24} />
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-200 group-hover:scale-110 transition-transform">
              G
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">GharFix<span className="text-primary-600">.</span></span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <a href="/#categories" className="hover:text-primary-600 transition-colors">Categories</a>
          <Link to="/offers" className="hover:text-primary-600 transition-colors">Offers</Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-3 hover:bg-slate-50 rounded-2xl transition-all relative text-slate-600"
                >
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-primary-600 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white animate-pulse font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 max-h-[400px] overflow-y-auto">
                    <h3 className="font-bold text-slate-900 mb-4 px-2">Notifications</h3>
                    {notifications.length === 0 ? (
                      <p className="text-center text-slate-400 py-8">No new alerts</p>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          className={`p-4 rounded-2xl mb-2 transition-all cursor-pointer ${n.read ? 'bg-white' : 'bg-primary-50 border border-primary-100'}`}
                          onClick={() => {
                            markAsRead(n.id)
                            if (n.bookingId) navigate(`/tracking/${n.bookingId}`)
                          }}
                        >
                          <div className="font-bold text-slate-900 text-sm">{n.title}</div>
                          <div className="text-xs text-slate-500 mt-1">{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <Link 
                to={user.role === 'VENDOR' ? '/vendor/dashboard' : '/user/dashboard'}
                className="flex items-center gap-3 pl-2 pr-6 py-2 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 group"
              >
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-bold text-primary-400 group-hover:scale-105 transition-transform">
                  {user.name[0]}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-white/60 uppercase tracking-tighter leading-none">Dashboard</div>
                  <div className="text-sm font-black tracking-tight leading-tight">{user.name.split(' ')[0]}</div>
                </div>
              </Link>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-6 py-3 text-slate-600 font-bold hover:text-primary-600 transition-colors">Login</Link>
              <Link to="/register" className="px-6 py-3 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-100">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </nav>
  )
}

export default Navbar
