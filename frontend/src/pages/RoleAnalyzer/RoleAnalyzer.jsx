// import { useState, useEffect } from 'react';
// import { Target, CheckCircle2, XCircle, Briefcase, ThumbsUp, AlertTriangle, ArrowRight, Loader2, Layers, AlertCircle, Sparkles, FileText, Download, X } from 'lucide-react';

// export default function RoleAnalyzer() {
//   const [selectedRole, setSelectedRole] = useState('Data Scientist');
//   const [jobs, setJobs] = useState([]);
//   const [initialDataLoaded, setInitialDataLoaded] = useState(false);
//   const [roleData, setRoleData] = useState(null);
//   const [semanticData, setSemanticData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Resume preview modal state
//   const [showResumeModal, setShowResumeModal] = useState(false);
//   const [generatingResume, setGeneratingResume] = useState(false);
//   const [resumeData, setResumeData] = useState(null);
//   const [resumeWarning, setResumeWarning] = useState(null);

//   // Load job requirements and backend evidence before selecting the initial role.
//   useEffect(() => {
//     const controller = new AbortController();
//     const fetchData = async () => {
//       try {
//         const [jobsRes, roleRes] = await Promise.all([
//           fetch('http://localhost:5001/api/jobs', { signal: controller.signal }),
//           fetch('http://localhost:5001/api/role-analysis', { signal: controller.signal })
//         ]);
//         const jobsJson = await jobsRes.json();
//         if (!jobsRes.ok || jobsJson.success === false) throw new Error(jobsJson.error || jobsJson.message || 'Failed to load jobs');
//         if (!Array.isArray(jobsJson.jobs)) throw new Error('Jobs returned an unexpected response');
//         const roleJson = await roleRes.json();
//         if (!roleRes.ok || roleJson.success === false) throw new Error(roleJson.error || roleJson.message || 'Failed to compute role analysis');
//         if (!roleJson.roles || typeof roleJson.roles !== 'object' || Array.isArray(roleJson.roles)) throw new Error('Role analysis returned an unexpected response');
//         if (controller.signal.aborted) return;
//         setJobs(jobsJson.jobs);
//         setRoleData(roleJson.roles);
//         const firstJob = jobsJson.jobs.find(job => typeof job.title === 'string' && job.title.trim());
//         setSelectedRole(firstJob?.title || (roleJson.roles['Data Scientist'] ? 'Data Scientist' : Object.keys(roleJson.roles)[0] || 'Data Scientist'));
//         setInitialDataLoaded(true);
//       } catch (err) {
//         if (controller.signal.aborted) return;
//         console.error(err);
//         setError(err.message);
//         setLoading(false);
//       }
//     };
//     fetchData();
//     return () => controller.abort();
//   }, []);

//   // Ignore stale responses when the selected role changes or the page unmounts.
//   useEffect(() => {
//     if (!initialDataLoaded) return;
//     const controller = new AbortController();
//     const fetchComparison = async () => {
//       setLoading(true);
//       setError(null);
//       setSemanticData(null);
//       try {
//         const res = await fetch(`http://localhost:5001/api/semantic-compare?role=${encodeURIComponent(selectedRole)}`, { signal: controller.signal });
//         const data = await res.json();
//         if (!res.ok || data.error) throw new Error(data.error || data.message || 'Semantic comparison failed');
//         if (!Array.isArray(data.comparison_table)) throw new Error('Semantic comparison returned an unexpected response');
//         if (!controller.signal.aborted) setSemanticData(data);
//       } catch (err) {
//         if (controller.signal.aborted) return;
//         console.error(err);
//         setError(err.message);
//       } finally {
//         if (!controller.signal.aborted) setLoading(false);
//       }
//     };
//     fetchComparison();
//     return () => controller.abort();
//   }, [selectedRole, initialDataLoaded]);

//   const handleOpenResumeModal = async () => {
//     setShowResumeModal(true);
//     setGeneratingResume(true);
//     setResumeData(null);
//     setResumeWarning(null);
//     try {
//       const res = await fetch('http://localhost:5001/api/generate-resume', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ targetRole: selectedRole })
//       });
//       const data = await res.json();
//       if (!res.ok || !data.success) throw new Error(data.error || 'Resume generation failed');
//       setResumeWarning(data.warning || null);
//       if (data.success) {
//         setResumeData(data.resume);
//       }
//     } catch (err) {
//       console.error("Failed to generate resume preview", err);
//       setResumeWarning(err.message);
//     } finally {
//       setGeneratingResume(false);
//     }
//   };

