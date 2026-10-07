import { X, CheckCircle2, AlertCircle, FileCode2, ExternalLink } from 'lucide-react';

export default function EvidenceDetail({ data, onClose }) {
  if (!data) return null;

  const isVerified = data.status === 'Verified';

  return (
    <div className="fixed inset-0 bg-[#53041B]/20 backdrop-blur-sm z-50 flex justify-end">
      {/* Slide-over panel */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-[#770429]/20 bg-[#FDF0F4] flex justify-between items-start sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-[#53041B] mb-1">{data.skill}</h2>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-bold ${isVerified ? 'bg-[#F8D8E3] text-[#770429]' : 'bg-red-50 text-red-600'}`}>
              {isVerified ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {data.score}% Confidence
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-[#F8D8E3] text-[#770429] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 space-y-8">
          
          {/* Validation Steps */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#BB2649] uppercase tracking-wider flex items-center gap-2">
              <FileCode2 className="w-4 h-4" /> Evaluation Engine Steps
            </h3>
            
            <div className="flex gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <p className="text-sm">
                <span className="font-bold text-gray-900">Stored result:</span> <span className="font-semibold text-[#770429]">{data.skill}</span> — {data.status}.
              </p>
            </div>
            
            <div className={`flex gap-3 text-gray-700 p-3 rounded-lg border ${isVerified ? 'bg-[#FDF0F4] border-[#F8D8E3]' : 'bg-red-50 border-red-100'}`}>
              {isVerified ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              )}
              <p className="text-sm">
                <span className="font-bold text-gray-900">Sources:</span> {data.sources} supplied links or repository-name matches. This does not validate repository code or LinkedIn employment history.
              </p>
            </div>
          </div>

          {/* Extracted Sources */}
          {data.repos && data.repos.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-[#770429]/20">
              <h3 className="text-xs font-bold text-[#BB2649] uppercase tracking-wider">Verified Recent Sources</h3>
              <div className="space-y-2">
                {data.repos.map((repo, i) => (
                  <a 
                    key={i} 
                    href={repo.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg border border-[#F8D8E3] bg-[#FDF0F4] hover:bg-[#F8D8E3]/50 transition-colors group"
                  >
                    <span className="font-medium text-[#53041B] truncate pr-4">{repo.name}</span>
                    <ExternalLink className="w-4 h-4 text-[#BB2649] group-hover:text-[#53041B] shrink-0 transition-colors" />
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
