import { useNavigate } from 'react-router-dom';
import { UserCheck, Building2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="rr-page rr-portal min-h-screen bg-[var(--color-workspace)] flex flex-col items-center justify-center p-6 text-[var(--color-text-primary)]">
      <div className="max-w-4xl w-full space-y-12 text-center">
        
        {/* Header Statement */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[var(--color-workspace-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]/20">
            <Sparkles className="w-4 h-4 text-[var(--color-blue)]" /> ResumeRadar Intelligence Platform
          </div>
          <p className="rr-eyebrow">Evidence intelligence</p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-[var(--color-navy)] tracking-tight">
            Turn resume claims into career intelligence
          </h1>
          <p className="text-base text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed font-medium">
            Select your portal to authenticate securely via Google OAuth and access verified telemetry.
          </p>
        </div>

        <ol className="rr-pipeline rr-welcome-pipeline" aria-label="ResumeRadar evidence journey">
          <li><span className="rr-pipeline-marker">01</span><strong>Resume</strong><span>Your starting point</span></li>
          <li><span className="rr-pipeline-marker">02</span><strong>Claims</strong><span>Skills and experience</span></li>
          <li><span className="rr-pipeline-marker">03</span><strong>Evidence</strong><span>Supporting sources</span></li>
          <li><span className="rr-pipeline-marker">04</span><strong>Career intelligence</strong><span>Strengths and next steps</span></li>
        </ol>

        {/* Two Role Selection Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          
          {/* Applicant Box */}
          <div 
            onClick={() => navigate('/applicant/login')}
            className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] p-8 border-2 border-[var(--color-border)]/30 hover:border-[var(--color-border)] shadow-sm hover:shadow-[var(--shadow-panel)] transition-all cursor-pointer flex flex-col justify-between space-y-6 group text-left"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-[var(--radius-panel)] bg-[var(--color-workspace-secondary)] flex items-center justify-center text-[var(--color-navy)] group-hover:bg-[var(--color-navy)] group-hover:text-[var(--color-surface)] transition-all">
                <UserCheck className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold tracking-wide text-[var(--color-blue)]">Candidate Portal</span>
                <h2 className="text-2xl font-bold text-[var(--color-navy)]">I'm an Applicant</h2>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Upload resumes, audit your digital footprint across GitHub and portfolios, and resolve career gaps.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-[var(--color-navy)] pt-4 border-t border-[var(--color-border)]">
              <span>Sign in with Google</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Recruiter Box */}
          <div 
            onClick={() => navigate('/recruiter/login')}
            className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] p-8 border-2 border-[var(--color-border)]/30 hover:border-[var(--color-border)] shadow-sm hover:shadow-[var(--shadow-panel)] transition-all cursor-pointer flex flex-col justify-between space-y-6 group text-left"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-[var(--radius-panel)] bg-[var(--color-workspace-secondary)] flex items-center justify-center text-[var(--color-navy)] group-hover:bg-[var(--color-navy)] group-hover:text-[var(--color-surface)] transition-all">
                <Building2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold tracking-wide text-[var(--color-blue)]">Hiring Team Portal</span>
                <h2 className="text-2xl font-bold text-[var(--color-navy)]">I'm a Recruiter</h2>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Evaluate candidates against role requirements using semantic vector comparison and database telemetry.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-[var(--color-navy)] pt-4 border-t border-[var(--color-border)]">
              <span>Enterprise Google Login</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        {/* Footer Note */}
        <p className="text-xs text-[var(--color-text-muted)] font-medium">
          Protected by SQLite backend telemetry on port 5001 • Secure OAuth 2.0 Integration
        </p>

      </div>
    </div>
  );
}