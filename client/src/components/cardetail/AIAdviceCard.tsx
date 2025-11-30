export function AIAdviceCard() {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-white">AI advice for this car</h3>
        <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white text-xs font-bold">AI</div>
      </div>

      <div className="space-y-4 text-slate-300 text-sm">
        <div className="flex gap-3">
          <div className="mt-1 text-sky-500 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          </div>
          <div>
            <p className="font-semibold text-white mb-1">Things to check:</p>
            <p>This Golf model year (2019) sometimes has issues with the infotainment screen freezing. Check if it has been updated.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="mt-1 text-sky-500 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          </div>
          <div>
            <p className="font-semibold text-white mb-1">Questions to ask the seller:</p>
            <p>"Has the timing belt been inspected recently?" and "Do you have the full service history visible?"</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="mt-1 text-sky-500 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
          </div>
          <div>
            <p className="font-semibold text-white mb-1">Test drive tip:</p>
            <p>Listen for any rattling noise when starting the engine cold, and test the clutch bite point.</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800">
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-ai-chat'))}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-sky-400 font-medium py-3 rounded-md transition-colors border border-slate-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
          Ask more questions about this car
        </button>
      </div>
    </div>
  )
}
