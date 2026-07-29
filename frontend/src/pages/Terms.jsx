import React from 'react'

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="bg-white rounded-3xl p-10 md:p-16 shadow-sm border border-slate-100 space-y-10">
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-slate-900">Terms & Conditions</h1>
          <p className="text-slate-500 font-medium italic">Last updated: April 24, 2026</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p className="text-slate-600 leading-relaxed">
            By accessing or using the GharFix platform, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, please do not use our services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">2. Service Bookings</h2>
          <p className="text-slate-600 leading-relaxed">
            GharFix acts as a facilitator between users and independent service providers (Vendors). We do not directly provide home services and are not responsible for the actual quality of work, although we vet our professionals.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">3. The Bargaining System</h2>
          <p className="text-slate-600 leading-relaxed">
            Prices agreed upon via the bargaining system are final. Users must pay the agreed amount directly to the vendor upon completion of the service. GharFix does not handle payments in the current version.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">4. Cancellation Policy</h2>
          <p className="text-slate-600 leading-relaxed">
            Cancellations are permitted until the professional has changed the status to "On The Way". Repeated late cancellations may lead to account suspension.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">5. Limitation of Liability</h2>
          <p className="text-slate-600 leading-relaxed">
            GharFix is not liable for any damages, losses, or disputes arising from the services provided by vendors. Users are encouraged to verify the professional before allowing entry into their premises.
          </p>
        </section>

        <div className="pt-10 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-400">Questions? Contact us at dixitsaurabh416@gmail.com</p>
        </div>
      </div>
    </div>
  )
}

export default Terms