//   const handlePrintPDF = () => {
//     window.print();
//   };

//   const availableJobTitles = [...new Set(jobs.filter(job => typeof job.title === 'string' && job.title.trim()).map(job => job.title))];
//   const selectedJob = jobs.find(job => job.title === selectedRole);
//   const analysisRole = roleData?.[selectedRole];
//   let requirementSkills = analysisRole?.skills || [];
//   let skillsError = null;
//   if (selectedJob) {
//     try {
//       const jobSkills = typeof selectedJob.skills === 'string' ? JSON.parse(selectedJob.skills) : selectedJob.skills;
//       if (!Array.isArray(jobSkills) || jobSkills.some(skill => typeof skill !== 'string' || !skill.trim())) {
//         throw new Error('Selected job requirements must be a list of skill names');
//       }
//       // Job titles may differ from the predefined analysis roles. Match names only;
//       // semantic overlap and backend default estimates do not verify a skill.
//       const analysisSkills = analysisRole?.skills || Object.values(roleData || {}).flatMap(role => role.skills || []);
//       requirementSkills = jobSkills.map(name => {
//         const matches = analysisSkills.filter(skill => skill.name.trim().toLowerCase() === name.trim().toLowerCase());
//         const matchingSkill = matches.find(skill => skill.status === 'Verified') || matches[0];
//         return { name, status: matchingSkill?.status || 'Missing Evidence' };
//       });
//     } catch (err) {
//       skillsError = err.message;
//     }
//   }
//   const verifiedCount = requirementSkills.filter(skill => skill.status === 'Verified').length;
//   const totalSkills = requirementSkills.length || 1;
//   const strictMatchScore = Math.max(15, Math.round(Math.pow(verifiedCount / totalSkills, 1.35) * 100));
//   const currentRole = {
//     skills: requirementSkills,
//     match: strictMatchScore,
//     verdict: strictMatchScore >= 90 ? 'Ready to Apply' : strictMatchScore >= 75 ? 'Moderate Match' : 'Skill Gap Detected',
//     verdictBg: strictMatchScore >= 90 ? 'bg-[var(--color-success-soft)]' : strictMatchScore >= 75 ? 'bg-[var(--color-warning-soft)]' : 'bg-[var(--color-error-soft)]',
//     verdictColor: strictMatchScore >= 90 ? 'text-[var(--color-success-ink)]' : strictMatchScore >= 75 ? 'text-[var(--color-warning-ink)]' : 'text-[var(--color-error-ink)]'
//   };

//   if (loading && !roleData) {
//     return (
//       <div className="rr-page rr-content flex flex-col items-center justify-center h-96 space-y-4">
//         <Loader2 className="w-10 h-10 text-[var(--color-blue)] animate-spin" />
//         <p className="text-[var(--color-text-secondary)] font-medium animate-pulse">Running AI Role Matching & Vector Similarity Engine...</p>
//       </div>
//     );
//   }

//   if (error || skillsError || !roleData) {
//     return (
//       <div className="rr-page rr-content bg-[var(--color-error-soft)] p-6 rounded-[var(--radius-panel)] border border-[var(--color-error)] text-center max-w-xl mx-auto mt-10">
//         <AlertTriangle className="w-8 h-8 text-[var(--color-error-ink)] mx-auto mb-2" />
//         <h3 className="text-[var(--color-error-ink)] font-bold">Analysis Error</h3>
//         <p className="text-[var(--color-error-ink)] text-sm mt-1">{error || skillsError || "Please run verification on the Evidence page first to populate candidate data."}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="rr-page rr-content space-y-10 max-w-5xl mx-auto pb-10">
      
//       {/* Header */}
//       <div>
//         <p className="rr-eyebrow">Evidence intelligence</p>
//         <h1 className="text-3xl font-bold text-[var(--color-navy)]">Role Analyzer</h1>
//         <p className="text-[var(--color-text-secondary)] mt-1">Weighted compatibility analysis and semantic proof matrices derived from your database.</p>
//       </div>

