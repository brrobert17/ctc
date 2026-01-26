import { useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { fetchWithAuth } from '../utils/auth'
import { useAuth } from '../contexts/AuthContext'

export default function CheckoutSuccessPage() {
  const search = useSearch({ strict: false }) as { session_id?: string }
  const { user, updateUser } = useAuth()
  const [status, setStatus] = useState<'idle' | 'upgrading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const sessionId = search?.session_id
    if (!sessionId) return

    const confirmCheckoutSession = async () => {
      try {
        setStatus('upgrading')
        setMessage(null)

        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

        const res = await fetchWithAuth(`${API_BASE_URL}/stripe/confirm-checkout-session`, {
          method: 'POST',
          body: JSON.stringify({ sessionId }),
        })

        const data = await res.json().catch(() => ({}))

        if (!res.ok) {
          throw new Error(data?.error || 'Failed to confirm payment')
        }

        if (user) {
          updateUser({ ...user, tier: 'LIFETIME' })
        }

        setStatus('done')
        setMessage('Your account has been upgraded to Lifetime.')
      } catch (e: any) {
        setStatus('error')
        setMessage(e?.message ?? 'Something went wrong while upgrading your account')
      }
    }

    confirmCheckoutSession()
  }, [search?.session_id])

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-8">
          <h1 className="text-2xl font-bold text-white">Payment successful</h1>
          <p className="text-slate-300 mt-3">
            Thanks for your purchase. You now have lifetime access.
          </p>
          {status === 'upgrading' && <p className="text-slate-400 text-sm mt-4">Upgrading your account…</p>}
          {status === 'done' && message && <p className="text-emerald-400 text-sm mt-4">{message}</p>}
          {status === 'error' && message && <p className="text-red-400 text-sm mt-4">{message}</p>}
          {search?.session_id && (
            <p className="text-slate-400 text-sm mt-4">Session: {search.session_id}</p>
          )}
        </div>
      </div>
    </div>
  )
}
