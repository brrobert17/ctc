export function HowItWorksSection() {
  return (
    <section id="trust-section" className="py-20 bg-slate-950 relative">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-sky-500/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Simple, transparent, and fast</h2>
          <p className="text-slate-400">We've stripped away the complexity of finding value in the used car market.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-slate-800 via-sky-900 to-slate-800 -z-10"></div>

          {/* Card 1 */}
          <div className="group relative bg-gradient-to-b from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-sky-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-900/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-400 text-xs font-bold px-3 py-1 rounded-full group-hover:text-sky-400 group-hover:border-sky-500/50 transition-colors">
              STEP 1
            </div>
            <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center mx-auto mb-6 text-sky-500 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/50">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">We gather listings</h3>
            <p className="text-slate-400 leading-relaxed">
              We scan multiple marketplaces like Bilbasen and DBA constantly, pulling everything into one unified feed.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative bg-gradient-to-b from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-sky-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-900/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-400 text-xs font-bold px-3 py-1 rounded-full group-hover:text-sky-400 group-hover:border-sky-500/50 transition-colors">
              STEP 2
            </div>
            <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center mx-auto mb-6 text-sky-500 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/50">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20"/>
                <path d="M2 12h20"/>
                <path d="m4.929 4.929 14.14 14.14"/>
                <path d="m4.929 19.07 14.14-14.14"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI analyzes value</h3>
            <p className="text-slate-400 leading-relaxed">
              Our algorithms process thousands of data points—mileage, equipment, history—to estimate the fair market price.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative bg-gradient-to-b from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-400 text-xs font-bold px-3 py-1 rounded-full group-hover:text-emerald-400 group-hover:border-emerald-500/50 transition-colors">
              STEP 3
            </div>
            <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center mx-auto mb-6 text-emerald-500 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/50">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">You spot the deal</h3>
            <p className="text-slate-400 leading-relaxed">
              Instantly see which cars are <span className="text-emerald-400 font-medium">Underpriced</span> and save hours of research time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
