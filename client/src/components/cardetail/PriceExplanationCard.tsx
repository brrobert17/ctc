export function PriceExplanationCard() {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
      <h3 className="text-lg font-bold text-white mb-4">Why we think this price is <span className="text-emerald-400">Underpriced</span></h3>
      
      <p className="text-slate-400 mb-6">
        This car is listed for 129,900 DKK, which is approximately 5,100 DKK below our estimated fair market value. This is likely a good deal.
      </p>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-500">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
            </span>
            <span className="text-slate-300 text-sm">Low Mileage</span>
          </div>
          <span className="text-emerald-400 text-xs font-medium">Increases Value</span>
        </div>

        <div className="w-full bg-slate-800 h-1.5 rounded-full">
          <div className="bg-emerald-500 h-1.5 rounded-full w-[70%]"></div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-500">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </span>
            <span className="text-slate-300 text-sm">Popular Model</span>
          </div>
          <span className="text-emerald-400 text-xs font-medium">High Demand</span>
        </div>
         
        <div className="w-full bg-slate-800 h-1.5 rounded-full">
          <div className="bg-emerald-500 h-1.5 rounded-full w-[85%]"></div>
        </div>

         <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-red-500/10 text-red-500">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </span>
            <span className="text-slate-300 text-sm">Older than avg (2019)</span>
          </div>
          <span className="text-red-400 text-xs font-medium">Decreases Value</span>
        </div>
         
        <div className="w-full bg-slate-800 h-1.5 rounded-full">
          <div className="bg-red-500 h-1.5 rounded-full w-[40%]"></div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800 text-center">
        <button className="text-sky-400 text-sm hover:text-sky-300 font-medium underline underline-offset-4 decoration-sky-400/30 hover:decoration-sky-300">
          Learn more about how our pricing works
        </button>
      </div>
    </div>
  )
}
