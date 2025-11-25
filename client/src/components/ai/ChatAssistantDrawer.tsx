import { useState, useEffect } from 'react'

export function ChatAssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev)
    window.addEventListener('toggle-ai-chat', handleToggle)
    return () => window.removeEventListener('toggle-ai-chat', handleToggle)
  }, [])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 shadow-xl border-l border-slate-800 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">AI Assistant</h2>
              <p className="text-xs text-slate-400">Ask about prices, cars, or advice</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  AI
                </div>
                <div className="bg-slate-800 rounded-lg rounded-tl-none p-3 text-sm text-slate-200">
                  <p>Hello! I'm here to help you find a great car deal. You can ask me about car prices, specific models, or what to look for when buying.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-800">
             <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
               <button className="text-xs bg-slate-800 text-sky-400 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-slate-700">
                 What affects car prices?
               </button>
               <button className="text-xs bg-slate-800 text-sky-400 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-slate-700">
                 Help me choose
               </button>
             </div>
             <div className="relative">
               <input 
                 type="text" 
                 placeholder="Ask something..."
                 className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 pl-3 pr-10 text-sm text-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
               />
               <button className="absolute right-2 top-1/2 -translate-y-1/2 text-sky-500 hover:text-sky-400">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <line x1="22" y1="2" x2="11" y2="13"/>
                   <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                 </svg>
               </button>
             </div>
          </div>
        </div>
      </div>
    </>
  )
}