//       <p role="status" className="text-[var(--color-text-secondary)]">{loading ? 'Loading role comparison...' : 'Only skills reported as Verified by role analysis count toward this match score. Missing evidence and default estimates do not count.'}</p>
//       {/* Weighted Role Selector Card */}
//       <div className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] border border-[var(--color-border)]/40 shadow-sm p-6">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-8 border-b border-[var(--color-border)]">
//           <div className="flex items-center gap-3">
//             <div className="bg-[var(--color-workspace-secondary)]/40 p-2 rounded-lg">
//               <Target className="w-6 h-6 text-[var(--color-text-secondary)]" />
//             </div>
//             <h2 className="font-bold text-[var(--color-navy)] text-xl">"Can I Apply?" Check</h2>
//           </div>
          
//           <select 
//             value={selectedRole}
//             onChange={(e) => setSelectedRole(e.target.value)}
//             className="w-full sm:w-64 p-3 border-2 border-[var(--color-border)]/50 rounded-[var(--radius-panel)] bg-[var(--color-workspace)] text-[var(--color-navy)] font-semibold outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:border-[var(--color-focus)] transition-all cursor-pointer shadow-sm"
//           >
//             {(availableJobTitles.length ? availableJobTitles : Object.keys(roleData)).map(role => (
//               <option key={role} value={role}>{role}</option>
//             ))}
//           </select>
//         </div>

//         {!loading && currentRole && (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
//             <div className="bg-[var(--color-navy-secondary)] col-span-1 flex flex-col items-center justify-center p-6 rounded-[var(--radius-panel)] border border-[var(--color-border)]/30 text-center">
//               <h3 className="text-[var(--color-text-secondary)] font-bold tracking-wide text-sm mb-4">Weighted Match Score</h3>
              
//               <div className="relative w-32 h-32 flex items-center justify-center mb-6">
//                 <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
//                   <path className="text-[var(--color-text-muted)]" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
//                   <path 
//                     className="text-[var(--color-navy)] transition-all duration-1000 ease-out"
//                     strokeDasharray={`${currentRole.match}, 100`} 
//                     strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" 
//                     d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
//                   />
//                 </svg>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <span className="text-3xl font-semibold text-[var(--color-navy)]">{currentRole.match}%</span>
//                 </div>
//               </div>

//               <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${currentRole.verdictBg} ${currentRole.verdictColor}`}>
//                 {currentRole.match >= 90 ? <ThumbsUp className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
//                 {currentRole.verdict}
//               </div>
//             </div>

//             <div className="col-span-1 lg:col-span-2 flex flex-col">
//               <h3 className="text-[var(--color-text-secondary)] font-bold tracking-wide text-sm mb-4 flex items-center gap-2">
//                 <Briefcase className="w-4 h-4" /> Required Skills & Database Weights
//               </h3>
              
//               <div className="space-y-3 flex-1">
//                 {currentRole.skills.map((skill, index) => {
//                   const isVerified = skill.status === 'Verified';
//                   return (
//                     <div key={index} className="flex items-center justify-between p-3.5 rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-workspace-secondary)]/20 transition-colors">
//                       <span className="font-semibold text-[var(--color-text-primary)]">{skill.name}</span>
//                       <div className="flex items-center gap-2 text-sm font-medium">
//                         <span className={isVerified ? "text-[var(--color-success-ink)]" : "text-[var(--color-error-ink)]"}>{skill.status}</span>
//                         {isVerified ? <CheckCircle2 className="w-5 h-5 text-[var(--color-success-ink)]" /> : <XCircle className="w-5 h-5 text-[var(--color-error-ink)]" />}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               <div className="mt-6 p-4 bg-[var(--color-navy)] text-[var(--color-surface)] rounded-[var(--radius-panel)] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[var(--shadow-panel)]">
//                 <p className="text-sm font-medium leading-relaxed flex-1">
//                   Score calculated from the proportion of required skills with Verified evidence, with a minimum displayed score of 15%.
//                 </p>
//                 <button 
//                   onClick={handleOpenResumeModal}
//                   className="shrink-0 flex items-center gap-2 bg-[var(--color-workspace-secondary)] hover:bg-[var(--color-surface)] text-[var(--color-navy)] px-5 py-2.5 rounded-lg font-bold transition-colors shadow-sm cursor-pointer"
//                 >
//                   <Sparkles className="w-4 h-4 text-[var(--color-blue)]" /> Generate Tailored Resume <ArrowRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Semantic Comparison Table Section */}
//       {!loading && semanticData && (
//         <div className="space-y-6">
//           <div className="bg-[var(--color-navy-secondary)]  text-[var(--color-surface)] p-6 rounded-[var(--radius-panel)] shadow-[var(--shadow-panel)] flex flex-col sm:flex-row items-center justify-between gap-6">
//             <div className="space-y-1 text-center sm:text-left">
//               <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-workspace-secondary)] text-[var(--color-navy)]">
//                 <Sparkles className="w-3.5 h-3.5" /> Keyword Matching Engine ({selectedRole})
//               </div>
//               <h2 className="text-2xl font-bold">Weighted Keyword Fit Score</h2>
//               <p className="text-[var(--color-surface)] text-sm">Weighted keyword comparison against predefined role requirements.</p>
//             </div>
//             <div className="bg-[var(--color-surface)]/10 px-6 py-4 rounded-[var(--radius-panel)] border border-white/20 text-center shrink-0">
//               <span className="text-4xl font-semibold text-[var(--color-surface)]">{semanticData.overall_compatibility_score}%</span>
//               <p className="text-xs text-[var(--color-surface)] tracking-wide font-semibold mt-1">Weighted Keyword Fit</p>
//             </div>
//           </div>

