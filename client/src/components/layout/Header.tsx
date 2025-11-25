import { Link } from '@tanstack/react-router'
import favicon from '../../assets/favicon.svg'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tight text-slate-100 hover:text-sky-400 transition-colors flex items-center">
            <img src={favicon} alt="Favicon" className="w-6 h-6 mr-2" />
            Car Trading Companion
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors [&.active]:text-white"
            >
              Home
            </Link>
            <Link 
              to="/browse" 
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors [&.active]:text-white"
            >
              Browse cars
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button 
            className="hidden md:flex items-center gap-2 text-sm font-medium text-sky-400 hover:text-sky-300 transition-colors"
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-ai-chat'))}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19 7-7 3 3-7 7-3-3z"/>
              <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
              <path d="m2 2 7.586 7.586"/>
              <circle cx="11" cy="11" r="2"/>
            </svg>
            Ask the AI assistant
          </button>

          <div className="flex items-center gap-4 border-l border-slate-800 pl-4">
            <Link 
              to="/login" 
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link 
              to="/signup" 
              className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 transition-colors"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile menu button placeholder */}
          <button className="md:hidden p-2 text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
