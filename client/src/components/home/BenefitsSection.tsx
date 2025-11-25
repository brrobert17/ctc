export function BenefitsSection() {
  return (
    <section className="py-20 md:py-24 bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Why people use Car Trading Companion</h2>
          <p className="text-slate-400 text-lg">We make it easier for everyone to buy a used car without getting ripped off.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Benefit 1 */}
          <div className="p-8 rounded-xl bg-slate-900/50 border border-slate-800 hover:bg-slate-900 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 mb-6 group-hover:bg-emerald-500/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">See if a listing is underpriced</h3>
            <p className="text-slate-400 leading-relaxed">
              Our "Fairly priced" and "Underpriced" badges help you filter out the noise and focus on the best deals instantly.
            </p>
          </div>
          
          {/* Benefit 2 */}
          <div className="p-8 rounded-xl bg-slate-900/50 border border-slate-800 hover:bg-slate-900 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 bg-sky-500/10 rounded-lg flex items-center justify-center text-sky-500 mb-6 group-hover:bg-sky-500/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" x2="9" y1="3" y2="21"/></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sky-400 transition-colors">Compare cars in one place</h3>
            <p className="text-slate-400 leading-relaxed">
              Stop jumping between different browser tabs. See listings from multiple sites side-by-side in a unified interface.
            </p>
          </div>
          
          {/* Benefit 3 */}
          <div className="p-8 rounded-xl bg-slate-900/50 border border-slate-800 hover:bg-slate-900 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-500 mb-6 group-hover:bg-purple-500/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">Built for non-experts</h3>
            <p className="text-slate-400 leading-relaxed">
              Plain language, helpful tooltips, and an AI assistant to answer your questions instantly without the jargon.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
