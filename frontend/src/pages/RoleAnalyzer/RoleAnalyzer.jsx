import { useState, useEffect } from 'react';
import { Target, CheckCircle2, XCircle, Briefcase, ThumbsUp, AlertTriangle, ArrowRight, Loader2, Layers, AlertCircle, Sparkles, FileText, Download, X } from 'lucide-react';

export default function RoleAnalyzer() {
  const [selectedRole, setSelectedRole] = useState('Data Scientist');
  const [roleData, setRoleData] = useState(null);
  const [semanticData, setSemanticData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Resume preview modal state
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [generatingResume, setGeneratingResume] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [resumeWarning, setResumeWarning] = useState(null);

  // Fetch role-specific analyses and semantic tables whenever selectedRole changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [roleRes, semanticRes] = await Promise.all([
          fetch('http://localhost:5001/api/role-analysis'),
          fetch(`http://localhost:5001/api/semantic-compare?role=${encodeURIComponent(selectedRole)}`)
        ]);

        const roleJson = await roleRes.json();
        if (!roleRes.ok) throw new Error(roleJson.error || 'Failed to compute role analysis');
        setRoleData(roleJson.roles);

        const semanticJson = await semanticRes.json();
        if (!semanticRes.ok) throw new Error(semanticJson.error || 'Semantic comparison failed');
        setSemanticData(semanticJson);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedRole]);

  const handleOpenResumeModal = async () => {
    setShowResumeModal(true);
    setGeneratingResume(true);
    setResumeData(null);
    setResumeWarning(null);
    try {
      const res = await fetch('http://localhost:5001/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole: selectedRole })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Resume generation failed');
      setResumeWarning(data.warning || null);
      if (data.success) {
        setResumeData(data.resume);
      }
    } catch (err) {
      console.error("Failed to generate resume preview", err);
      setResumeWarning(err.message);
    } finally {
      setGeneratingResume(false);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  if (loading && !roleData) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-10 h-10 text-[#BB2649] animate-spin" />
        <p className="text-[#770429] font-medium animate-pulse">Running AI Role Matching & Vector Similarity Engine...</p>
      </div>
    );
  }

  if (error || !roleData) {
    return (
      <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-center max-w-xl mx-auto mt-10">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <h3 className="text-red-700 font-bold">Analysis Error</h3>
        <p className="text-red-600 text-sm mt-1">{error || "Please run verification on the Evidence page first to populate candidate data."}</p>
      </div>
    );
  }

  const currentRole = roleData[selectedRole];

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#53041B]">Role Analyzer</h1>
        <p className="text-[#770429] mt-1">Weighted compatibility analysis and semantic proof matrices derived from your database.</p>
      </div>

      <p role="status" className="text-[#770429]">Role estimates use repository-name matches and default scores for unmatched skills.</p>
      {/* Weighted Role Selector Card */}
      <div className="bg-white rounded-2xl border border-[#C92D68]/40 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-[#F8D8E3]/40 p-2 rounded-lg">
              <Target className="w-6 h-6 text-[#770429]" />
            </div>
            <h2 className="font-bold text-[#53041B] text-xl">"Can I Apply?" Check</h2>
          </div>
          
          <select 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full sm:w-64 p-3 border-2 border-[#C92D68]/50 rounded-xl bg-[#FDFBF7] text-[#53041B] font-semibold outline-none focus:ring-2 focus:ring-[#BB2649] focus:border-[#BB2649] transition-all cursor-pointer shadow-sm"
          >
            {Object.keys(roleData).map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {currentRole && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            <div className="col-span-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#FDFBF7] to-[#FDF0F4]/30 rounded-2xl border border-[#C92D68]/30 text-center">
              <h3 className="text-[#770429] font-bold uppercase tracking-wider text-sm mb-4">Weighted Match Score</h3>
              
              <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-gray-200" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path 
                    className="text-[#53041B] transition-all duration-1000 ease-out" 
                    strokeDasharray={`${currentRole.match}, 100`} 
                    strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-black text-[#53041B]">{currentRole.match}%</span>
                </div>
              </div>

              <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${currentRole.verdictBg} ${currentRole.verdictColor}`}>
                {currentRole.match >= 85 ? <ThumbsUp className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {currentRole.verdict}
              </div>
            </div>

            <div className="col-span-1 lg:col-span-2 flex flex-col">
              <h3 className="text-[#770429] font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Required Skills & Database Weights
              </h3>
              
              <div className="space-y-3 flex-1">
                {currentRole.skills.map((skill, index) => {
                  const isVerified = skill.status === 'Verified';
                  return (
                    <div key={index} className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-[#FDF0F4]/20 transition-colors">
                      <span className="font-semibold text-gray-800">{skill.name}</span>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <span className={isVerified ? 'text-green-600' : 'text-red-500'}>{skill.status}</span>
                        {isVerified ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-500" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-[#53041B] text-[#FDF0F4] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <p className="text-sm font-medium leading-relaxed flex-1">
                  Score calculated by weighting database verification confidence across core role competencies.
                </p>
                <button 
                  onClick={handleOpenResumeModal}
                  className="shrink-0 flex items-center gap-2 bg-[#F8D8E3] hover:bg-white text-[#53041B] px-5 py-2.5 rounded-lg font-bold transition-colors shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#BB2649]" /> Generate Tailored Resume <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Semantic Comparison Table Section */}
      {semanticData && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#53041B] to-[#770429] text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F8D8E3] text-[#53041B]">
                <Sparkles className="w-3.5 h-3.5" /> Keyword Matching Engine ({selectedRole})
              </div>
              <h2 className="text-2xl font-bold">Weighted Keyword Fit Score</h2>
              <p className="text-[#F8D8E3] text-sm">Weighted keyword comparison against predefined role requirements.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 text-center shrink-0">
              <span className="text-4xl font-black text-white">{semanticData.overall_compatibility_score}%</span>
              <p className="text-xs text-[#F8D8E3] uppercase tracking-wider font-semibold mt-1">Weighted Keyword Fit</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#C92D68]/40 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <div className="bg-[#F8D8E3]/40 p-2 rounded-lg">
                <Layers className="w-6 h-6 text-[#770429]" />
              </div>
              <div>
                <h3 className="font-bold text-[#53041B] text-xl">Requirement vs. Resume Proof Matrix</h3>
                <p className="text-sm text-gray-500">Side-by-side evaluation of semantic text overlaps for {selectedRole}.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FDF0F4]/50 border-b border-[#770429]/10 text-xs uppercase tracking-wider text-[#770429] font-bold">
                    <th className="p-4 sm:p-5">Job Requirement</th>
                    <th className="p-4 sm:p-5">Relevant Resume Evidence</th>
                    <th className="p-4 sm:p-5 text-center">Match Score</th>
                    <th className="p-4 sm:p-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {semanticData.comparison_table.map((row, index) => {
                    const isMatched = row.status === 'Matched';
                    const isPartial = row.status === 'Partial';
                    return (
                      <tr key={index} className="hover:bg-[#FDF0F4]/20 transition-colors">
                        <td className="p-4 sm:p-5 font-semibold text-gray-900 max-w-xs leading-relaxed">
                          {row.requirement}
                        </td>
                        <td className="p-4 sm:p-5 text-gray-600 max-w-xs leading-relaxed">
                          {row.relevant_resume_skills}
                        </td>
                        <td className="p-4 sm:p-5 text-center font-bold text-[#53041B]">
                          {row.score}%
                        </td>
                        <td className="p-4 sm:p-5 text-right">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            isMatched ? 'bg-green-50 text-green-700' : isPartial ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-600'
                          }`}>
                            {isMatched ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* AI Resume Preview & PDF Export Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-[#C92D68]/30 space-y-6 relative my-8">
            
            <button 
              onClick={() => setShowResumeModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#F8D8E3] p-2.5 rounded-xl">
                  <FileText className="w-6 h-6 text-[#53041B]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#53041B]">AI Tailored Resume Preview</h3>
                  <p className="text-xs text-gray-500">Optimized specifically for: <span className="font-semibold text-[#770429]">{selectedRole}</span></p>
                </div>
              </div>

              {resumeData && (
                <button 
                  onClick={handlePrintPDF}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#53041B] hover:bg-[#770429] text-white font-bold rounded-xl text-xs transition-colors shadow-md"
                >
                  <Download className="w-4 h-4 text-[#F8D8E3]" /> Download PDF
                </button>
              )}
            </div>

            {resumeWarning && <p role="alert" className="text-red-600">{resumeWarning}</p>}
            {generatingResume ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-3">
                <Loader2 className="w-8 h-8 text-[#BB2649] animate-spin" />
                <p className="text-[#770429] font-medium text-sm">Gemini AI is parsing SQLite records & synthesizing resume...</p>
              </div>
            ) : resumeData ? (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 text-left max-h-[60vh] overflow-y-auto shadow-inner">
                
                {/* Resume Sheet Header */}
                <div className="border-b border-gray-200 pb-4 space-y-1">
                  <h2 className="text-2xl font-black text-gray-900">{resumeData.fullName}</h2>
                  <p className="text-xs font-bold text-[#770429] uppercase tracking-wider">{resumeData.professionalTitle}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{resumeData.summary}</p>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Targeted Competencies</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.selectedSkills?.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-white text-gray-800 text-xs font-semibold rounded-md border border-gray-200 shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Relevant Verified Projects</h4>
                  <div className="space-y-3">
                    {resumeData.optimizedProjects?.map((proj, i) => (
                      <div key={i} className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-1 shadow-sm">
                        <div className="flex justify-between items-center">
                          <h5 className="font-bold text-gray-900 text-xs">{proj.title}</h5>
                          <span className="text-[11px] font-semibold text-[#BB2649]">{proj.tech}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-8 text-center text-red-500 text-sm">Failed to generate preview. Please try again.</div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
