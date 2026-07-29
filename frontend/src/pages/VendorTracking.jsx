import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { 
  Check, Truck, Play, CheckCircle2, Clock, 
  MapPin, Phone, MessageSquare, Navigation, ArrowLeft
} from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'

// Custom Leaflet DivIcons
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

const VendorTracking = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const mapRef = useRef(null)
  
  // Simulated positions
  const [vendorPos, setVendorPos] = useState([12.9616, 77.5846])
  const customerPos = [12.9816, 77.6046]

  useEffect(() => {
    fetchBooking()
    const interval = setInterval(fetchBooking, 5000)
    return () => clearInterval(interval)
  }, [id])

  // Move vendor closer to customer if "ON_THE_WAY"
  useEffect(() => {
    if (booking?.status === 'ON_THE_WAY') {
      const moveInterval = setInterval(() => {
        setVendorPos(prev => {
          const latDiff = customerPos[0] - prev[0]
          const lngDiff = customerPos[1] - prev[1]
          if (Math.abs(latDiff) < 0.0005 && Math.abs(lngDiff) < 0.0005) return customerPos
          return [prev[0] + latDiff * 0.08, prev[1] + lngDiff * 0.08]
        })
      }, 2500)
      return () => clearInterval(moveInterval)
    }
  }, [booking?.status])

  const fetchBooking = async () => {
    try {
      const res = await axios.get('/api/bookings/vendor')
      const found = res.data.find(b => b.id === Number(id))
      setBooking(found)
    } catch (err) {
      console.error('Error fetching booking:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (status) => {
    try {
      await axios.put(`/api/bookings/${id}/status?status=${status}`)
      fetchBooking()
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

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

  const distanceKm = getDistanceKm(vendorPos, customerPos)

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold">Loading navigator...</div>
  if (!booking) return <div className="p-20 text-center text-slate-400 font-bold font-bold">Job not found</div>

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/vendor/dashboard')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-primary-600 transition-colors">
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
          booking.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-primary-50 text-primary-600'
        }`}>
          Job Status: {booking.status.replace('_', ' ')}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Job Details & Controls */}
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-md">
                {booking.user.name[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{booking.user.name}</h2>
                <p className="text-sm font-extrabold text-primary-600">{booking.service.name}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1"><MapPin size={10} /> Destination Address</p>
              <p className="text-sm font-bold text-slate-700">{booking.address}</p>
            </div>

            <div className="flex gap-2">
              <a href={`tel:${booking.user.phone}`} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
                <Phone size={18} /> Call
              </a>
              <Link to={`/chat/${booking.user.id}?bookingId=${booking.id}`} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
                <MessageSquare size={18} /> Chat
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-900">Update Job Status</h3>
            <div className="space-y-3">
              {booking.status === 'ACCEPTED' && (
                <button onClick={() => updateStatus('ON_THE_WAY')} className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-100 hover:bg-primary-700 transition-all flex items-center justify-center gap-2">
                  <Truck size={20} /> Start Heading There
                </button>
              )}
              {booking.status === 'ON_THE_WAY' && (
                <button onClick={() => updateStatus('IN_PROGRESS')} className="w-full py-4 bg-amber-500 text-white rounded-2xl font-bold shadow-lg shadow-amber-100 hover:bg-amber-600 transition-all flex items-center justify-center gap-2">
                  <Play size={20} /> I Have Arrived
                </button>
              )}
              {booking.status === 'IN_PROGRESS' && (
                <button onClick={() => updateStatus('COMPLETED')} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 size={20} /> Job Completed
                </button>
              )}
              {booking.status === 'COMPLETED' && (
                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-center font-bold text-sm border border-emerald-100">
                  🎉 Excellent! This job is finished.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Navigation Map */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200 border-8 border-white h-[600px] relative">
            <MapContainer ref={mapRef} center={vendorPos} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={customerPos} icon={createCustomIcon('USER')}>
                <Popup>Customer: {booking.user.name}</Popup>
              </Marker>
              <Marker position={vendorPos} icon={createCustomIcon('VENDOR')}>
                <Popup>You are here</Popup>
              </Marker>
              <Polyline positions={[vendorPos, customerPos]} color="#6366f1" weight={4} dashArray="15, 15" />
            </MapContainer>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[400] w-full max-w-sm px-4">
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-2xl flex items-center justify-between border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary-400">
                    <Navigation size={24} className="animate-pulse" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Navigation</div>
                    <div className="text-lg font-black italic">Go to {booking.user.name.split(' ')[0]}'s House</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">{distanceKm} KM</div>
                  <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Distance</div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                if (mapRef.current) mapRef.current.setView(vendorPos, 13)
              }}
              className="absolute top-6 right-6 z-[400] bg-white text-slate-900 px-4 py-3 rounded-2xl text-xs font-bold shadow-xl hover:bg-slate-50 transition-all flex items-center gap-2 border border-slate-200"
            >
              <Navigation size={14} className="text-primary-600" /> Center My Location
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorTracking
