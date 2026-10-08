import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Sparkles, Loader2, ArrowRight } from 'lucide-react';

export default function Applicant() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    setLoading(true);
    // Simulate secure Google OAuth handshake and database session sync on port 5001
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="rr-page rr-portal min-h-screen bg-[var(--color-workspace)] flex flex-col items-center justify-center p-6 text-[var(--color-text-primary)]">
      <div className="max-w-md w-full bg-[var(--color-surface)] rounded-[var(--radius-panel)] p-8 sm:p-10 border-2 border-[var(--color-border)]/30 shadow-[var(--shadow-panel)] space-y-8 text-center">
        
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-[var(--radius-panel)] bg-[var(--color-workspace-secondary)] text-[var(--color-navy)] flex items-center justify-center mx-auto border border-[var(--color-border)]/20">
            <UserCheck className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold tracking-wide text-[var(--color-blue)]">Candidate Portal</span>
          <p className="rr-eyebrow">ResumeRadar</p>
          <h1 className="text-3xl font-semibold text-[var(--color-navy)]">Applicant Sign In</h1>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            Connect your Google account to access your digital footprint, audit career gaps, and manage your SQLite telemetry profile.
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-4 bg-[var(--color-orange)] hover:bg-[var(--color-gold)] text-[var(--color-navy)] font-semibold rounded-[var(--radius-panel)] transition-all shadow-[var(--shadow-panel)] flex items-center justify-center gap-3 text-sm cursor-pointer disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Authenticating via Google...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 bg-[var(--color-surface)] rounded-full p-0.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.32 7.23 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.39-1.49-.39-2.24s.14-1.52.39-2.24V6.61H1.18C.43 8.12 0 9.81 0 12s.43 3.88 1.18 5.39l4.09-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.15 2.68 1.18 6.61l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              <span>Sign in with Google</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </>
          )}
        </button>

        <div className="pt-4 border-t border-[var(--color-border)] text-[11px] text-[var(--color-text-muted)]">
          Secure OAuth 2.0 • SQLite Port 5001 Sync
        </div>

      </div>
    </div>
  );
}