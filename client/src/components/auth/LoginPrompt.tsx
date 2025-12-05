import { Link } from '@tanstack/react-router';

interface LoginPromptProps {
  title?: string;
  message?: string;
}

export const LoginPrompt: React.FC<LoginPromptProps> = ({ 
  title = "Login Required",
  message = "You need to be logged in to access this feature."
}) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-900/50 rounded-lg border border-slate-800 p-8 text-center">
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-slate-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>
        
        {/* Message */}
        <p className="text-slate-400 mb-8">{message}</p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            to="/login"
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-medium py-3 px-4 rounded-lg transition-colors block"
          >
            Sign In
          </Link>
          
          <Link 
            to="/signup"
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-colors block"
          >
            Create Account
          </Link>
          
          <Link 
            to="/"
            className="text-slate-400 hover:text-white transition-colors text-sm block mt-4"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
