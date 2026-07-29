import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { ShoppingBag, Clock, CheckCircle2, MessageSquare, Navigation, IndianRupee, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext'

const UserDashboard = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedbackState, setFeedbackState] = useState({})
  const { notifications } = useNotifications()

  useEffect(() => {
    fetchBookings()
  }, [notifications])

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/bookings/user')
      setBookings(res.data)
    } catch (err) {
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCounterResponse = async (id, status) => {
    try {
      // If customer accepts counter, we set bargainStatus to ACCEPTED and update price
      // For simplicity, we reuse the bargain endpoint
      await axios.post(`/api/bookings/${id}/bargain?status=${status}`)
      fetchBookings()
    } catch (err) {
      console.error('Error responding to counter:', err)
    }
  }

  const handleReviewSubmit = async (id) => {
    const feedback = feedbackState[id]
    if (!feedback?.rating) return
    try {
      await axios.put(`/api/bookings/${id}/review?rating=${feedback.rating}&review=${feedback.review || ''}`)
      fetchBookings()
    } catch (err) {
      console.error('Error submitting review:', err)
    }
  }

  const updateFeedback = (id, field, value) => {
    setFeedbackState(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }))
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Your Bookings</h1>
          <p className="text-slate-500">Track and manage your active service requests</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(n => <div key={n} className="h-48 bg-slate-100 rounded-3xl animate-pulse"></div>)}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
          <ShoppingBag className="mx-auto text-slate-200 mb-4" size={64} />
          <h3 className="text-xl font-bold text-slate-900">No bookings yet</h3>
          <p className="text-slate-500 mt-2 mb-6">Start browsing services and book your first fix!</p>
          <Link to="/" className="px-8 py-3 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all">
            Explore Services
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {bookings.map((b) => (
            <motion.div 
              key={b.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-xl hover:shadow-slate-200 transition-all"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-50">
                      <img src={b.service.imageUrl} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{b.service.name}</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{b.vendor.name}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                    b.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                    b.status === 'ACCEPTED' ? 'bg-blue-50 text-blue-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {b.status.replace('_', ' ')}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Final Price</p>
                    <p className="text-xl font-black text-primary-600">₹{b.bargainPrice || b.originalPrice}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Booking ID</p>
                    <p className="text-sm font-bold text-slate-900">#GFX-{b.id}</p>
                  </div>
                </div>

                {/* Bargain Interaction */}
                {b.bargainStatus === 'COUNTER' && b.status === 'REQUESTED' && (
                  <div className="p-6 bg-primary-50 rounded-2xl border border-primary-100 space-y-4">
                    <div className="flex items-center gap-3">
                      <IndianRupee className="text-primary-600" size={20} />
                      <div>
                        <p className="text-sm font-bold text-primary-900">Vendor Counter Offer: ₹{b.counterPrice}</p>
                        <p className="text-[10px] text-primary-700">Would you like to accept this price?</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleCounterResponse(b.id, 'ACCEPTED')}
                        className="flex-1 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 transition-all"
                      >
                        Accept ₹{b.counterPrice}
                      </button>
                      <button 
                        onClick={() => handleCounterResponse(b.id, 'REJECTED')}
                        className="flex-1 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}

                {/* Feedback Section */}
                {b.status === 'COMPLETED' && !b.rating && (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <h4 className="font-bold text-slate-900 text-sm">Rate your experience</h4>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button 
                          key={star}
                          onClick={() => updateFeedback(b.id, 'rating', star)}
                          className="focus:outline-none"
                        >
                          <Star 
                            size={24} 
                            className={`transition-colors ${
                              (feedbackState[b.id]?.rating || 0) >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <textarea 
                      placeholder="Leave a review for the vendor (optional)..."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary-400 resize-none h-20"
                      value={feedbackState[b.id]?.review || ''}
                      onChange={(e) => updateFeedback(b.id, 'review', e.target.value)}
                    ></textarea>
                    <button 
                      onClick={() => handleReviewSubmit(b.id)}
                      disabled={!feedbackState[b.id]?.rating}
                      className="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all"
                    >
                      Submit Feedback
                    </button>
                  </div>
                )}
                
                {b.status === 'COMPLETED' && b.rating && (
                  <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <h4 className="font-bold text-emerald-900 text-sm">Feedback Submitted</h4>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 mb-2">
                      {[...Array(b.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                    {b.review && <p className="text-xs text-emerald-700 font-medium italic">"{b.review}"</p>}
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-3 pt-6 border-t border-slate-50">
                <Link 
                  to={`/tracking/${b.id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                >
                  <Navigation size={18} /> Track Job
                </Link>
                {b.vendor && (
                  <Link 
                    to={`/chat/${b.vendor.id}?bookingId=${b.id}`}
                    className="px-6 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    title="Chat with Vendor"
                  >
                    <MessageSquare size={18} />
                    <span className="text-sm font-bold hidden sm:inline">Chat</span>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserDashboard
