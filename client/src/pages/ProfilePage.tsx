import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from '@tanstack/react-router'
import ProfileIcon from '../components/ui/ProfileIcon'
import { useState } from 'react'
import { deleteUser } from '../utils/auth'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  if (!user) {
    navigate({ to: '/login' })
    return null
  }

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true)
      await deleteUser()
    
      logout()
      navigate({ to: '/' })
    } catch (error) {
      console.error('Failed to delete account:', error)

    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-8 mb-6">
          <div className="text-center">
            {/* Large Profile Picture */}
            <div className="flex justify-center mb-6">
              <ProfileIcon user={user} size="lg" className="w-24 h-24" />
            </div>
            
            {/* User Name */}
            <h1 className="text-2xl font-bold text-white mb-2">
              {user.firstName} {user.lastName}
            </h1>
            
            {/* User Email */}
            <p className="text-slate-400 mb-4">{user.email}</p>
            
            {/* Provider Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-sm text-slate-300">
              {user.provider === 'google' ? (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Signed in with Google
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  Car Trade Companion Account
                </>
              )}
            </div>
          </div>
        </div>

        {/* User Information Section */}
        <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Account Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-400">First Name</span>
              <span className="text-white">{user.firstName}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-400">Last Name</span>
              <span className="text-white">{user.lastName}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-400">Email Address</span>
              <span className="text-white">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">Account Type</span>
              <span className="text-white capitalize">{user.provider} Account</span>
            </div>
          </div>
        </div>

        {/* Subscription Section */}
        <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Subscription</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Free Plan</p>
              <p className="text-slate-400 text-sm">Basic features included</p>
            </div>
            <button className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-500 transition-colors">
              Upgrade Plan
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-900/20 rounded-lg border border-red-800 p-6">
          <h2 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Delete Account</p>
              <p className="text-slate-400 text-sm">Permanently delete your account and all data</p>
            </div>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-900 rounded-lg border border-slate-700 p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-white mb-4">Delete Account</h3>
              <p className="text-slate-300 mb-6">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
