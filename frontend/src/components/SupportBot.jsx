import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot, User } from 'lucide-react'

const SupportBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hi! I am the GharFix Assistant ⚡. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const botResponses = {
    'price': 'At GharFix, you can bargain! Just enter your price while booking and wait for the vendor to accept.',
    'bargain': 'You can propose a price. The vendor might counter it. Once you both agree, the booking is confirmed!',
    'track': 'You can track your service in real-time from your Dashboard. Just click "Track" on any active booking.',
    'cancel': 'You can cancel a booking from your dashboard as long as the status is not "On The Way".',
    'payment': 'Currently, we support Pay After Service. You can pay the vendor directly via Cash or UPI.',
    'hello': 'Hello! Hope you are having a great day. Need help with a booking?',
    'hi': 'Hi there! How can I assist you with your home services today?',
    'support': 'You can contact our official support at dixitsaurabh416@gmail.com or call +91 7985834815.',
    'contact': 'Our support team is available at +91 7985834815 or dixitsaurabh416@gmail.com.',
    'vendor': 'If you are a vendor, you can manage your services and requests from the Vendor Dashboard.',
    'booking': 'To book, go to the Home page, select a service, and click "Book Now".'
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = input.trim()
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setIsTyping(true)

    // Simulate Bot Response
    setTimeout(() => {
      let response = "I'm not sure about that. Try asking about 'pricing', 'tracking', 'booking' or type 'support' to get our contact details!"
      
      const lowerMsg = userMsg.toLowerCase()
      for (const key in botResponses) {
        if (lowerMsg.includes(key)) {
          response = botResponses[key]
          break
        }
      }

      setMessages(prev => [...prev, { role: 'bot', content: response }])
      setIsTyping(false)
    }, 800)
  }

  return (
    <div className="fixed bottom-6 right-6 z-[1000]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-80 md:w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-primary-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold">GharFix Assistant</h3>
                  <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Online & Ready</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                    ? 'bg-primary-600 text-white rounded-tr-none shadow-lg shadow-primary-100' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></span>
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Suggestions */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto bg-white border-t border-slate-50 no-scrollbar">
              {['Pricing', 'Tracking', 'Support', 'Booking'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => setInput(tag)}
                  className="whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-primary-50 hover:text-primary-600 rounded-lg text-xs font-bold text-slate-500 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <input 
                type="text" 
                placeholder="Ask me something..."
                className="flex-1 px-4 py-2 bg-slate-50 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none border-none"
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button type="submit" className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all">
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary-200 z-[1000]"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></span>
        )}
      </motion.button>
    </div>
  )
}

export default SupportBot
