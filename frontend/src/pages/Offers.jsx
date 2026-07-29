import React from 'react'
import { Ticket, Zap, Gift, Clock } from 'lucide-react'

const Offers = () => {
  const coupons = [
    { code: 'FIRSTFIX', discount: '20% OFF', desc: 'Valid on your first booking above ₹500', color: 'bg-primary-600' },
    { code: 'SUMMER2026', discount: '₹200 OFF', desc: 'Valid on all AC Services', color: 'bg-emerald-600' },
    { code: 'CLEANHOME', discount: '15% OFF', desc: 'On deep cleaning of 2+ washrooms', color: 'bg-blue-600' },
  ]

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900">Exclusive Offers 🎁</h1>
        <p className="text-slate-500">Save more on your home maintenance with these handpicked deals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {coupons.map((c, idx) => (
          <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex h-40 relative group cursor-pointer hover:shadow-xl transition-all">
            <div className={`w-32 ${c.color} flex flex-col items-center justify-center text-white p-4 relative`}>
              <div className="text-2xl font-black">{c.discount}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest mt-2">Discount</div>
              {/* Decorative circles for coupon effect */}
              <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white rounded-full -translate-y-1/2"></div>
            </div>
            <div className="flex-1 p-6 flex flex-col justify-center">
              <div className="text-xl font-bold text-slate-900 mb-1">{c.code}</div>
              <p className="text-sm text-slate-500 leading-tight">{c.desc}</p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Clock size={12} /> Expires in 3 days
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[40px] p-10 md:p-16 text-center text-white space-y-8 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl font-bold italic">"GharFix Referral Program"</h2>
          <p className="text-slate-400 max-w-lg mx-auto">Refer a friend and get ₹100 credit on your next booking when they complete their first service.</p>
          <button className="px-10 py-4 bg-primary-600 text-white rounded-2xl font-bold hover:scale-105 transition-transform inline-flex items-center gap-2">
            <Gift size={20} /> Invite Friends
          </button>
        </div>
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>
    </div>
  )
}

export default Offers
