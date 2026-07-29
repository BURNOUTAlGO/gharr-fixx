import React from 'react'
import { HelpCircle, MessageSquare, Phone, Mail, ChevronDown } from 'lucide-react'

const HelpSupport = () => {
  const faqs = [
    { q: "How do I book a service?", a: "Simply browse the home page, select a service, choose a professional, and place your request. You can even bargain for a better price!" },
    { q: "Can I cancel my booking?", a: "Yes, you can cancel any booking from your dashboard before the professional is 'On The Way'." },
    { q: "How does bargaining work?", a: "You can propose a price while booking. The vendor can accept, reject, or give a counter-offer. Once both agree, the price is locked." },
    { q: "How do I pay?", a: "Currently, we support 'Pay After Service' directly to the professional via Cash or UPI." }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900">How can we help?</h1>
        <p className="text-slate-500 text-lg">Find answers to common questions or reach out to our team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center space-y-4">
          <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto">
            <Phone size={24} />
          </div>
          <h3 className="font-bold">Call Us</h3>
          <p className="text-sm text-slate-500">+91 7985834815</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <MessageSquare size={24} />
          </div>
          <h3 className="font-bold">Live Chat</h3>
          <p className="text-sm text-slate-500">Available 24/7</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center space-y-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <Mail size={24} />
          </div>
          <h3 className="font-bold">Email Support</h3>
          <p className="text-sm text-slate-500">dixitsaurabh416@gmail.com</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><HelpCircle className="text-primary-600" /> Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-6 bg-slate-50 rounded-2xl">
              <div className="flex justify-between items-center cursor-pointer">
                <h4 className="font-bold text-slate-800">{faq.q}</h4>
                <ChevronDown size={20} className="text-slate-400" />
              </div>
              <p className="mt-4 text-slate-600 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HelpSupport