//           <div className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] border border-[var(--color-border)]/40 shadow-sm overflow-hidden">
//             <div className="p-6 border-b border-[var(--color-border)] flex items-center gap-3">
//               <div className="bg-[var(--color-workspace-secondary)]/40 p-2 rounded-lg">
//                 <Layers className="w-6 h-6 text-[var(--color-text-secondary)]" />
//               </div>
//               <div>
//                 <h3 className="font-bold text-[var(--color-navy)] text-xl">Requirement vs. Resume Proof Matrix</h3>
//                 <p className="text-sm text-[var(--color-text-muted)]">Side-by-side evaluation of semantic text overlaps for {selectedRole}.</p>
//               </div>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="bg-[var(--color-workspace-secondary)]/50 border-b border-[var(--color-border)]/10 text-xs tracking-wide text-[var(--color-text-secondary)] font-bold">
//                     <th className="p-4 sm:p-5">Job Requirement</th>
//                     <th className="p-4 sm:p-5">Relevant Resume Evidence</th>
//                     <th className="p-4 sm:p-5 text-center">Match Score</th>
//                     <th className="p-4 sm:p-5 text-right">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100 text-sm">
//                   {semanticData.comparison_table.map((row, index) => {
//                     const isMatched = row.status === 'Matched';
//                     const isPartial = row.status === 'Partial';
//                     return (
//                       <tr key={index} className="hover:bg-[var(--color-workspace-secondary)]/20 transition-colors">
//                         <td className="p-4 sm:p-5 font-semibold text-[var(--color-text-primary)] max-w-xs leading-relaxed">
//                           {row.requirement}
//                         </td>
//                         <td className="p-4 sm:p-5 text-[var(--color-text-secondary)] max-w-xs leading-relaxed">
//                           {row.relevant_resume_skills}
//                         </td>
//                         <td className="p-4 sm:p-5 text-center font-bold text-[var(--color-navy)]">
//                           {row.score}%
//                         </td>
//                         <td className="p-4 sm:p-5 text-right">
//                           <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
//                             isMatched ? "bg-[var(--color-success-soft)] text-[var(--color-success-ink)]" : isPartial ? "bg-[var(--color-warning-soft)] text-[var(--color-warning-ink)]" : "bg-[var(--color-error-soft)] text-[var(--color-error-ink)]"
//                           }`}>
//                             {isMatched ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
//                             {row.status}
//                           </span>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* AI Resume Preview & PDF Export Modal */}
//       {showResumeModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto animate-in fade-in duration-200">
//           <div className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] max-w-3xl w-full p-6 sm:p-10 shadow-[var(--shadow-panel)] border border-[var(--color-border)]/30 space-y-6 relative my-8">
            
//             <button 
//               onClick={() => setShowResumeModal(false)}
//               className="absolute top-6 right-6 p-2 rounded-full bg-[var(--color-surface)] hover:bg-[var(--color-workspace-secondary)] text-[var(--color-text-secondary)] transition-colors"
//             >
//               <X className="w-5 h-5" />
//             </button>

//             <div className="flex items-center justify-between border-b pb-4">
//               <div className="flex items-center gap-3">
//                 <div className="bg-[var(--color-workspace-secondary)] p-2.5 rounded-[var(--radius-panel)]">
//                   <FileText className="w-6 h-6 text-[var(--color-navy)]" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold text-[var(--color-navy)]">AI Tailored Resume Preview</h3>
//                   <p className="text-xs text-[var(--color-text-muted)]">Optimized specifically for: <span className="font-semibold text-[var(--color-text-secondary)]">{selectedRole}</span></p>
//                 </div>
//               </div>

