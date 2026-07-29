import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, IndianRupee, FileText, Send, CheckCircle2 } from 'lucide-react'
import axios from 'axios'

const BookingModal = ({ service, isOpen, onClose, onSuccess }) => {
  const [bargainPrice, setBargainPrice] = useState(service?.basePrice || '')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [booked, setBooked] = useState(false)

  const handleBooking = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Ensure we send all fields required by BookingRequest DTO
      await axios.post('/api/bookings', {
        serviceId: service.id,
        vendorId: service.vendor.id, // Added vendorId
        bargainPrice: parseFloat(bargainPrice), // Ensure it's a number
        address: address,
        notes: notes || ""
      })
      
      setBooked(true)
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 2000)
    } catch (err) {
      console.error('Booking failed details:', err.response?.data || err.message)
      alert(`Booking failed: ${err.response?.data?.message || 'Please check your connection and try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden"
        >
          {booked ? (
            <div className="p-12 text-center space-y-6">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-black text-slate-900">Request Sent!</h2>
              <p className="text-slate-500">Your booking request has been sent to {service.vendor.name}. You can track it in your dashboard.</p>
            </div>
          ) : (
            <>
              <div className="relative h-48">
                <img src={service.imageUrl} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-all">
                  <X size={20} />
                </button>
                <div className="absolute bottom-6 left-8 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Booking Service</p>
                  <h2 className="text-2xl font-black">{service.name}</h2>
                </div>
              </div>

              <form onSubmit={handleBooking} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Base Price</p>
                    <p className="text-xl font-black text-slate-400 line-through">₹{service.basePrice}</p>
                  </div>
                  <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100">
                    <p className="text-[10px] text-primary-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><IndianRupee size={10} /> Your Price</p>
                    <input 
                      type="number" 
                      required
                      className="w-full bg-transparent text-xl font-black text-primary-600 outline-none"
                      value={bargainPrice}
                      onChange={(e) => setBargainPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1 flex items-center gap-1"><MapPin size={10} /> Service Address</label>
                  <input 
                    type="text" 
                    required
                    placeholder="E.g. 123 MG Road, Bangalore"
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1 flex items-center gap-1"><FileText size={10} /> Notes for Vendor</label>
                  <textarea 
                    placeholder="E.g. Kitchen tap is leaking, please bring tools."
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium h-24 resize-none"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-primary-700 shadow-xl shadow-primary-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : <><Send size={20} /> Place Booking Request</>}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default BookingModal
