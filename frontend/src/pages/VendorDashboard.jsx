import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, Clock, CheckCircle2, XCircle, 
  IndianRupee, MessageSquare, Navigation, Filter, Phone, 
  TrendingUp, Award, DollarSign, Wallet, FileText, CheckCircle, Star
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext'
import { toast } from 'react-hot-toast'

const VendorDashboard = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [activeTab, setActiveTab] = useState('JOBS') // 'JOBS' or 'EARNINGS'
  const { notifications } = useNotifications()

  useEffect(() => {
    fetchBookings()
  }, [notifications])

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/bookings/vendor')
      setBookings(res.data)
    } catch (err) {
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBargain = async (id, status, price) => {
    try {
      await axios.post(`/api/bookings/${id}/bargain?status=${status}${price ? '&counterPrice=' + price : ''}`)
      toast.success('Bargain response submitted!')
      fetchBookings()
    } catch (err) {
      console.error('Error responding to bargain:', err)
      toast.error('Failed to update bargain price')
    }
  }

  // Earnings calculations
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED')
  const totalEarnings = completedBookings.reduce((sum, b) => sum + Number(b.bargainPrice || b.originalPrice || 0), 0)
  const avgJobEarnings = completedBookings.length > 0 ? (totalEarnings / completedBookings.length).toFixed(0) : 0
  const pendingValue = bookings
    .filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + Number(b.bargainPrice || b.originalPrice || 0), 0)

  const filteredBookings = bookings.filter(b => {
    if (filter === 'ALL') return true
    if (filter === 'PENDING') return b.bargainStatus === 'PENDING'
    return b.status === filter
  })

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Vendor Portal & Earnings</h1>
          <p className="text-slate-500 font-medium">Manage job requests, bargains, and track net earnings</p>
        </div>
        <div className="flex bg-slate-200/60 p-1.5 rounded-2xl gap-1">
          <button 
            onClick={() => setActiveTab('JOBS')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'JOBS' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <ShoppingBag size={16} /> Active Jobs & Bargains
          </button>
          <button 
            onClick={() => setActiveTab('EARNINGS')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'EARNINGS' ? 'bg-primary-600 text-white shadow-md shadow-primary-200' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Wallet size={16} /> Earnings & Payout Ledger
          </button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-primary-600 to-indigo-700 p-6 rounded-[32px] text-white shadow-xl shadow-primary-200 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <IndianRupee size={120} />
          </div>
          <p className="text-xs font-bold text-primary-200 uppercase tracking-widest">Total Net Earnings</p>
          <h2 className="text-4xl font-black mt-2">₹{totalEarnings.toLocaleString()}</h2>
          <p className="text-xs text-primary-100 mt-2 font-medium flex items-center gap-1">
            <TrendingUp size={14} /> Settled from {completedBookings.length} completed jobs
          </p>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <span className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl inline-block mb-3">
              <CheckCircle2 size={22} />
            </span>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completed Jobs</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{completedBookings.length}</h3>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-2">Successful service deliveries</p>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <span className="p-3 bg-amber-50 text-amber-600 rounded-2xl inline-block mb-3">
              <Award size={22} />
            </span>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg. Job Revenue</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">₹{avgJobEarnings}</h3>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-2">Average value per order</p>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <span className="p-3 bg-blue-50 text-blue-600 rounded-2xl inline-block mb-3">
              <Clock size={22} />
            </span>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Pipeline Value</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">₹{pendingValue.toLocaleString()}</h3>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-2">In-progress & requested jobs</p>
        </div>
      </div>

      {/* Main Content Sections */}
      {activeTab === 'JOBS' ? (
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/30">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Service Requests & Bargain Management</h2>
              <p className="text-xs text-slate-500 mt-0.5">Respond to customer bargains and navigate to job sites</p>
            </div>
            <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
              {['ALL', 'REQUESTED', 'ACCEPTED', 'COMPLETED'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === f ? 'bg-primary-600 text-white shadow-md shadow-primary-100' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer & Service</th>
                  <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Bargain Price</th>
                  <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Job Status</th>
                  <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Negotiate & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan="4" className="p-20 text-center text-slate-400 font-medium">Loading requests...</td></tr>
                ) : filteredBookings.length === 0 ? (
                  <tr><td colSpan="4" className="p-20 text-center text-slate-400 font-medium">No service requests found for this filter.</td></tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-tr from-primary-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-md shadow-primary-100">
                            {b.user.name[0]}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-base">{b.user.name}</div>
                            <div className="text-[11px] text-primary-600 font-extrabold uppercase tracking-wider">{b.service.name}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{b.address}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-primary-600">₹{b.bargainPrice || b.originalPrice}</span>
                            <span className="px-3 py-1 bg-primary-50 text-primary-700 text-[10px] font-black rounded-full uppercase tracking-tighter">
                              {b.bargainStatus === 'PENDING' ? 'Customer Offer' : 'Agreed Price'}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold">Standard Catalog Price: ₹{b.originalPrice}</div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          b.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                          b.status === 'REQUESTED' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {b.status.replace('_', ' ')}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex justify-end gap-3 items-center">
                          {/* Bargain Actions */}
                          {b.bargainStatus === 'PENDING' && b.status === 'REQUESTED' && (
                            <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
                              <button 
                                onClick={() => handleBargain(b.id, 'ACCEPTED')}
                                className="px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 shadow-md shadow-emerald-100 transition-all"
                              >
                                Accept ₹{b.bargainPrice}
                              </button>
                              <button 
                                onClick={() => {
                                  const counter = prompt("Enter your counter offer price:", b.originalPrice)
                                  if (counter) handleBargain(b.id, 'COUNTER', counter)
                                }}
                                className="px-4 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 shadow-md shadow-primary-100 transition-all"
                              >
                                Counter
                              </button>
                            </div>
                          )}

                          {/* Negotiation & Navigation */}
                          <div className="flex gap-2">
                            <a href={`tel:${b.user.phone}`} className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                              <Phone size={18} />
                            </a>
                            <Link 
                              to={`/chat/${b.user.id}?bookingId=${b.id}`}
                              className="p-3 bg-white border border-slate-200 text-primary-600 rounded-xl hover:bg-primary-50 transition-all shadow-sm flex items-center gap-2"
                            >
                              <MessageSquare size={18} />
                              <span className="text-xs font-bold hidden lg:block">Chat</span>
                            </Link>
                            {b.status !== 'REQUESTED' && b.status !== 'COMPLETED' && (
                              <Link 
                                to={`/vendor/tracking/${b.id}`}
                                className="px-5 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-100"
                              >
                                <Navigation size={16} /> Live Track
                              </Link>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Earnings Ledger Table */
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Completed Jobs & Earnings Record</h2>
              <p className="text-xs text-slate-500 mt-0.5">Itemized transaction history and payout breakdown</p>
            </div>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
              {completedBookings.length} Settled Transactions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Booking Ref</th>
                  <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer & Service</th>
                  <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Standard vs Final</th>
                  <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Net Earnings</th>
                  <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Payout Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {completedBookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-20 text-center text-slate-400 font-medium">
                      No completed jobs recorded yet. Finish jobs to build your earnings record!
                    </td>
                  </tr>
                ) : (
                  completedBookings.map((b) => {
                    const finalPrice = b.bargainPrice || b.originalPrice
                    return (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-6">
                          <div className="font-bold text-slate-900">#GFX-{b.id}</div>
                          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                            {b.updatedAt ? new Date(b.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Completed'}
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="font-bold text-slate-900">{b.user.name}</div>
                          <div className="text-xs text-primary-600 font-bold">{b.service.name}</div>
                          {b.rating && (
                            <div className="mt-2 p-2 bg-amber-50 rounded-lg inline-block border border-amber-100 max-w-[200px]">
                              <div className="flex items-center gap-1 text-amber-500 mb-1">
                                {[...Array(b.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                              </div>
                              {b.review && <p className="text-[10px] text-amber-900 italic line-clamp-2">"{b.review}"</p>}
                            </div>
                          )}
                        </td>
                        <td className="p-6">
                          <div className="text-xs text-slate-400 line-through">₹{b.originalPrice}</div>
                          <div className="text-sm font-black text-slate-900">₹{finalPrice}</div>
                        </td>
                        <td className="p-6">
                          <div className="text-2xl font-black text-emerald-600">₹{finalPrice}</div>
                          <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">100% Direct Payout</div>
                        </td>
                        <td className="p-6 text-right">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                            <CheckCircle size={14} /> Settled
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default VendorDashboard
