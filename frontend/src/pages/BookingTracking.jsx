import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { 
  Check, Truck, Play, CheckCircle2, Clock, 
  MapPin, Phone, MessageSquare, Navigation, Star
} from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'

// Fix for default marker icons in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

// Custom Leaflet DivIcons for rich visual map experience
const createCustomIcon = (type) => {
  if (type === 'VENDOR') {
    return L.divIcon({
      className: 'custom-vendor-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <span class="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-indigo-400 opacity-75"></span>
          <div class="w-10 h-10 bg-indigo-600 border-2 border-white rounded-full flex items-center justify-center text-white shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    })
  }
  return L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="w-10 h-10 bg-rose-600 border-2 border-white rounded-full flex items-center justify-center text-white shadow-xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  })
}

const BookingTracking = () => {
  const { id } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [vendorPos, setVendorPos] = useState([12.9616, 77.5846])
  const [feedback, setFeedback] = useState({ rating: 0, review: '' })
  const userPos = [12.9816, 77.6046]
  const mapRef = React.useRef(null)

  useEffect(() => {
    fetchBooking()
    const interval = setInterval(fetchBooking, 5000)
    return () => clearInterval(interval)
  }, [id])

  useEffect(() => {
    if (booking?.status === 'ON_THE_WAY') {
      const moveInterval = setInterval(() => {
        setVendorPos(prev => {
          const latDiff = userPos[0] - prev[0]
          const lngDiff = userPos[1] - prev[1]
          if (Math.abs(latDiff) < 0.0005 && Math.abs(lngDiff) < 0.0005) return userPos
          return [prev[0] + latDiff * 0.08, prev[1] + lngDiff * 0.08]
        })
      }, 2500)
      return () => clearInterval(moveInterval)
    }
  }, [booking?.status])

  const fetchBooking = async () => {
    try {
      const res = await axios.get('/api/bookings/user')
      const found = res.data.find(b => b.id === Number(id))
      setBooking(found)
    } catch (err) {
      console.error('Error fetching booking:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSubmit = async () => {
    if (!feedback.rating) return
    try {
      await axios.put(`/api/bookings/${id}/review?rating=${feedback.rating}&review=${feedback.review}`)
      fetchBooking()
    } catch (err) {
      console.error('Error submitting review:', err)
    }
  }

  // Calculate real geographic distance
  const getDistanceKm = (pos1, pos2) => {
    const R = 6371
    const dLat = (pos2[0] - pos1[0]) * Math.PI / 180
    const dLon = (pos2[1] - pos1[1]) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(pos1[0] * Math.PI / 180) * Math.cos(pos2[0] * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return (R * c).toFixed(1)
  }

  const distanceKm = getDistanceKm(vendorPos, userPos)
  const etaMins = Math.max(2, Math.ceil(distanceKm * 4))

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold">Loading live tracker...</div>
  if (!booking) return <div className="p-20 text-center text-slate-400 font-bold">Booking not found</div>

  const stages = [
    { status: 'REQUESTED', label: 'Requested', icon: <Clock size={20} />, description: 'Your request has been sent to the vendor' },
    { status: 'ACCEPTED', label: 'Confirmed', icon: <Check size={20} />, description: 'Vendor has accepted your booking' },
    { status: 'ON_THE_WAY', label: 'On The Way', icon: <Truck size={20} />, description: 'The professional is heading to your location' },
    { status: 'IN_PROGRESS', label: 'In Progress', icon: <Play size={20} />, description: 'The service is currently being performed' },
    { status: 'COMPLETED', label: 'Completed', icon: <CheckCircle2 size={20} />, description: 'Job finished successfully' }
  ]

  const getCurrentStageIndex = () => {
    const index = stages.findIndex(s => s.status === booking.status)
    return index === -1 ? (booking.status === 'CANCELLED' ? -1 : 0) : index
  }

  const currentIndex = getCurrentStageIndex()

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shrink-0 shadow-md">
            <img src={booking.service.imageUrl} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{booking.service.name}</h1>
            <p className="text-slate-500 font-semibold text-sm">Booking ID: #GFX-{booking.id}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-primary-600">₹{booking.bargainPrice || booking.originalPrice}</div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Agreed Total Amount</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Progress Timeline */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold mb-10 text-slate-900">Service Progress</h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-slate-100"></div>
            <div 
              className="absolute left-6 top-0 w-1 bg-primary-600 transition-all duration-1000"
              style={{ height: `${(currentIndex / (stages.length - 1)) * 100}%` }}
            ></div>

            <div className="space-y-10">
              {stages.map((stage, idx) => {
                const isCompleted = idx < currentIndex
                const isCurrent = idx === currentIndex
                const isFuture = idx > currentIndex

                return (
                  <div key={stage.status} className="relative flex gap-8 items-start">
                    <div className={`z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
                      isCompleted ? 'bg-emerald-500 text-white shadow-emerald-100' : 
                      isCurrent ? 'bg-primary-600 text-white scale-110 shadow-primary-200' : 
                      'bg-white border-2 border-slate-100 text-slate-300'
                    }`}>
                      {isCompleted ? <Check size={20} /> : stage.icon}
                    </div>
                    <div className={`flex-1 transition-all duration-500 ${isFuture ? 'opacity-40' : 'opacity-100'}`}>
                      <h3 className={`text-md font-bold ${isCurrent ? 'text-primary-600' : 'text-slate-900'}`}>{stage.label}</h3>
                      <p className="text-[11px] text-slate-500 font-medium">{stage.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Feedback Section */}
          {booking.status === 'COMPLETED' && !booking.rating && (
            <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 shadow-sm">
              <h4 className="font-bold text-slate-900">Rate your experience</h4>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star}
                    onClick={() => setFeedback({ ...feedback, rating: star })}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      size={28} 
                      className={`transition-colors ${
                        feedback.rating >= star ? 'text-amber-400 fill-amber-400 drop-shadow-md' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea 
                placeholder="Leave a review for the vendor (optional)..."
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-primary-400 resize-none h-24"
                value={feedback.review}
                onChange={(e) => setFeedback({ ...feedback, review: e.target.value })}
              ></textarea>
              <button 
                onClick={handleReviewSubmit}
                disabled={!feedback.rating}
                className="px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 w-full"
              >
                Submit Feedback
              </button>
            </div>
          )}
          
          {booking.status === 'COMPLETED' && booking.rating && (
            <div className="mt-8 p-6 bg-emerald-50 rounded-3xl border border-emerald-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={20} className="text-emerald-600" />
                <h4 className="font-bold text-emerald-900">Feedback Submitted</h4>
              </div>
              <div className="flex items-center gap-1 text-amber-500 mb-2">
                {[...Array(booking.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              {booking.review && <p className="text-sm text-emerald-800 font-medium italic bg-emerald-100/50 p-3 rounded-xl mt-3">"{booking.review}"</p>}
            </div>
          )}

        </div>

        {/* Right: Live Map Tracking */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200 border-8 border-white h-[440px] relative">
            <MapContainer 
              ref={mapRef} 
              center={vendorPos} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }} 
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
              />
              <Marker position={userPos} icon={createCustomIcon('USER')}>
                <Popup>Your Service Location</Popup>
              </Marker>
              <Marker position={vendorPos} icon={createCustomIcon('VENDOR')}>
                <Popup>{booking.vendor?.name || 'Vendor'} is here</Popup>
              </Marker>
              <Polyline positions={[vendorPos, userPos]} color="#6366f1" weight={4} dashArray="10, 10" />
            </MapContainer>
            
            {/* Top-Left Live Speed & ETA Overlay */}
            <div className="absolute top-6 left-6 z-[400] flex gap-3">
              <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center">
                  <Navigation size={20} className="animate-pulse" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Arrival</div>
                  <div className="text-xl font-black text-slate-900">{booking.status === 'ON_THE_WAY' ? `${etaMins} Mins` : booking.status === 'IN_PROGRESS' ? 'Arrived' : 'Pending'}</div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 hidden sm:flex items-center gap-3">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Distance</div>
                  <div className="text-xl font-black text-slate-900">{distanceKm} KM</div>
                </div>
              </div>
            </div>

            {/* Recenter Button */}
            <button 
              onClick={() => {
                if (mapRef.current) {
                  mapRef.current.setView(vendorPos, 13)
                }
              }}
              className="absolute bottom-6 right-6 z-[400] bg-slate-900 text-white px-4 py-3 rounded-2xl text-xs font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <Navigation size={14} /> Recenter Vehicle
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-slate-900"><MapPin size={18} className="text-primary-600" /> Service Address</h3>
              <p className="text-slate-600 leading-relaxed text-sm font-medium">{booking.address}</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-slate-900"><Phone size={18} className="text-primary-600" /> Service Professional</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-tr from-primary-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-black text-lg shadow-md">
                    {booking.vendor?.name ? booking.vendor.name[0] : 'V'}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{booking.vendor?.name || 'Vendor'}</div>
                    <div className="text-xs text-slate-500 font-medium">{booking.vendor?.phone || 'Contact via chat'}</div>
                  </div>
                </div>
                {booking.vendor && (
                  <Link 
                    to={`/chat/${booking.vendor.id}?bookingId=${booking.id}`}
                    className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-md"
                  >
                    <MessageSquare size={18} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingTracking
