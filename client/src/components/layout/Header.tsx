import { Link } from '@tanstack/react-router'
import { useAuth } from '../../contexts/AuthContext'
import favicon from '../../assets/favicon.svg'
import ProfileIcon from '../ui/ProfileIcon'
import { useState } from 'react'

export function Header() {
  const { user, isLoggedIn, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

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
          <Link 
            to="/estimate"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-sky-400 hover:text-sky-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            Get Estimation
          </Link>

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
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  {user && <ProfileIcon user={user} size="md" />}
                  <span className="text-sm text-slate-300 hidden sm:block">
                    {user?.firstName}
                  </span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 rounded-md shadow-lg border border-slate-700 z-50">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        View Profile
                      </Link>
                      <div className="border-t border-slate-700 my-1"></div>
                      <button
                        onClick={() => {
                          logout()
                          setShowUserMenu(false)
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
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
              </>
            )}
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
      
      {/* Overlay to close dropdown when clicking outside */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  )
}
