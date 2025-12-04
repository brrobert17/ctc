import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../contexts/AuthContext'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const handleOAuthCallback = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')
      const userId = urlParams.get('userId')
      const email = urlParams.get('email')
      const firstName = urlParams.get('firstName')
      const lastName = urlParams.get('lastName')
      const provider = urlParams.get('provider')
      const profilePicture = urlParams.get('profilePicture')

      if (token && userId && email && firstName && lastName) {
        // Login user with OAuth data
        login(token, {
          userId,
          email,
          firstName,
          lastName,
          provider: provider || 'google',
          profilePicture: profilePicture ? decodeURIComponent(profilePicture) : undefined,
        })
        
        // Redirect to dashboard
        navigate({ to: '/' })
      } else {
        // OAuth failed, redirect to login with error
        navigate({ to: '/login' })
      }
    }

    handleOAuthCallback()
  }, [login, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
        <p className="mt-4 text-slate-400">Completing sign in...</p>
      </div>
    </div>
  )
}
