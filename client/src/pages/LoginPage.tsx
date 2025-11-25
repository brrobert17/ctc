import { Link } from '@tanstack/react-router'

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Log in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Or{' '}
            <Link to="/signup" className="font-medium text-sky-500 hover:text-sky-400">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={e => e.preventDefault()}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-t-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-sky-600 focus:ring-sky-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-sky-500 hover:text-sky-400">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-300 group-hover:text-sky-200"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              Log in
            </button>
          </div>
        </form>
        
        <div className="relative">
           <div className="absolute inset-0 flex items-center">
             <div className="w-full border-t border-slate-800"></div>
           </div>
           <div className="relative flex justify-center text-sm">
             <span className="bg-slate-950 px-2 text-slate-500">Or continue with</span>
           </div>
        </div>
        
        <button className="flex w-full justify-center items-center gap-3 rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-950">
           <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24"><path d="M12.0003 20.45c-4.6669 0-8.45-3.7831-8.45-8.45 0-4.6669 3.7831-8.45 8.45-8.45 4.6669 0 8.45 3.7831 8.45 8.45 0 4.6669-3.7831 8.45-8.45 8.45Z" fill="#fff" fillOpacity="0" stroke="currentColor" strokeWidth="2"/><path d="M20.3998 12.231c0-.576-.048-1.129-.141-1.663H11.9998v3.144h4.7129c-.203.1.096.818-.448 2.047l-.002.025 2.593 2.008c1.516-1.398 2.391-3.458 2.391-5.876Z" fill="#4285F4"/><path d="M11.9996 20.7999c2.361 0 4.3419-.783 5.7888-2.119l-2.596-2.01c-.7831.526-1.7848.838-3.1928.838-2.2778 0-4.2068-1.539-4.8938-3.608l-.024.002-2.694 2.087.008.023c1.438 2.854 4.383 4.787 7.604 4.787Z" fill="#34A853"/><path d="M7.1059 13.9009c-.175-.526-.275-1.089-.275-1.668s.1-1.142.275-1.668l-.002-.026-2.707-2.104-.012.006c-.687 1.369-1.079 2.919-1.079 4.556s.392 3.187 1.079 4.556l2.721-2.116Z" fill="#FBBC05"/><path d="M11.9996 7.49996c1.284 0 2.436.442 3.342 1.308l2.505-2.505C16.3376 4.88596 14.3576 4 11.9996 4c-3.221 0-6.166 1.933-7.604 4.787l2.707 2.104c.687-2.069 2.616-3.608 4.8938-3.608Z" fill="#EA4335"/></svg>
           Continue with Google
        </button>
      </div>
    </div>
  )
}
