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
  Plus,
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
  Award,
  Code2,
  BookOpen,
  BarChart3,
} from 'lucide-react';

export default function ResumeImprover() {
  const [activeTab, setActiveTab] = useState('feedback');
  const [selectedRole, setSelectedRole] = useState('Data Scientist');
  const [analyzing, setAnalyzing] = useState(false);
  const [applied, setApplied] = useState(false);

  const [selectedChanges, setSelectedChanges] = useState({
    descriptions: true,
    postgres: true,
    research: false,
    summary: true,
    coursework: false,
  });

  const healthMetrics = [
    {
      label: 'CONTENT',
      score: 86,
      status: 'Strong',
      icon: FileText,
      color: "text-[var(--color-navy)]",
      bg: "bg-[var(--color-workspace-secondary)]/50",
    },
    {
      label: 'ATS',
      score: 74,
      status: 'Improve',
      icon: Target,
      color: "text-[var(--color-warning-ink)]",
      bg: "bg-[var(--color-warning-soft)]",
    },
    {
      label: 'EVIDENCE',
      score: 91,
      status: 'Strong',
      icon: ShieldCheck,
      color: "text-[var(--color-blue)]",
      bg: "bg-[var(--color-workspace-secondary)]",
    },
    {
      label: 'READABILITY',
      score: 82,
      status: 'Good',
      icon: Eye,
      color: "text-[var(--color-text-secondary)]",
      bg: "bg-[var(--color-workspace-secondary)]",
    },
  ];

  const issues = [
    {
      priority: 'HIGH PRIORITY',
      priorityColor: "text-[var(--color-error-ink)]",
      priorityBg: "bg-[var(--color-error-soft)]",
      border: "border-[var(--color-error)]",
      icon: AlertTriangle,
      title: 'Weak project impact statements',
      quote: '"Developed a machine learning model using Python and PyTorch."',
      why: "The project doesn't communicate the result, measurable outcome, or scale of the work.",
      suggestion: 'Add model performance, dataset size, evaluation metrics, or measurable outcome.',
      button: 'Improve This',
    },
    {
      priority: 'MEDIUM PRIORITY',
      priorityColor: "text-[var(--color-warning-ink)]",
      priorityBg: "bg-[var(--color-warning-soft)]",
      border: "border-[var(--color-gold)]",
      icon: Search,
      title: 'Missing role-specific keywords',
      quote: 'Target role: Data Scientist',
      why: 'Your current resume does not clearly surface several skills expected for this role.',
      suggestion: 'Predictive modeling · Statistical analysis · Model evaluation',
      button: 'Add Keywords',
    },
    {
      priority: 'MEDIUM PRIORITY',
      priorityColor: "text-[var(--color-warning-ink)]",
      priorityBg: "bg-[var(--color-warning-soft)]",
      border: "border-[var(--color-gold)]",
      icon: Database,
      title: 'Project section is underrepresented',
      quote: 'Resume contains 3 projects.',
      why: 'ResumeRadar found 8 projects across your verified career sources.',
      suggestion: 'Consider adding relevant verified projects that strengthen the target role.',
      button: 'View Missing Projects',
    },
  ];

  const opportunities = [
    {
      icon: BookOpen,
      title: 'Research publication',
      subtitle: 'Hydrology Research',
      type: 'Verified research',
    },
    {
      icon: Code2,
      title: 'Computer Vision project',
      subtitle: 'YOLOv8 / Dental Lesion Detection',
      type: 'Verified project',
    },
    {
      icon: Database,
      title: 'PostgreSQL experience',
      subtitle: 'ResearchPilot',
      type: 'Verified technology',
    },
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
    }, 1200);
  };

  const handleApply = () => {
    setApplied(true);
  };

  return (
    <div className="rr-page rr-resume-demo min-h-full bg-[var(--color-workspace)] pb-16">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[var(--radius-panel)] border border-[var(--color-border)]/30 bg-[var(--color-surface)] shadow-sm">
          <div className="absolute -right-20 -top-24 w-80 h-80 rounded-full bg-[var(--color-workspace-secondary)]/50 hidden pointer-events-none" />
          <div className="absolute -left-20 bottom-0 w-64 h-64 rounded-full bg-[var(--color-workspace-secondary)] hidden pointer-events-none" />

          <div className="relative z-10 p-7 sm:p-9">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-workspace-secondary)] text-[var(--color-navy)] text-xs font-bold mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI + VERIFIED EVIDENCE
                </div>

                <p className="rr-demo-label">Interactive demo / Sample content</p>
          <p className="rr-eyebrow">Resume workspace</p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--color-navy)] tracking-tight">
                  Resume Improver
                </h1>

                <p className="mt-3 text-[var(--color-text-secondary)] text-sm sm:text-base leading-relaxed">
                  Your resume should represent what you've actually done.
                  ResumeRadar uses your verified career evidence to improve
                  your resume without inventing experience.
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-5 text-xs font-semibold text-[var(--color-text-muted)]">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[var(--color-blue)]" />
                    Evidence-backed
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-[var(--color-blue)]" />
                    Role-aware
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    No fabricated claims
                  </span>
                </div>
              </div>

              {/* Resume Health */}
              <div className="shrink-0 lg:w-60">
                <div className="rounded-[var(--radius-panel)] border border-[var(--color-border)]/30 bg-[var(--color-workspace)] p-5 text-center">
                  <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-[var(--color-text-secondary)]">
                    Resume Health
                  </p>

                  <div className="relative w-28 h-28 mx-auto my-3">
                    <svg
                      className="w-full h-full -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        className="text-[var(--color-text-muted)]"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[var(--color-navy)]"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                        strokeDasharray="78, 100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-semibold text-[var(--color-navy)]">
                        78%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-[var(--color-text-muted)]">
                    <span>8 strengths</span>
                    <span className="text-[var(--color-text-muted)]">•</span>
                    <span>5 improvements</span>
                    <span className="text-[var(--color-text-muted)]">•</span>
                    <span>2 gaps</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =====================================================
            TABS
        ====================================================== */}
        <div className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] border border-[var(--color-border)]/30 p-1.5 shadow-sm flex max-w-xl">
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-[var(--radius-control)] text-sm font-bold transition-all ${
              activeTab === 'feedback'
                ? "bg-[var(--color-workspace-secondary)] text-[var(--color-navy)] shadow-[var(--shadow-panel)]"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-workspace-secondary)]"
            }`}
          >
            <Search className="w-4 h-4" />
            Feedback
          </button>

          <button
            onClick={() => setActiveTab('improve')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-[var(--radius-control)] text-sm font-bold transition-all ${
              activeTab === 'improve'
                ? "bg-[var(--color-workspace-secondary)] text-[var(--color-navy)] shadow-[var(--shadow-panel)]"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-workspace-secondary)]"
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
                <h2 className="text-xl font-bold text-[var(--color-navy)]">
                  Resume Health Overview
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  A quick diagnosis of how your resume performs across key areas.
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {healthMetrics.map((metric) => {
                  const Icon = metric.icon;

                  return (
                    <div
                      key={metric.label}
                      className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] border border-[var(--color-border)]/30 p-5 shadow-sm hover:shadow-[var(--shadow-panel)] transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2.5 rounded-[var(--radius-panel)] ${metric.bg}`}>
                          <Icon className={`w-5 h-5 ${metric.color}`} />
                        </div>

                        <span className={`text-2xl font-semibold ${metric.color}`}>
                          {metric.score}%
                        </span>
                      </div>

                      <p className="text-xs font-bold tracking-wider text-[var(--color-text-muted)]">
                        {metric.label}
                      </p>

                      <div className="mt-3 h-1.5 rounded-full bg-[var(--color-surface)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--color-navy)]"
                          style={{ width: `${metric.score}%` }}
                        />
                      </div>

                      <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold">
                        {metric.score >= 80 ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-blue)]" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-[var(--color-warning-ink)]" />
                        )}
                        <span className="text-[var(--color-text-secondary)]">
                          {metric.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Issues */}
            <section className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] border border-[var(--color-border)]/30 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-7 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-[var(--radius-panel)] bg-[var(--color-error-soft)]">
                    <AlertTriangle className="w-5 h-5 text-[var(--color-error-ink)]" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[var(--color-navy)]">
                      Issues Found
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
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
                      className={`rounded-[var(--radius-panel)] border ${issue.border} p-5 sm:p-6`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">

                        <div className="flex gap-4">
                          <div className={`p-2.5 rounded-[var(--radius-panel)] ${issue.priorityBg} shrink-0`}>
                            <Icon className={`w-5 h-5 ${issue.priorityColor}`} />
                          </div>

                          <div>
                            <div className={`text-[10px] font-semibold tracking-[0.14em] ${issue.priorityColor}`}>
                              {issue.priority}
                            </div>

                            <h3 className="font-bold text-[var(--color-text-primary)] text-lg mt-1">
                              {issue.title}
                            </h3>

                            <div className="mt-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-panel)] p-3.5">
                              <p className="text-sm text-[var(--color-text-secondary)] italic leading-relaxed">
                                {issue.quote}
                              </p>
                            </div>

                            <div className="mt-4 grid sm:grid-cols-2 gap-4">
                              <div>
                                <p className="text-[10px] tracking-wide font-bold text-[var(--color-text-muted)]">
                                  Why
                                </p>
                                <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                                  {issue.why}
                                </p>
                              </div>

                              <div>
                                <p className="text-[10px] tracking-wide font-bold text-[var(--color-text-secondary)]">
                                  Suggestion
                                </p>
                                <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                                  {issue.suggestion}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveTab('improve')}
                          className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[var(--radius-control)] bg-[var(--color-orange)] hover:bg-[var(--color-gold)] text-[var(--color-navy)] text-xs font-bold shadow-sm transition-colors"
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
            <section className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] border border-[var(--color-border)]/30 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-7 border-b border-[var(--color-border)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-[var(--radius-panel)] bg-[var(--color-workspace-secondary)]">
                      <Database className="w-5 h-5 text-[var(--color-navy)]" />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-[var(--color-navy)]">
                        Opportunities From Your Career Profile
                      </h2>
                      <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                        Verified evidence that your current resume isn't fully using.
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-workspace-secondary)] text-[var(--color-blue)] border border-[var(--color-border)] text-xs font-bold">
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
                        className="rounded-[var(--radius-panel)] border border-[var(--color-border)]/20 bg-[var(--color-workspace)] p-5 hover:border-[var(--color-border)] hover:shadow-sm transition-all"
                      >
                        <div className="w-10 h-10 rounded-[var(--radius-panel)] bg-[var(--color-surface)] border border-[var(--color-border)]/20 flex items-center justify-center mb-4">
                          <Icon className="w-5 h-5 text-[var(--color-text-secondary)]" />
                        </div>

                        <div className="flex items-center gap-1.5 mb-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-blue)]" />
                          <span className="text-[10px] tracking-wide font-bold text-[var(--color-blue)]">
                            {item.type}
                          </span>
                        </div>

                        <h3 className="font-bold text-[var(--color-navy)]">
                          {item.title}
                        </h3>

                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                          {item.subtitle}
                        </p>

                        <button
                          onClick={() => setActiveTab('improve')}
                          className="mt-5 text-xs font-bold text-[var(--color-text-secondary)] flex items-center gap-1.5 hover:gap-2.5 transition-all"
                        >
                          Use in resume
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 flex items-start gap-3 p-4 rounded-[var(--radius-panel)] bg-[var(--color-workspace-secondary)] border border-[var(--color-border)]/20">
                  <Lightbulb className="w-5 h-5 text-[var(--color-blue)] shrink-0" />
                  <p className="text-xs text-[var(--color-navy)] leading-relaxed">
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
            <section className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] border border-[var(--color-border)]/30 shadow-sm p-6 sm:p-8">
              <div className="flex items-start gap-3 mb-7">
                <div className="p-2.5 rounded-[var(--radius-panel)] bg-[var(--color-workspace-secondary)]">
                  <Sparkles className="w-5 h-5 text-[var(--color-navy)]" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[var(--color-navy)]">
                    Improve Your Resume
                  </h2>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">
                    Choose what ResumeRadar should optimize using your verified evidence.
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-7">

                <div>
                  <label className="text-xs tracking-wide font-bold text-[var(--color-text-secondary)]">
                    Target Role
                  </label>

                  <div className="relative mt-2">
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full appearance-none p-3.5 pr-10 border-2 border-[var(--color-border)]/40 rounded-[var(--radius-panel)] bg-[var(--color-workspace)] text-[var(--color-navy)] font-semibold outline-none focus:border-[var(--color-focus)] focus:ring-2 focus:ring-[var(--color-focus)]/20"
                    >
                      <option>Data Scientist</option>
                      <option>Machine Learning Engineer</option>
                      <option>Full Stack Engineer</option>
                      <option>Frontend Developer</option>
                      <option>Software Engineer</option>
                    </select>

                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <p className="text-xs tracking-wide font-bold text-[var(--color-text-secondary)] mb-2">
                    Improvement Mode
                  </p>

                  <div className="grid sm:grid-cols-2 gap-2">
                    {[
                      ['descriptions', 'Strengthen descriptions'],
                      ['postgres', 'Add verified evidence'],
                      ['summary', 'Improve ATS keywords'],
                      ['coursework', 'Remove unnecessary content'],
                    ].map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => toggleChange(key)}
                        className={`flex items-center gap-2.5 p-3 rounded-[var(--radius-control)] border text-left text-xs font-semibold transition-all ${
                          selectedChanges[key]
                            ? "bg-[var(--color-workspace-secondary)] border-[var(--color-border)]/40 text-[var(--color-navy)]"
                            : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-muted)]"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                            selectedChanges[key]
                              ? "bg-[var(--color-navy)] border-[var(--color-border)] text-[var(--color-surface)]"
                              : "bg-[var(--color-surface)] border-[var(--color-border)]"
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

              <div className="mt-7 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                  <ShieldCheck className="w-4 h-4 text-[var(--color-blue)]" />
                  Suggestions are checked against your verified evidence.
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--radius-control)] bg-[var(--color-orange)] hover:bg-[var(--color-gold)] disabled:opacity-70 text-[var(--color-navy)] text-sm font-bold shadow-[var(--shadow-panel)] transition-all"
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
            <section className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] border border-[var(--color-border)]/30 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-7 border-b border-[var(--color-border)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--color-navy)]">
                      Before vs After
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                      Example improvement for the {selectedRole} role.
                    </p>
                  </div>

                  <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-workspace-secondary)] border border-[var(--color-border)] text-[var(--color-blue)] text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
              </div>

              <div className="grid lg:grid-cols-2">

                {/* Before */}
                <div className="p-6 sm:p-7 bg-[var(--color-surface)] border-b lg:border-b-0 lg:border-r border-[var(--color-border)]">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-workspace-secondary)] flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    </div>
                    <span className="text-xs tracking-wide font-semibold text-[var(--color-text-muted)]">
                      Before
                    </span>
                  </div>

                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-panel)] p-5">
                    <h3 className="font-bold text-[var(--color-text-primary)]">
                      ResearchPilot
                    </h3>

                    <div className="mt-3 flex gap-2">
                      <span className="text-[var(--color-navy)] font-bold">•</span>
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                        Developed an AI research assistant using React and Node.js.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <AlertTriangle className="w-4 h-4 text-[var(--color-warning-ink)]" />
                    Limited impact and evidence visibility
                  </div>
                </div>

                {/* After */}
                <div className="p-6 sm:p-7 bg-[var(--color-workspace)]">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-workspace-secondary)] flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[var(--color-navy)]" />
                    </div>
                    <span className="text-xs tracking-wide font-semibold text-[var(--color-navy)]">
                      After
                    </span>
                  </div>

                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)]/30 rounded-[var(--radius-panel)] p-5 shadow-sm">
                    <h3 className="font-bold text-[var(--color-navy)]">
                      ResearchPilot
                    </h3>

                    <div className="mt-3 flex gap-2">
                      <span className="text-[var(--color-blue)] font-bold">•</span>
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                        Developed an AI-powered research assistant using React,
                        Node.js and PostgreSQL, enabling automated research
                        discovery and analysis.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid sm:grid-cols-3 gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-blue)] bg-[var(--color-workspace-secondary)] border border-[var(--color-border)] rounded-lg px-2.5 py-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Technologies verified
                    </span>

                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-blue)] bg-[var(--color-workspace-secondary)] border border-[var(--color-border)] rounded-lg px-2.5 py-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Project verified
                    </span>

                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-blue)] bg-[var(--color-workspace-secondary)] border border-[var(--color-border)] rounded-lg px-2.5 py-2">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      No unsupported claims
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Suggested Changes */}
            <section className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] border border-[var(--color-border)]/30 shadow-sm p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-[var(--radius-panel)] bg-[var(--color-workspace-secondary)]">
                  <Zap className="w-5 h-5 text-[var(--color-navy)]" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[var(--color-navy)]">
                    Suggested Changes
                  </h2>
                  <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                    You stay in control of what gets applied.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  ['descriptions', 'Strengthen project descriptions', 'Improves impact and clarity'],
                  ['postgres', 'Add PostgreSQL to ResearchPilot', 'Verified technology'],
                  ['research', 'Add research publication', 'Verified career evidence'],
                  ['summary', 'Improve professional summary', 'Better target-role alignment'],
                  ['coursework', 'Remove coursework section', 'Reduce low-value content'],
                ].map(([key, label, sub]) => (
                  <button
                    key={key}
                    onClick={() => toggleChange(key)}
                    className="w-full flex items-center justify-between gap-4 p-4 rounded-[var(--radius-control)] border border-[var(--color-border)] hover:border-[var(--color-border)]/30 hover:bg-[var(--color-workspace)] transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          selectedChanges[key]
                            ? "bg-[var(--color-navy)] border-[var(--color-border)] text-[var(--color-surface)]"
                            : "bg-[var(--color-surface)] border-[var(--color-border)]"
                        }`}
                      >
                        {selectedChanges[key] && (
                          <Check className="w-3.5 h-3.5" />
                        )}
                      </span>

                      <div>
                        <p className="text-sm font-bold text-[var(--color-text-primary)]">
                          {label}
                        </p>
                        <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                          {sub}
                        </p>
                      </div>
                    </div>

                    {key === 'research' && (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[var(--color-workspace-secondary)] text-[var(--color-navy)]">
                        OPTIONAL
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-[var(--radius-panel)] bg-[var(--color-workspace)] border border-[var(--color-border)]/20">
                <div>
                  <p className="text-sm font-bold text-[var(--color-navy)]">
                    {applied ? '3 changes applied' : '3 changes selected'}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Changes are previewed before modifying your resume.
                  </p>
                </div>

                <button
                  onClick={handleApply}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[var(--radius-control)] bg-[var(--color-orange)] hover:bg-[var(--color-gold)] text-[var(--color-navy)] text-sm font-bold shadow-[var(--shadow-panel)] transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Apply Selected Changes
                </button>
              </div>
            </section>

            {/* Score Improvement */}
            <section className="bg-[var(--color-navy)] rounded-[var(--radius-panel)] p-6 sm:p-8 text-[var(--color-surface)] shadow-[var(--shadow-panel)] overflow-hidden relative">
              <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[var(--color-navy-secondary)] opacity-60 hidden" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 text-[var(--color-surface)] text-xs font-bold tracking-wide">
                  <TrendingUp className="w-4 h-4" />
                  Projected Improvement
                </div>

                <div className="grid sm:grid-cols-2 gap-8 mt-6">
                  <div>
                    <p className="text-xs text-[var(--color-surface)] font-semibold">
                      Resume Readiness
                    </p>

                    <div className="flex items-end gap-3 mt-2">
                      <span className="text-4xl font-semibold">78%</span>
                      <ArrowRight className="w-6 h-6 mb-2 text-[var(--color-surface)]" />
                      <span className="text-4xl font-semibold text-[var(--color-surface)]">87%</span>
                    </div>

                    <div className="mt-3 h-2 rounded-full bg-[var(--color-surface)]/20 overflow-hidden">
                      <div className="h-full w-[87%] rounded-full bg-[var(--color-workspace-secondary)]" />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--color-surface)] font-semibold">
                      ATS Coverage
                    </p>

                    <div className="flex items-end gap-3 mt-2">
                      <span className="text-4xl font-semibold">71%</span>
                      <ArrowRight className="w-6 h-6 mb-2 text-[var(--color-surface)]" />
                      <span className="text-4xl font-semibold text-[var(--color-surface)]">89%</span>
                    </div>

                    <div className="mt-3 h-2 rounded-full bg-[var(--color-surface)]/20 overflow-hidden">
                      <div className="h-full w-[89%] rounded-full bg-[var(--color-workspace-secondary)]" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Unsupported Claim Protection */}
            <section className="rounded-[var(--radius-panel)] border border-[var(--color-error)] bg-[var(--color-error-soft)]/50 overflow-hidden shadow-sm">
              <div className="p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-[var(--radius-panel)] bg-[var(--color-surface)] border border-[var(--color-error)] shadow-sm shrink-0">
                    <ShieldCheck className="w-6 h-6 text-[var(--color-error-ink)]" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-semibold tracking-[0.15em] text-[var(--color-error-ink)]">
                        UNSUPPORTED CLAIM PROTECTION
                      </span>

                      <span className="px-2 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-error)] text-[10px] font-bold text-[var(--color-error-ink)]">
                        SAFETY CHECK
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-[var(--color-text-primary)] mt-1">
                      ResumeRadar won't fabricate your career.
                    </h2>

                    <p className="text-sm text-[var(--color-text-secondary)] mt-2 leading-relaxed max-w-3xl">
                      The improvement engine suggested adding a technology that
                      could not be verified against your career evidence.
                    </p>

                    <div className="mt-5 bg-[var(--color-surface)] rounded-[var(--radius-panel)] border border-[var(--color-error)] p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold text-[var(--color-text-muted)] tracking-wide">
                            Suggested claim
                          </p>
                          <p className="text-lg font-semibold text-[var(--color-text-primary)] mt-1">
                            Kubernetes
                          </p>
                        </div>

                        <XCircle className="w-7 h-7 text-[var(--color-error-ink)]" />
                      </div>

                      <div className="mt-4 p-3 rounded-[var(--radius-panel)] bg-[var(--color-error-soft)] border border-[var(--color-error)]">
                        <p className="text-xs text-[var(--color-error-ink)] leading-relaxed">
                          No supporting evidence was found across your connected
                          sources. This claim will <strong>not</strong> be added automatically.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-5">
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[var(--radius-control)] bg-[var(--color-error)] hover:bg-[var(--color-error)] text-[var(--color-surface)] text-xs font-bold transition-colors">
                        <X className="w-4 h-4" />
                        Keep Out
                      </button>

                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[var(--radius-control)] bg-[var(--color-surface)] hover:bg-[var(--color-surface)] border border-[var(--color-error)] text-[var(--color-error-ink)] text-xs font-bold transition-colors">
                        <Plus className="w-4 h-4" />
                        Add Evidence First
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Final Preview */}
            <section className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] border border-[var(--color-border)]/30 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-7">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-2 text-[var(--color-blue)] text-xs font-bold tracking-wide">
                      <CheckCircle2 className="w-4 h-4" />
                      Ready to Update
                    </div>

                    <h2 className="text-2xl font-bold text-[var(--color-navy)] mt-2">
                      Your improved resume is ready.
                    </h2>

                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                      Every suggested addition has been checked against your verified profile.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-3 rounded-[var(--radius-panel)] bg-[var(--color-workspace-secondary)] border border-[var(--color-border)]/20">
                    <ShieldCheck className="w-5 h-5 text-[var(--color-blue)]" />
                    <div>
                      <p className="text-[10px] tracking-wide font-bold text-[var(--color-text-muted)]">
                        Verified
                      </p>
                      <p className="text-xs font-bold text-[var(--color-navy)]">
                        Evidence protected
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-7">
                  {[
                    'Grammar improved',
                    'Project descriptions strengthened',
                    'Relevant keywords added',
                    'Verified evidence incorporated',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 p-3 rounded-[var(--radius-panel)] bg-[var(--color-workspace-secondary)] border border-[var(--color-border)]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-blue)] shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-[var(--color-blue)]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-7 pt-6 border-t border-[var(--color-border)] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="flex items-center gap-5">
                    <div>
                      <p className="text-[10px] tracking-wide font-bold text-[var(--color-text-muted)]">
                        Resume Score
                      </p>
                      <p className="text-2xl font-semibold text-[var(--color-navy)] mt-1">
                        78%
                        <span className="text-[var(--color-text-muted)] mx-2">→</span>
                        <span className="text-[var(--color-blue)]">89%</span>
                      </p>
                    </div>

                    <div className="h-10 w-px bg-[var(--color-workspace-secondary)]" />

                    <div>
                      <p className="text-[10px] tracking-wide font-bold text-[var(--color-text-muted)]">
                        Target Role
                      </p>
                      <p className="text-sm font-bold text-[var(--color-navy)] mt-1">
                        {selectedRole}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[var(--radius-control)] border border-[var(--color-border)]/40 text-[var(--color-navy)] hover:bg-[var(--color-workspace-secondary)] text-sm font-bold transition-colors">
                      <Eye className="w-4 h-4" />
                      Preview Resume
                    </button>

                    <button className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[var(--radius-control)] bg-[var(--color-orange)] hover:bg-[var(--color-gold)] text-[var(--color-navy)] text-sm font-bold shadow-[var(--shadow-panel)] transition-colors">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Product philosophy */}
            <div className="text-center py-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)]">
                <ShieldCheck className="w-4 h-4 text-[var(--color-blue)]" />
                Improve the resume. Don't fabricate the career.
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}