//               {resumeData && (
//                 <button 
//                   onClick={handlePrintPDF}
//                   className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-orange)] hover:bg-[var(--color-gold)] text-[var(--color-navy)] font-bold rounded-[var(--radius-control)] text-xs transition-colors shadow-[var(--shadow-panel)]"
//                 >
//                   <Download className="w-4 h-4 text-[var(--color-surface)]" /> Download PDF
//                 </button>
//               )}
//             </div>

//             {resumeWarning && <p role="alert" className="text-[var(--color-error-ink)]">{resumeWarning}</p>}
//             {generatingResume ? (
//               <div className="flex flex-col items-center justify-center h-64 space-y-3">
//                 <Loader2 className="w-8 h-8 text-[var(--color-blue)] animate-spin" />
//                 <p className="text-[var(--color-text-secondary)] font-medium text-sm">Gemini AI is parsing SQLite records & synthesizing resume...</p>
//               </div>
//             ) : resumeData ? (
//               <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-panel)] p-6 sm:p-8 space-y-6 text-left max-h-[60vh] overflow-y-auto shadow-inner">
                
//                 {/* Resume Sheet Header */}
//                 <div className="border-b border-[var(--color-border)] pb-4 space-y-1">
//                   <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">{resumeData.fullName}</h2>
//                   <p className="text-xs font-bold text-[var(--color-text-secondary)] tracking-wide">{resumeData.professionalTitle}</p>
//                   <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{resumeData.summary}</p>
//                 </div>

//                 {/* Skills */}
//                 <div className="space-y-2">
//                   <h4 className="text-[11px] font-bold tracking-wide text-[var(--color-text-muted)]">Targeted Competencies</h4>
//                   <div className="flex flex-wrap gap-1.5">
//                     {resumeData.selectedSkills?.map((skill, i) => (
//                       <span key={i} className="px-2.5 py-1 bg-[var(--color-surface)] text-[var(--color-text-primary)] text-xs font-semibold rounded-md border border-[var(--color-border)] shadow-sm">
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Projects */}
//                 <div className="space-y-3">
//                   <h4 className="text-[11px] font-bold tracking-wide text-[var(--color-text-muted)]">Relevant Verified Projects</h4>
//                   <div className="space-y-3">
//                     {resumeData.optimizedProjects?.map((proj, i) => (
//                       <div key={i} className="bg-[var(--color-surface)] p-3.5 rounded-[var(--radius-panel)] border border-[var(--color-border)] space-y-1 shadow-sm">
//                         <div className="flex justify-between items-center">
//                           <h5 className="font-bold text-[var(--color-text-primary)] text-xs">{proj.title}</h5>
//                           <span className="text-[11px] font-semibold text-[var(--color-blue)]">{proj.tech}</span>
//                         </div>
//                         <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{proj.description}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//               </div>
//             ) : (
//               <div className="p-8 text-center text-[var(--color-error-ink)] text-sm">Failed to generate preview. Please try again.</div>
//             )}

//           </div>
//         </div>
//       )}

//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { Target, CheckCircle2, XCircle, Briefcase, ThumbsUp, AlertTriangle, ArrowRight, Loader2, Layers, AlertCircle, Sparkles, FileText, Download, X } from 'lucide-react';

