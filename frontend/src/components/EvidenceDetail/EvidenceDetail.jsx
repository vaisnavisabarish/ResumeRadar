import { X, CheckCircle2, AlertCircle, FileCode2, ExternalLink } from 'lucide-react';

export default function EvidenceDetail({ data, onClose }) {
  if (!data) return null;

  const isVerified = data.status === 'Verified';

  return (
    <div className="rr-page rr-content rr-evidence-detail fixed inset-0 bg-[var(--color-navy)]/20 z-50 flex justify-end">
      {/* Slide-over panel */}
      <div className="w-full max-w-md bg-[var(--color-surface)] h-full shadow-[var(--shadow-panel)] overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-border)]/20 bg-[var(--color-workspace-secondary)] flex justify-between items-start sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-navy)] mb-1">{data.skill}</h2>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-bold ${isVerified ? "bg-[var(--color-workspace-secondary)] text-[var(--color-text-secondary)]" : "bg-[var(--color-error-soft)] text-[var(--color-error-ink)]"}`}>
              {isVerified ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {data.score}% Confidence
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-[var(--color-workspace-secondary)] text-[var(--color-text-secondary)] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 space-y-8">
          
          {/* Validation Steps */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[var(--color-blue)] tracking-wide flex items-center gap-2">
              <FileCode2 className="w-4 h-4" /> Evaluation Engine Steps
            </h3>
            
            <div className="flex gap-3 text-[var(--color-text-secondary)] bg-[var(--color-surface)] p-3 rounded-lg border border-[var(--color-border)]">
              <CheckCircle2 className="w-5 h-5 text-[var(--color-blue)] shrink-0 mt-0.5" />
              <p className="text-sm">
                <span className="font-bold text-[var(--color-text-primary)]">Stored result:</span> <span className="font-semibold text-[var(--color-text-secondary)]">{data.skill}</span> — {data.status}.
              </p>
            </div>
            
            <div className={`flex gap-3 text-[var(--color-text-secondary)] p-3 rounded-lg border ${isVerified ? "bg-[var(--color-workspace-secondary)] border-[var(--color-border)]" : "bg-[var(--color-error-soft)] border-[var(--color-error)]"}`}>
              {isVerified ? (
                <CheckCircle2 className="w-5 h-5 text-[var(--color-success-ink)] shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-[var(--color-error-ink)] shrink-0 mt-0.5" />
              )}
              <p className="text-sm">
                <span className="font-bold text-[var(--color-text-primary)]">Sources:</span> {data.sources} supplied links or repository-name matches. This does not validate repository code or LinkedIn employment history.
              </p>
            </div>
          </div>

          {/* Extracted Sources */}
          {data.repos && data.repos.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-[var(--color-border)]/20">
              <h3 className="text-xs font-bold text-[var(--color-blue)] tracking-wide">Verified Recent Sources</h3>
              <div className="space-y-2">
                {data.repos.map((repo, i) => (
                  <a 
                    key={i} 
                    href={repo.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-workspace-secondary)] hover:bg-[var(--color-workspace-secondary)]/50 transition-colors group"
                  >
                    <span className="font-medium text-[var(--color-navy)] truncate pr-4">{repo.name}</span>
                    <ExternalLink className="w-4 h-4 text-[var(--color-blue)] group-hover:text-[var(--color-navy)] shrink-0 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
