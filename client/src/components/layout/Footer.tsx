import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-lg font-bold text-slate-100">Car Trading Companion</span>
            <p className="text-sm text-slate-400">
              Empowering car buyers with AI-driven price insights.
            </p>
          </div>
          
          <div className="flex gap-6 text-sm text-slate-400">
            <Link to="/" className="hover:text-sky-400 transition-colors">About</Link>
            <Link to="/" className="hover:text-sky-400 transition-colors">Privacy</Link>
            <Link to="/" className="hover:text-sky-400 transition-colors">Terms</Link>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-900 text-center">
          <p className="text-xs text-slate-500">
            Car Trading Companion provides advisory estimates only. Always verify details with the seller.
          </p>
          <p className="text-xs text-slate-600 mt-2">
            © {new Date().getFullYear()} Car Trading Companion. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
