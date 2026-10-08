import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Sparkles, Loader2, ArrowRight } from 'lucide-react';

export default function Recruiter() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRecruiterGoogleLogin = () => {
    setLoading(true);
    // Simulate enterprise Google Workspace authentication
    setTimeout(() => {
      setLoading(false);
      navigate('/recruiter-dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-gray-900">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#C92D68]/30 shadow-xl space-y-8 text-center">
        
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#FDF0F4] text-[#53041B] flex items-center justify-center mx-auto border border-[#C92D68]/20">
            <Building2 className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#BB2649]">Hiring Team Portal</span>
          <h1 className="text-3xl font-black text-[#53041B]">Recruiter Sign In</h1>
          <p className="text-xs text-gray-600 leading-relaxed">
            Sign in with your enterprise Google Workspace account to evaluate candidates using semantic vector comparisons.
          </p>
        </div>

        <button
          onClick={handleRecruiterGoogleLogin}
          disabled={loading}
          className="w-full py-4 bg-[#53041B] hover:bg-[#770429] text-white font-extrabold rounded-2xl transition-all shadow-md flex items-center justify-center gap-3 text-sm cursor-pointer disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Verifying Enterprise Credentials...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.32 7.23 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.39-1.49-.39-2.24s.14-1.52.39-2.24V6.61H1.18C.43 8.12 0 9.81 0 12s.43 3.88 1.18 5.39l4.09-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.15 2.68 1.18 6.61l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              <span>Enterprise Google Login</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </>
          )}
        </button>

        <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400">
          Recruiter Workspace • Semantic Role Matching Engine
        </div>

      </div>
    </div>
  );
}