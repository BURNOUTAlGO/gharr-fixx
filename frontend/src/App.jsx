import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import VendorDashboard from './pages/VendorDashboard'
import BookingTracking from './pages/BookingTracking'
import VendorTracking from './pages/VendorTracking'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import HelpSupport from './pages/HelpSupport'
import AboutUs from './pages/AboutUs'
import Terms from './pages/Terms'
import Offers from './pages/Offers'
import SupportBot from './components/SupportBot'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Toaster />
        <div className="min-h-screen bg-slate-50 font-inter">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/tracking/:id" element={<BookingTracking />} />
              <Route path="/vendor/tracking/:id" element={<VendorTracking />} />
              <Route path="/chat/:otherUserId" element={<Chat />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/help" element={<HelpSupport />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/offers" element={<Offers />} />
            </Routes>
          </main>
          <SupportBot />
        </div>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
