import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Star, Clock, Shield, ArrowRight, Filter } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BookingModal from '../components/BookingModal'

const Home = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedService, setSelectedService] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await axios.get('/api/services')
      setServices(res.data)
    } catch (err) {
      console.error('Error fetching services:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleServiceClick = (service) => {
    if (!user) {
      navigate('/login')
      return
    }
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const categories = [
    'All', 'Cleaning', 'Laundry', 'Repair', 'Beauty', 'Painting', 
    'Pest Control', 'Carpentry', 'Smart Home', 'Tech Support', 'Gardening', 'Automobile'
  ]

  const filteredServices = services.filter(s => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-12 pb-20">
      {/* Categories Section */}
      <div id="categories" className="py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Filter size={24} className="text-primary-600" /> Popular Categories
          </h2>
          <div className="text-sm font-bold text-primary-600 cursor-pointer hover:underline">View All</div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-4 rounded-3xl font-bold transition-all whitespace-nowrap border ${
                selectedCategory === cat 
                ? 'bg-primary-600 text-white border-primary-600 shadow-xl shadow-primary-200 scale-105' 
                : 'bg-white text-slate-600 border-slate-100 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative rounded-[40px] overflow-hidden bg-slate-900 py-20 px-8 text-center text-white">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=1200" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black leading-tight"
          >
            Expert Home Services, <br />
            <span className="text-primary-400 italic">Instantly.</span>
          </motion.h1>
          <p className="text-lg text-slate-300 font-medium">Bargain for the best price and track your professional in real-time.</p>
          
          <div className="bg-white p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-2xl max-w-2xl mx-auto">
            <div className="flex-1 flex items-center px-4 gap-2 text-slate-400 border-b md:border-b-0 md:border-r border-slate-100 py-2">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="What service do you need?" 
                className="w-full bg-transparent outline-none text-slate-900 font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center px-4 gap-2 text-slate-400 py-2">
              <MapPin size={20} />
              <span className="text-slate-900 font-bold whitespace-nowrap">Current Location</span>
            </div>
            <button className="bg-primary-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-700 transition-all">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black text-slate-900">
            {selectedCategory === 'All' ? 'Trending' : selectedCategory} Services
          </h2>
          <span className="text-slate-400 font-bold text-sm">{filteredServices.length} available</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => <div key={n} className="h-80 bg-slate-100 rounded-[32px] animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode='popLayout'>
              {filteredServices.map((service) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={service.id} 
                  className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-primary-100 transition-all"
                >
                  <div className="h-56 relative overflow-hidden">
                    <img 
                      src={service.imageUrl || "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800"} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl text-xs font-bold text-slate-900 shadow-sm uppercase tracking-widest">
                      {service.category}
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-primary-600 transition-colors">{service.name}</h3>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-xl text-xs font-bold">
                        <Star size={14} fill="currentColor" /> 4.8
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{service.description}</p>
                    <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Starting from</p>
                        <p className="text-2xl font-black text-primary-600">₹{service.basePrice}<span className="text-xs text-slate-400 font-bold ml-1">/{service.unit}</span></p>
                      </div>
                      <button 
                        onClick={() => handleServiceClick(service)}
                        className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-primary-600 transition-all shadow-lg shadow-slate-100"
                      >
                        <ArrowRight size={24} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {selectedService && (
        <BookingModal 
          service={selectedService}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => navigate('/user/dashboard')}
        />
      )}

      {/* Why Choose Us Section ... */}
    </div>
  )
}

export default Home
