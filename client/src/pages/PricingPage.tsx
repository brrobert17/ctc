import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

type CheckoutResponse = {
  url: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function PricingPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tier = user?.tier || 'FREE'

  const goToCheckout = async () => {
    try {
      if (tier === 'LIFETIME') return

      setIsLoading(true)
      setError(null)

      const res = await fetch(`${API_BASE_URL}/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              name: 'Lifetime Plan',
              unit_amount: 4999,
              quantity: 1,
            },
          ],
        }),
      })

      const data = (await res.json()) as Partial<CheckoutResponse> & { error?: string }

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to create checkout session')
      }

      if (!data.url) {
        throw new Error('Stripe checkout URL missing from response')
      }

      window.location.href = data.url
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Choose your plan</h1>
          <p className="text-slate-400 mt-3">Upgrade once and keep lifetime access.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Free</h2>
                <p className="text-slate-400 text-sm mt-1">Basic browsing experience</p>
              </div>
              <div className="text-right">
                <p className="text-white text-2xl font-bold">0 DKK</p>
                <p className="text-slate-400 text-xs">forever</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-sky-400">✓</span>
                <span>Browse listings</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sky-400">✓</span>
                <span>View car details</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-400">×</span>
                <span>Car price estimation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-400">×</span>
                <span>AI assistant (LLM chat)</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-lg border border-sky-700/60 p-8 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-sky-600/10 blur-2xl" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-sky-600/10 blur-2xl" />

            <div className="flex items-start justify-between gap-4 relative">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-600/15 border border-sky-700/40 text-sky-300 text-xs mb-3">
                  Best value
                </div>
                <h2 className="text-xl font-semibold text-white">Lifetime</h2>
                <p className="text-slate-400 text-sm mt-1">One-time payment for lifelong membership</p>
              </div>
              <div className="text-right">
                <p className="text-white text-3xl font-bold">49.99 DKK</p>
                <p className="text-slate-400 text-xs">one-time</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-slate-200 relative">
              <div className="flex items-center gap-2">
                <span className="text-sky-400">✓</span>
                <span>Car price estimation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sky-400">✓</span>
                <span>AI assistant (LLM chat)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sky-400">✓</span>
                <span>Everything in Free</span>
              </div>

              <div className="pt-4">
                <button
                  onClick={goToCheckout}
                  disabled={isLoading || tier === 'LIFETIME'}
                  className="w-full px-4 py-3 bg-sky-600 text-white rounded-md hover:bg-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {tier === 'LIFETIME' ? 'Already on Lifetime' : isLoading ? 'Redirecting…' : 'Buy lifetime access'}
                </button>

                {tier === 'LIFETIME' && (
                  <p className="text-emerald-400 text-sm mt-3">Your Lifetime plan is active.</p>
                )}

                {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

                <p className="text-slate-400 text-xs mt-3">
                  Secure checkout powered by Stripe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
