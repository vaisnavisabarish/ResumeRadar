import { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Target,
  FileText,
  Search,
  Lightbulb,
  ChevronDown,
  Lock,
  TrendingUp,
  Zap,
  Eye,
  Download,
  RefreshCw,
  Check,
  X,
  Database,
  Code2,
  BookOpen,
  Plus,
  Code,
  Trophy,
  Flame,
  Terminal,
  ExternalLink
} from 'lucide-react';

export default function ResumeImprover() {
  const [activeTab, setActiveTab] = useState('feedback');
  const [selectedRole, setSelectedRole] = useState('Data Scientist');
  const [analyzing, setAnalyzing] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [claimHandled, setClaimHandled] = useState(false);

  // Dynamic scores state
  const [healthScore, setHealthScore] = useState(78);
  const [atsScore, setAtsScore] = useState(74);

  const [selectedChanges, setSelectedChanges] = useState({
    descriptions: true,
    postgres: true,
    research: false,
    summary: true,
    coursework: false,
    dsa: true,
  });

  const healthMetrics = [
    { label: 'CONTENT', score: 86, status: 'Strong', icon: FileText, color: 'text-[#53041B]', bg: 'bg-[#F8D8E3]/50' },
    { label: 'ATS', score: atsScore, status: atsScore > 80 ? 'Optimized' : 'Improve', icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'EVIDENCE', score: 91, status: 'Strong', icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'READABILITY', score: 82, status: 'Good', icon: Eye, color: 'text-[#770429]', bg: 'bg-[#FDF0F4]' },
  ];

  const issues = [
    {
      priority: 'HIGH PRIORITY',
      priorityColor: 'text-red-600',
      priorityBg: 'bg-red-50',
      border: 'border-red-200',
      icon: AlertTriangle,
      title: 'Weak project impact statements',
      quote: '"Developed a machine learning model using Python and PyTorch."',
      why: "The project doesn't communicate the result, measurable outcome, or scale of the work.",
      suggestion: 'Add model performance, dataset size, evaluation metrics, or measurable outcome.',
      button: 'Improve This',
    },
    {
      priority: 'MEDIUM PRIORITY',
      priorityColor: 'text-amber-700',
      priorityBg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: Search,
      title: 'Missing role-specific keywords',
      quote: `Target role: ${selectedRole}`,
      why: 'Your current resume does not clearly surface several skills expected for this role.',
      suggestion: 'Predictive modeling · Statistical analysis · Model evaluation',
      button: 'Add Keywords',
    },
    {
      priority: 'MEDIUM PRIORITY',
      priorityColor: 'text-amber-700',
      priorityBg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: Database,
      title: 'Project section is underrepresented',
      quote: 'Resume contains 3 projects.',
      why: 'ResumeRadar found 8 projects across your verified career sources.',
      suggestion: 'Consider adding relevant verified projects that strengthen the target role.',
      button: 'View Missing Projects',
    },
  ];

  const opportunities = [
    { icon: BookOpen, title: 'Research publication', subtitle: 'Hydrology Research', type: 'Verified research' },
    { icon: Code2, title: 'Computer Vision project', subtitle: 'YOLOv8 / Eye Tracking', type: 'Verified project' },
    { icon: Database, title: 'PostgreSQL experience', subtitle: 'ResearchPilot', type: 'Verified technology' },
  ];

  const toggleChange = (key) => {
    setSelectedChanges((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setApplied(false);
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setHealthScore(87);
      setAtsScore(89);
    }, 1200);
  };

  const handleApply = () => {
    setApplied(true);
    setHealthScore(89);
    setAtsScore(92);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-full bg-[#FDFBF7] pb-16">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* =====================================================
            HEADER SECTION
        ====================================================== */}
        <section className="relative overflow-hidden rounded-3xl border border-[#C92D68]/30 bg-white shadow-sm">
          <div className="absolute -right-20 -top-24 w-80 h-80 rounded-full bg-[#F8D8E3]/50 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 bottom-0 w-64 h-64 rounded-full bg-[#FDF0F4] blur-3xl pointer-events-none" />

          <div className="relative z-10 p-7 sm:p-9">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F8D8E3] text-[#53041B] text-xs font-bold mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI + VERIFIED EVIDENCE
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-[#53041B] tracking-tight">
                  Resume Improver
                </h1>

                <p className="mt-3 text-[#770429] text-sm sm:text-base leading-relaxed">
                  Your resume should represent what you've actually done.
                  ResumeRadar uses your verified career evidence to improve
                  your resume without inventing experience.
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-5 text-xs font-semibold text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    Evidence-backed
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-[#BB2649]" />
                    Role-aware
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-[#770429]" />
                    No fabricated claims
                  </span>
                </div>
              </div>

              {/* Resume Health Ring */}
              <div className="shrink-0 lg:w-60">
                <div className="rounded-2xl border border-[#C92D68]/30 bg-[#FDFBF7] p-5 text-center shadow-sm">
                  <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-[#770429]">
                    Resume Health
                  </p>

                  <div className="relative w-28 h-28 mx-auto my-3 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#53041B] transition-all duration-500"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                        strokeDasharray={`${healthScore}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-black text-[#53041B]">
                        {healthScore}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-gray-500">
                    <span>Role: {selectedRole}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =====================================================
            TAB NAVIGATION
        ====================================================== */}
        <div className="bg-white rounded-2xl border border-[#C92D68]/30 p-1.5 shadow-sm flex max-w-xl">
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'feedback'
                ? 'bg-[#53041B] text-white shadow-md'
                : 'text-[#770429] hover:bg-[#FDF0F4]'
            }`}
          >
            <Search className="w-4 h-4" />
            Feedback & Issues
          </button>

          <button
            onClick={() => setActiveTab('improve')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'improve'
                ? 'bg-[#53041B] text-white shadow-md'
                : 'text-[#770429] hover:bg-[#FDF0F4]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Improve Resume
          </button>
        </div>

        {/* =====================================================
            FEEDBACK TAB
        ====================================================== */}
        {activeTab === 'feedback' && (
          <div className="space-y-8">

            {/* Health Overview */}
            <section>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-[#53041B]">
                  Resume Health Overview
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  A quick diagnosis of how your resume performs across key areas.
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {healthMetrics.map((metric) => {
                  const Icon = metric.icon;

                  return (
                    <div
                      key={metric.label}
                      className="bg-white rounded-2xl border border-[#C92D68]/30 p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2.5 rounded-xl ${metric.bg}`}>
                          <Icon className={`w-5 h-5 ${metric.color}`} />
                        </div>

                        <span className={`text-2xl font-black ${metric.color}`}>
                          {metric.score}%
                        </span>
                      </div>

                      <p className="text-xs font-bold tracking-wider text-gray-500">
                        {metric.label}
                      </p>

                      <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#53041B]"
                          style={{ width: `${metric.score}%` }}
                        />
                      </div>

                      <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        <span>{metric.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* =====================================================
                LEETCODE & STUDY PLAN SECTION
            ====================================================== */}
            <section className="relative overflow-hidden rounded-3xl border border-[#C92D68]/30 bg-gradient-to-br from-[#53041B] via-[#770429] to-[#BB2649] p-7 sm:p-9 text-white shadow-xl">
              <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-[#F8D8E3]">
                      <Terminal className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8D8E3]/20 text-[#F8D8E3] text-[10px] font-black tracking-widest uppercase mb-1">
                        <Flame className="w-3 h-3 text-amber-300 animate-pulse" /> LeetCode Study Plan Integration
                      </div>
                      <h2 className="text-2xl font-black tracking-tight text-white">
                        Competitive Programming & DSA Tracker
                      </h2>
                    </div>
                  </div>

                  <a
                    href="https://leetcode.com/studyplan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all cursor-pointer shrink-0"
                  >
                    <span>View LeetCode Study Plans</span>
                    <ExternalLink className="w-4 h-4 text-[#F8D8E3]" />
                  </a>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                  <div className="rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" /> Easy Tier
                      </span>
                      <span className="text-sm font-black text-white">120 / 125</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full w-[96%]" />
                    </div>
                    <p className="text-xs text-gray-300">Array, Strings, Hashing, Two Pointers</p>
                  </div>

                  <div className="rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" /> Medium Tier
                      </span>
                      <span className="text-sm font-black text-white">225 / 240</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full w-[93%]" />
                    </div>
                    <p className="text-xs text-gray-300">DP, Graphs, Trees, Backtracking, Sliding Window</p>
                  </div>

                  <div className="rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-400" /> Hard Tier
                      </span>
                      <span className="text-sm font-black text-white">40 / 55</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-red-400 rounded-full w-[72%]" />
                    </div>
                    <p className="text-xs text-gray-300">Segment Trees, Trie, Advanced Bit Manipulation</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-[#F8D8E3]">
                    <Trophy className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>LeetCode Contests: 1840 Rating (Top 6%) · 385+ Total Problems Solved.</span>
                  </div>

                  <button
                    onClick={() => setActiveTab('improve')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-[#53041B] hover:bg-[#F8D8E3] text-xs font-black shadow-lg transition-all cursor-pointer"
                  >
                    <Code className="w-4 h-4" />
                    Sync LeetCode Stats to Resume
                  </button>
                </div>
              </div>
            </section>

            {/* Issues Found */}
            <section className="bg-white rounded-3xl border border-[#C92D68]/30 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-7 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-red-50">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[#53041B]">
                      Issues Found
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Prioritized recommendations based on your resume and verified profile.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7 space-y-5">
                {issues.map((issue, index) => {
                  const Icon = issue.icon;

                  return (
                    <div
                      key={index}
                      className={`rounded-2xl border ${issue.border} p-5 sm:p-6 bg-white`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                        <div className="flex gap-4">
                          <div className={`p-2.5 rounded-xl ${issue.priorityBg} shrink-0`}>
                            <Icon className={`w-5 h-5 ${issue.priorityColor}`} />
                          </div>

                          <div>
                            <div className={`text-[10px] font-black tracking-[0.14em] ${issue.priorityColor}`}>
                              {issue.priority}
                            </div>

                            <h3 className="font-bold text-gray-900 text-lg mt-1">
                              {issue.title}
                            </h3>

                            <div className="mt-3 bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                              <p className="text-sm text-gray-700 italic leading-relaxed">
                                {issue.quote}
                              </p>
                            </div>

                            <div className="mt-4 grid sm:grid-cols-2 gap-4">
                              <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                                  Why
                                </p>
                                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                  {issue.why}
                                </p>
                              </div>

                              <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-[#770429]">
                                  Suggestion
                                </p>
                                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                                  {issue.suggestion}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveTab('improve')}
                          className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#53041B] hover:bg-[#770429] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                        >
                          {issue.button}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Evidence Opportunities */}
            <section className="bg-white rounded-3xl border border-[#C92D68]/30 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-7 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#F8D8E3]">
                      <Database className="w-5 h-5 text-[#53041B]" />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-[#53041B]">
                        Opportunities From Your Career Profile
                      </h2>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Verified evidence that your current resume isn't fully using.
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Evidence Verified
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-7">
                <div className="grid md:grid-cols-3 gap-4">
                  {opportunities.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={index}
                        className="rounded-2xl border border-[#C92D68]/20 bg-[#FDFBF7] p-5 hover:border-[#BB2649] hover:shadow-sm transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white border border-[#C92D68]/20 flex items-center justify-center mb-4">
                          <Icon className="w-5 h-5 text-[#770429]" />
                        </div>

                        <div className="flex items-center gap-1.5 mb-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-[10px] uppercase tracking-wider font-bold text-green-700">
                            {item.type}
                          </span>
                        </div>

                        <h3 className="font-bold text-[#53041B]">
                          {item.title}
                        </h3>

                        <p className="text-xs text-gray-600 mt-1">
                          {item.subtitle}
                        </p>

                        <button
                          onClick={() => setActiveTab('improve')}
                          className="mt-5 text-xs font-bold text-[#770429] flex items-center gap-1.5 hover:gap-2.5 transition-all cursor-pointer"
                        >
                          Use in resume
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 flex items-start gap-3 p-4 rounded-xl bg-[#FDF0F4] border border-[#C92D68]/20">
                  <Lightbulb className="w-5 h-5 text-[#BB2649] shrink-0" />
                  <p className="text-xs text-[#53041B] leading-relaxed">
                    <strong>ResumeRadar insight:</strong> these opportunities
                    come from your verified career profile, not generic resume advice.
                  </p>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* =====================================================
            IMPROVE TAB
        ====================================================== */}
        {activeTab === 'improve' && (
          <div className="space-y-8">

            {/* Configuration */}
            <section className="bg-white rounded-3xl border border-[#C92D68]/30 shadow-sm p-6 sm:p-8">
              <div className="flex items-start gap-3 mb-7">
                <div className="p-2.5 rounded-xl bg-[#F8D8E3]">
                  <Sparkles className="w-5 h-5 text-[#53041B]" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#53041B]">
                    Improve Your Resume
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Choose what ResumeRadar should optimize using your verified evidence.
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-7">

                <div>
                  <label className="text-xs uppercase tracking-wider font-bold text-[#770429]">
                    Target Role
                  </label>

                  <div className="relative mt-2">
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full appearance-none p-3.5 pr-10 border-2 border-[#C92D68]/40 rounded-xl bg-[#FDFBF7] text-[#53041B] font-semibold outline-none focus:border-[#BB2649] cursor-pointer"
                    >
                      <option>Data Scientist</option>
                      <option>Machine Learning Engineer</option>
                      <option>Full Stack Engineer</option>
                      <option>Frontend Developer</option>
                      <option>Software Engineer</option>
                    </select>

                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#770429] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-[#770429] mb-2">
                    Improvement Mode
                  </p>

                  <div className="grid sm:grid-cols-2 gap-2">
                    {[
                      ['descriptions', 'Strengthen descriptions'],
                      ['postgres', 'Add verified evidence'],
                      ['dsa', 'Add LeetCode / Study Plan stats'],
                      ['summary', 'Improve ATS keywords'],
                      ['coursework', 'Remove unnecessary content'],
                    ].map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => toggleChange(key)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                          selectedChanges[key]
                            ? 'bg-[#FDF0F4] border-[#C92D68]/40 text-[#53041B]'
                            : 'bg-gray-50 border-gray-200 text-gray-500'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                            selectedChanges[key]
                              ? 'bg-[#53041B] border-[#53041B] text-white'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          {selectedChanges[key] && (
                            <Check className="w-3 h-3" />
                          )}
                        </span>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-7 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  Suggestions are checked against your verified evidence.
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#53041B] hover:bg-[#770429] disabled:opacity-70 text-white text-sm font-bold shadow-md transition-all cursor-pointer"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analyze & Improve
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Before / After */}
            <section className="bg-white rounded-3xl border border-[#C92D68]/30 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-7 border-b border-gray-100">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#53041B]">
                      Before vs After
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Example improvement for the {selectedRole} role.
                    </p>
                  </div>

                  <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
              </div>

              <div className="grid lg:grid-cols-2">
                <div className="p-6 sm:p-7 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-100">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-xs uppercase tracking-wider font-black text-gray-500">
                      Before
                    </span>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <h3 className="font-bold text-gray-900">Problem Solving & Coding</h3>
                    <div className="mt-3 flex gap-2">
                      <span className="text-[#53041B] font-bold">•</span>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Solve coding problems regularly on online platforms.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Vague metrics and unverified competitive programming stats
                  </div>
                </div>

                <div className="p-6 sm:p-7 bg-[#FDFBF7]">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-[#F8D8E3] flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#53041B]" />
                    </div>
                    <span className="text-xs uppercase tracking-wider font-black text-[#53041B]">
                      After
                    </span>
                  </div>

                  <div className="bg-white border border-[#C92D68]/30 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-bold text-[#53041B]">Problem Solving & DSA Study Plans</h3>
                    <div className="mt-3 flex gap-2">
                      <span className="text-[#BB2649] font-bold">•</span>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Completed structured LeetCode Study Plans, solving 385+ algorithmic problems with a contest rating of 1840 (Top 6%), demonstrating rigorous proficiency in data structures and algorithms.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid sm:grid-cols-3 gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg px-2.5 py-2">
                      <CheckCircle2 className="w-3.5 h-3.5" /> LeetCode verified
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg px-2.5 py-2">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Rating verified
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg px-2.5 py-2">
                      <ShieldCheck className="w-3.5 h-3.5" /> No unsupported claims
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Suggested Changes */}
            <section className="bg-white rounded-3xl border border-[#C92D68]/30 shadow-sm p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-[#F8D8E3]">
                  <Zap className="w-5 h-5 text-[#53041B]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#53041B]">Suggested Changes</h2>
                  <p className="text-sm text-gray-500 mt-0.5">You stay in control of what gets applied.</p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  ['descriptions', 'Strengthen project descriptions', 'Improves impact and clarity'],
                  ['postgres', 'Add PostgreSQL to ResearchPilot', 'Verified technology'],
                  ['dsa', 'Add LeetCode Study Plan stats & rating', 'Verified competitive programming score'],
                  ['research', 'Add research publication', 'Verified career evidence'],
                  ['summary', 'Improve professional summary', 'Better target-role alignment'],
                ].map(([key, label, sub]) => (
                  <button
                    key={key}
                    onClick={() => toggleChange(key)}
                    className="w-full flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#C92D68]/30 hover:bg-[#FDFBF7] transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          selectedChanges[key]
                            ? 'bg-[#53041B] border-[#53041B] text-white'
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        {selectedChanges[key] && <Check className="w-3.5 h-3.5" />}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{label}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#FDFBF7] border border-[#C92D68]/20">
                <div>
                  <p className="text-sm font-bold text-[#53041B]">
                    {applied ? 'All selected changes applied' : 'Changes selected'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Changes are verified before modifying your resume.</p>
                </div>

                <button
                  onClick={handleApply}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#53041B] hover:bg-[#770429] text-white text-sm font-bold shadow-md transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {applied ? 'Applied Successfully ✓' : 'Apply Selected Changes'}
                </button>
              </div>
            </section>

            {/* Score Improvement */}
            <section className="bg-[#53041B] rounded-3xl p-6 sm:p-8 text-white shadow-lg overflow-hidden relative">
              <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#770429] opacity-60 blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 text-[#F8D8E3] text-xs font-bold uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4" />
                  Projected Improvement
                </div>

                <div className="grid sm:grid-cols-2 gap-8 mt-6">
                  <div>
                    <p className="text-xs text-[#F8D8E3] font-semibold">Resume Readiness</p>
                    <div className="flex items-end gap-3 mt-2">
                      <span className="text-4xl font-black">78%</span>
                      <ArrowRight className="w-6 h-6 mb-2 text-[#F8D8E3]" />
                      <span className="text-4xl font-black text-white">87%</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white/20 overflow-hidden">
                      <div className="h-full w-[87%] rounded-full bg-[#F8D8E3]" />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-[#F8D8E3] font-semibold">ATS Coverage</p>
                    <div className="flex items-end gap-3 mt-2">
                      <span className="text-4xl font-black">71%</span>
                      <ArrowRight className="w-6 h-6 mb-2 text-[#F8D8E3]" />
                      <span className="text-4xl font-black text-white">89%</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white/20 overflow-hidden">
                      <div className="h-full w-[89%] rounded-full bg-[#F8D8E3]" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Unsupported Claim Protection */}
            {!claimHandled && (
              <section className="rounded-3xl border border-red-200 bg-red-50/50 overflow-hidden shadow-sm">
                <div className="p-6 sm:p-7">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-white border border-red-200 shadow-sm shrink-0">
                      <ShieldCheck className="w-6 h-6 text-red-500" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black tracking-[0.15em] text-red-600">
                          UNSUPPORTED CLAIM PROTECTION
                        </span>
                        <span className="px-2 py-1 rounded-full bg-white border border-red-200 text-[10px] font-bold text-red-600">
                          SAFETY CHECK
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-gray-900 mt-1">
                        ResumeRadar won't fabricate your career.
                      </h2>

                      <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-3xl">
                        The improvement engine suggested adding a technology that
                        could not be verified against your career evidence.
                      </p>

                      <div className="mt-5 bg-white rounded-2xl border border-red-200 p-5">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Suggested claim
                            </p>
                            <p className="text-lg font-black text-gray-900 mt-1">
                              Kubernetes
                            </p>
                          </div>
                          <XCircle className="w-7 h-7 text-red-500" />
                        </div>

                        <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100">
                          <p className="text-xs text-red-700 leading-relaxed">
                            No supporting evidence was found across your connected sources. This claim will <strong>not</strong> be added automatically.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 mt-5">
                        <button
                          onClick={() => setClaimHandled(true)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          Keep Out
                        </button>

                        <button
                          onClick={() => setClaimHandled(true)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-red-200 text-red-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          Add Evidence First
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Final Preview */}
            <section className="bg-white rounded-3xl border border-[#C92D68]/30 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-7">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-2 text-green-700 text-xs font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" />
                      Ready to Update
                    </div>

                    <h2 className="text-2xl font-bold text-[#53041B] mt-2">
                      Your improved resume is ready.
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Every suggested addition has been checked against your verified profile.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#FDF0F4] border border-[#C92D68]/20">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Verified</p>
                      <p className="text-xs font-bold text-[#53041B]">Evidence protected</p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 pt-6 border-t border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="flex items-center gap-5">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Resume Score</p>
                      <p className="text-2xl font-black text-[#53041B] mt-1">
                        78% <span className="text-gray-300 mx-2">→</span> <span className="text-green-600">89%</span>
                      </p>
                    </div>

                    <div className="h-10 w-px bg-gray-200" />

                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Target Role</p>
                      <p className="text-sm font-bold text-[#53041B] mt-1">{selectedRole}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setShowPreviewModal(true)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#C92D68]/40 text-[#53041B] hover:bg-[#FDF0F4] text-sm font-bold transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      Preview Resume
                    </button>

                    <button
                      onClick={handleDownloadPDF}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#53041B] hover:bg-[#770429] text-white text-sm font-bold shadow-md transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}

      </div>

      {/* PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-[#C92D68]/30 space-y-6 relative">
            <button 
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b pb-4">
              <h3 className="text-2xl font-black text-[#53041B]">Optimized Resume Preview</h3>
              <p className="text-xs text-gray-500">Target Role: <span className="font-semibold text-[#770429]">{selectedRole}</span></p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4 text-left max-h-[50vh] overflow-y-auto text-sm text-gray-700 leading-relaxed">
              <h4 className="font-black text-gray-900 text-lg">Sadana — Data Science & AI Undergraduate</h4>
              <p className="text-xs text-gray-500">Vellore Institute of Technology · India</p>
              <hr className="border-gray-200" />
              <p><strong>Professional Summary:</strong> Data Science student specializing in machine learning architectures, full-stack applications, and vector data modeling optimized for {selectedRole}.</p>
              <p><strong>Verified Competencies:</strong> Python, PyTorch, React, Node.js, PostgreSQL, Machine Learning.</p>
              <p><strong>DSA & Study Plan Statistics:</strong> Completed LeetCode Study Plans, solving 385+ problems (Contest Rating: 1840, Top 6%).</p>
              <p><strong>Featured Projects:</strong> ResearchPilot, Flood Risk Modeling (PINNs), AeroTwin 3D Dashboard.</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#53041B] hover:bg-[#770429] text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}