export default function RoleAnalyzer() {
  const [jobs, setJobs] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [roleData, setRoleData] = useState(null);
  const [semanticData, setSemanticData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Resume preview modal state
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [generatingResume, setGeneratingResume] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [resumeWarning, setResumeWarning] = useState(null);

  // Fetch jobs from backend on mount
  useEffect(() => {
    const fetchJobsAndAnalysis = async () => {
      setLoading(true);
      setError(null);
      try {
        const jobsRes = await fetch('http://localhost:5001/api/jobs');
        const jobsJson = await jobsRes.json();
        if (!jobsRes.ok || !jobsJson.success) throw new Error('Failed to fetch jobs from database');

        const fetchedJobs = jobsJson.jobs || [];
        setJobs(fetchedJobs);

        const activeRole = fetchedJobs.length > 0 ? fetchedJobs[0].title : 'Data Scientist';
        setSelectedRole(activeRole);

        const [roleRes, semanticRes] = await Promise.all([
          fetch('http://localhost:5001/api/role-analysis'),
          fetch(`http://localhost:5001/api/semantic-compare?role=${encodeURIComponent(activeRole)}`)
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

    fetchJobsAndAnalysis();
  }, []);

  // Fetch semantic compare data when selectedRole changes
  useEffect(() => {
    if (!selectedRole) return;
    const fetchRoleSpecificData = async () => {
      try {
        const semanticRes = await fetch(`http://localhost:5001/api/semantic-compare?role=${encodeURIComponent(selectedRole)}`);
        const semanticJson = await semanticRes.json();
        if (semanticRes.ok) {
          setSemanticData(semanticJson);
        }
      } catch (err) {
        console.error("Failed to fetch semantic data for role:", err);
      }
    };
    fetchRoleSpecificData();
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
      <div className="rr-page rr-content flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-10 h-10 text-[var(--color-blue)] animate-spin" />
        <p className="text-[var(--color-text-secondary)] font-medium animate-pulse">Running AI Role Matching & Vector Similarity Engine...</p>
      </div>
    );
  }

  if (error || !roleData) {
    return (
      <div className="rr-page rr-content bg-[var(--color-error-soft)] p-6 rounded-[var(--radius-panel)] border border-[var(--color-error)] text-center max-w-xl mx-auto mt-10">
        <AlertTriangle className="w-8 h-8 text-[var(--color-error-ink)] mx-auto mb-2" />
        <h3 className="text-[var(--color-error-ink)] font-bold">Analysis Error</h3>
        <p className="text-[var(--color-error-ink)] text-sm mt-1">{error || "Please post jobs or run verification on the backend first."}</p>
      </div>
    );
  }

  // Find matching job or fallback
  const currentJob = jobs.find(j => j.title === selectedRole) || jobs[0];
  const rawRoleInfo = roleData[selectedRole] || Object.values(roleData)[0] || {};

  // STAPLE STAGED WEIGHTING: Apply stricter penalties for unverified/missing skills
  const skillsList = currentJob?.skills 
    ? (typeof currentJob.skills === 'string' ? JSON.parse(currentJob.skills) : currentJob.skills).map(s => ({
        name: s,
        status: rawRoleInfo.skills?.find(rs => rs.name.toLowerCase() === s.toLowerCase())?.status || 'Missing'
      }))
    : (rawRoleInfo.skills || []);

  const verifiedCount = skillsList.filter(s => s.status === 'Verified').length;
  const totalSkills = skillsList.length || 1;
  // Stricter formula: Exponential penalty for unverified skills
  const strictMatchScore = Math.max(15, Math.round(Math.pow(verifiedCount / totalSkills, 1.35) * 100));

  const currentRole = {
    skills: skillsList,
    match: strictMatchScore,
    verdict: strictMatchScore >= 90 ? 'Ready to Apply' : strictMatchScore >= 75 ? 'Moderate Match' : 'Skill Gap Detected',
    verdictBg: strictMatchScore >= 90 ? 'bg-[var(--color-success-soft)]' : strictMatchScore >= 75 ? 'bg-[var(--color-warning-soft)]' : 'bg-[var(--color-error-soft)]',
    verdictColor: strictMatchScore >= 90 ? 'text-[var(--color-success-ink)]' : strictMatchScore >= 75 ? 'text-[var(--color-warning-ink)]' : 'text-[var(--color-error-ink)]'
  };

  return (
    <div className="rr-page rr-content space-y-10 max-w-5xl mx-auto pb-10">
      
      {/* Header */}
      <div>
        <p className="rr-eyebrow">Evidence intelligence</p>
        <h1 className="text-3xl font-bold text-[var(--color-navy)]">Role Analyzer</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Weighted compatibility analysis and semantic proof matrices derived from your database.</p>
      </div>

      <p role="status" className="text-[var(--color-text-secondary)]">{loading ? 'Loading role comparison...' : 'Only skills reported as Verified by role analysis count toward this match score. Missing evidence and default estimates do not count.'}</p>
      
      {/* Weighted Role Selector Card */}
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] border border-[var(--color-border)]/40 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-8 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="bg-[var(--color-workspace-secondary)]/40 p-2 rounded-lg">
              <Target className="w-6 h-6 text-[var(--color-text-secondary)]" />
            </div>
            <h2 className="font-bold text-[var(--color-navy)] text-xl">"Can I Apply?" Check</h2>
          </div>
          
          <select 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full sm:w-72 p-3 border-2 border-[var(--color-border)]/50 rounded-[var(--radius-panel)] bg-[var(--color-workspace)] text-[var(--color-navy)] font-semibold outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:border-[var(--color-focus)] transition-all cursor-pointer shadow-sm"
          >
            {jobs.map(job => (
              <option key={job.id || job.title} value={job.title}>{job.title} {job.company ? `(${job.company})` : ''}</option>
            ))}
          </select>
        </div>

        {!loading && currentRole && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            <div className="bg-[var(--color-navy-secondary)] col-span-1 flex flex-col items-center justify-center p-6 rounded-[var(--radius-panel)] border border-[var(--color-border)]/30 text-center">
              <h3 className="text-[var(--color-text-secondary)] font-bold tracking-wide text-sm mb-4">Weighted Match Score</h3>
              
              <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-[var(--color-text-muted)]" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path 
                    className="text-[var(--color-navy)] transition-all duration-1000 ease-out"
                    strokeDasharray={`${currentRole.match}, 100`} 
                    strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-semibold text-[var(--color-navy)]">{currentRole.match}%</span>
                </div>
              </div>

              <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${currentRole.verdictBg} ${currentRole.verdictColor}`}>
                {currentRole.match >= 90 ? <ThumbsUp className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {currentRole.verdict}
              </div>
            </div>

            <div className="col-span-1 lg:col-span-2 flex flex-col">
              <h3 className="text-[var(--color-text-secondary)] font-bold tracking-wide text-sm mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Required Skills & Database Weights
              </h3>
              
              <div className="space-y-3 flex-1">
                {currentRole.skills.map((skill, index) => {
                  const isVerified = skill.status === 'Verified';
                  return (
                    <div key={index} className="flex items-center justify-between p-3.5 rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-workspace-secondary)]/20 transition-colors">
                      <span className="font-semibold text-[var(--color-text-primary)]">{skill.name}</span>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <span className={isVerified ? "text-[var(--color-success-ink)]" : "text-[var(--color-error-ink)]"}>{skill.status}</span>
                        {isVerified ? <CheckCircle2 className="w-5 h-5 text-[var(--color-success-ink)]" /> : <XCircle className="w-5 h-5 text-[var(--color-error-ink)]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-[var(--color-navy)] text-[var(--color-surface)] rounded-[var(--radius-panel)] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[var(--shadow-panel)]">
                <p className="text-sm font-medium leading-relaxed flex-1">
                  Score calculated from the proportion of required skills with Verified evidence, with a minimum displayed score of 15%.
                </p>
                <button 
                  onClick={handleOpenResumeModal}
                  className="shrink-0 flex items-center gap-2 bg-[var(--color-workspace-secondary)] hover:bg-[var(--color-surface)] text-[var(--color-navy)] px-5 py-2.5 rounded-lg font-bold transition-colors shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[var(--color-blue)]" /> Generate Tailored Resume <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Semantic Comparison Table Section */}
      {!loading && semanticData && (
        <div className="space-y-6">
          <div className="bg-[var(--color-navy-secondary)] text-[var(--color-surface)] p-6 rounded-[var(--radius-panel)] shadow-[var(--shadow-panel)] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-workspace-secondary)] text-[var(--color-navy)]">
                <Sparkles className="w-3.5 h-3.5" /> Keyword Matching Engine ({selectedRole})
              </div>
              <h2 className="text-2xl font-bold">Weighted Keyword Fit Score</h2>
              <p className="text-[var(--color-surface)] text-sm">Weighted keyword comparison against predefined role requirements.</p>
            </div>
            <div className="bg-[var(--color-surface)]/10 px-6 py-4 rounded-[var(--radius-panel)] border border-white/20 text-center shrink-0">
              <span className="text-4xl font-semibold text-[var(--color-surface)]">{semanticData.overall_compatibility_score}%</span>
              <p className="text-xs text-[var(--color-surface)] tracking-wide font-semibold mt-1">Weighted Keyword Fit</p>
            </div>
          </div>

          <div className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] border border-[var(--color-border)]/40 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[var(--color-border)] flex items-center gap-3">
              <div className="bg-[var(--color-workspace-secondary)]/40 p-2 rounded-lg">
                <Layers className="w-6 h-6 text-[var(--color-text-secondary)]" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-navy)] text-xl">Requirement vs. Resume Proof Matrix</h3>
                <p className="text-sm text-[var(--color-text-muted)]">Side-by-side evaluation of semantic text overlaps for {selectedRole}.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--color-workspace-secondary)]/50 border-b border-[var(--color-border)]/10 text-xs tracking-wide text-[var(--color-text-secondary)] font-bold">
                    <th className="p-4 sm:p-5">Job Requirement</th>
                    <th className="p-4 sm:p-5">Relevant Resume Evidence</th>
                    <th className="p-4 sm:p-5 text-center">Match Score</th>
                    <th className="p-4 sm:p-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {semanticData.comparison_table?.map((row, index) => {
                    const isMatched = row.status === 'Matched';
                    const isPartial = row.status === 'Partial';
                    return (
                      <tr key={index} className="hover:bg-[var(--color-workspace-secondary)]/20 transition-colors">
                        <td className="p-4 sm:p-5 font-semibold text-[var(--color-text-primary)] max-w-xs leading-relaxed">
                          {row.requirement}
                        </td>
                        <td className="p-4 sm:p-5 text-[var(--color-text-secondary)] max-w-xs leading-relaxed">
                          {row.relevant_resume_skills}
                        </td>
                        <td className="p-4 sm:p-5 text-center font-bold text-[var(--color-navy)]">
                          {row.score}%
                        </td>
                        <td className="p-4 sm:p-5 text-right">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            isMatched ? "bg-[var(--color-success-soft)] text-[var(--color-success-ink)]" : isPartial ? "bg-[var(--color-warning-soft)] text-[var(--color-warning-ink)]" : "bg-[var(--color-error-soft)] text-[var(--color-error-ink)]"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] max-w-3xl w-full p-6 sm:p-10 shadow-[var(--shadow-panel)] border border-[var(--color-border)]/30 space-y-6 relative my-8">
            
            <button 
              onClick={() => setShowResumeModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[var(--color-surface)] hover:bg-[var(--color-workspace-secondary)] text-[var(--color-text-secondary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-[var(--color-workspace-secondary)] p-2.5 rounded-[var(--radius-panel)]">
                  <FileText className="w-6 h-6 text-[var(--color-navy)]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-navy)]">AI Tailored Resume Preview</h3>
                  <p className="text-xs text-[var(--color-text-muted)]">Optimized specifically for: <span className="font-semibold text-[var(--color-text-secondary)]">{selectedRole}</span></p>
                </div>
              </div>

              {resumeData && (
                <button 
                  onClick={handlePrintPDF}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-orange)] hover:bg-[var(--color-gold)] text-[var(--color-navy)] font-bold rounded-[var(--radius-control)] text-xs transition-colors shadow-[var(--shadow-panel)]"
                >
                  <Download className="w-4 h-4 text-[var(--color-surface)]" /> Download PDF
                </button>
              )}
            </div>

            {resumeWarning && <p role="alert" className="text-[var(--color-error-ink)]">{resumeWarning}</p>}
            {generatingResume ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-3">
                <Loader2 className="w-8 h-8 text-[var(--color-blue)] animate-spin" />
                <p className="text-[var(--color-text-secondary)] font-medium text-sm">Gemini AI is parsing SQLite records & synthesizing resume...</p>
              </div>
            ) : resumeData ? (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-panel)] p-6 sm:p-8 space-y-6 text-left max-h-[60vh] overflow-y-auto shadow-inner">
                
                {/* Resume Sheet Header */}
                <div className="border-b border-[var(--color-border)] pb-4 space-y-1">
                  <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">{resumeData.fullName}</h2>
                  <p className="text-xs font-bold text-[var(--color-text-secondary)] tracking-wide">{resumeData.professionalTitle}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{resumeData.summary}</p>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold tracking-wide text-[var(--color-text-muted)]">Targeted Competencies</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.selectedSkills?.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-[var(--color-surface)] text-[var(--color-text-primary)] text-xs font-semibold rounded-md border border-[var(--color-border)] shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold tracking-wide text-[var(--color-text-muted)]">Relevant Verified Projects</h4>
                  <div className="space-y-3">
                    {resumeData.optimizedProjects?.map((proj, i) => (
                      <div key={i} className="bg-[var(--color-surface)] p-3.5 rounded-[var(--radius-panel)] border border-[var(--color-border)] space-y-1 shadow-sm">
                        <div className="flex justify-between items-center">
                          <h5 className="font-bold text-[var(--color-text-primary)] text-xs">{proj.title}</h5>
                          <span className="text-[11px] font-semibold text-[var(--color-blue)]">{proj.tech}</span>
                        </div>
                        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-8 text-center text-[var(--color-error-ink)] text-sm">Failed to generate preview. Please try again.</div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}