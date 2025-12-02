import { useState } from 'react'

export function TrustSection() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <section className="bg-slate-950 py-16 mb-12">
        <div className="container mx-auto px-4">
          {/* Gradient Border Container */}
          <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-sky-500/30 via-slate-700 to-emerald-500/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-transparent to-emerald-500/10 opacity-50"></div>
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 p-8 bg-slate-900 rounded-2xl backdrop-blur-xl">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-4">How our pricing works (in short)</h3>
                <ul className="space-y-3 text-slate-300 text-lg">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-sky-400 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>
                    Trained on historical used car listings
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-sky-400 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>
                    Shows which factors influence the price
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-sky-400 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>
                    Explains everything in plain language
                  </li>
                </ul>
              </div>
              
              <div className="shrink-0">
                <button 
                  onClick={() => setShowModal(true)}
                  className="group flex items-center gap-2 text-sky-400 hover:text-white font-medium transition-colors px-6 py-3 rounded-lg border border-sky-500/30 hover:bg-sky-500/10 hover:border-sky-500/50"
                >
                  Read the full explanation
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-slate-900 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl border border-slate-700 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">How We Estimate Prices</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-4 text-slate-300 leading-relaxed">
              <p>
                Our pricing model is built on machine learning algorithms that analyze thousands of car listings from various marketplaces every day.
              </p>
              <p>
                We look at specific attributes like:
              </p>
              <ul className="list-disc pl-5 space-y-1 marker:text-sky-500">
                <li><strong>Make, Model, and Year:</strong> The baseline value of the vehicle.</li>
                <li><strong>Mileage:</strong> Higher mileage typically lowers the value.</li>
                <li><strong>Equipment & Trim:</strong> Premium features can increase the value.</li>
                <li><strong>Market Trends:</strong> Seasonal demand and supply changes.</li>
              </ul>
              <p>
                When we say a car is "Underpriced", it means the asking price is significantly lower than our estimated fair market value for a similar vehicle. However, we always recommend inspecting the car personally, as our model cannot see physical damage or mechanical issues not listed in the description.
              </p>
            </div>
            <div className="p-6 border-t border-slate-800 text-right">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
