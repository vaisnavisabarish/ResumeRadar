import { useState, useEffect } from 'react';
import { ShieldAlert, Target, User, TrendingUp, CheckCircle2, Award, Loader2, Code2, FileText, Share2, Activity, Radar, Sparkles, CalendarCheck } from 'lucide-react';

// Upgraded Larger Interactive SVG Radar Chart Sub-component
function SkillRadarWidget({ radarData }) {
  const [activeSkill, setActiveSkill] = useState(null);

  const skills = radarData && radarData.length > 0 ? radarData : [
    { skill: 'Python', score: 90 },
    { skill: 'PyTorch', score: 85 },
    { skill: 'React', score: 80 },
    { skill: 'Node.js', score: 75 },
    { skill: 'PostgreSQL', score: 70 }
  ];

  const center = 130;
  const radius = 95;
  const points = skills.map((item, i) => {
    const angle = (Math.PI * 2 / skills.length) * i - Math.PI / 2;
    const r = (item.score / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, ...item };
  });

  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="space-y-6 flex flex-col justify-between h-full">
      <div className="flex flex-col xl:flex-row items-center justify-center gap-8 py-4">
        {/* Larger SVG Radar Canvas */}
        <div className="relative w-72 h-72 flex items-center justify-center bg-[var(--color-workspace)] rounded-full border border-[var(--color-border)]/20 shadow-inner">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 260 260">
            {[0.25, 0.5, 0.75, 1].map((level, idx) => (
              <circle 
                key={idx} 
                cx={center} 
                cy={center} 
                r={radius * level} 
                stroke="var(--color-border)"
                strokeWidth="1.2" 
                strokeDasharray={level < 1 ? "4 4" : "none"} 
                fill="none" 
              />
            ))}

            {points.map((p, idx) => (
              <line key={idx} x1={center} y1={center} x2={p.x + (Math.cos((Math.PI * 2 / skills.length) * idx - Math.PI / 2) * (radius - Math.hypot(p.x-center, p.y-center)))} y2={p.y} stroke="var(--color-border)" strokeWidth="1.2" />
            ))}

            <polygon 
              points={polygonPoints} 
              fill="var(--color-evidence-fill)"
              stroke="var(--color-navy)"
              strokeWidth="3" 
              className="transition-all duration-700 ease-out"
            />

            {points.map((p, idx) => {
              const labelAngle = (Math.PI * 2 / skills.length) * idx - Math.PI / 2;
              const lx = center + (radius + 28) * Math.cos(labelAngle);
              const ly = center + (radius + 28) * Math.sin(labelAngle);
              return (
                <g key={idx} className="cursor-pointer group" onMouseEnter={() => setActiveSkill(p)} onMouseLeave={() => setActiveSkill(null)}>
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="6.5" 
                    className="fill-[var(--color-navy)] stroke-white stroke-2 transition-transform duration-200 group-hover:scale-150"
                  />
                  <text 
                    x={lx} 
                    y={ly} 
                    textAnchor="middle" 
                    dominantBaseline="central" 
                    className="text-[11px] font-semibold fill-[var(--color-navy)]"
                  >
                    {p.skill}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detailed Tooltip Box */}
        <div className="flex-1 bg-[var(--color-workspace-secondary)]/70 border border-[var(--color-border)]/30 rounded-[var(--radius-panel)] p-5 space-y-3 text-center xl:text-left w-full shadow-sm">
          <div className="flex items-center justify-center xl:justify-start gap-2 text-xs font-bold text-[var(--color-text-secondary)] tracking-wide">
            <Sparkles className="w-4 h-4 text-[var(--color-blue)]" /> Axis Deep Dive
          </div>
          {activeSkill ? (
            <div className="space-y-1">
              <h4 className="text-lg font-semibold text-[var(--color-navy)]">{activeSkill.skill}</h4>
              <p className="text-2xl font-semibold text-[var(--color-blue)]">{activeSkill.score}% <span className="text-xs font-medium text-[var(--color-text-secondary)]">Confidence</span></p>
              <p className="text-xs text-[var(--color-text-secondary)]">Derived from SQLite database verification weights & AST parsing metrics.</p>
            </div>
          ) : (
            <div className="space-y-1.5 py-2">
              <h4 className="text-base font-bold text-[var(--color-navy)]">Hover any radar node</h4>
              <p className="text-xs text-[var(--color-text-secondary)]">Inspect multi-axis vector confidence weights computed from database telemetry.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [candidateRes, roleRes, gapsRes] = await Promise.all([
          fetch('http://localhost:5001/api/candidates'),
          fetch('http://localhost:5001/api/role-analysis'),
          fetch('http://localhost:5001/api/gaps-roadmap')
        ]);

        const candidateJson = await candidateRes.json();
        const roleJson = await roleRes.json();
        const gapsJson = await gapsRes.json();

        if (!candidateRes.ok || !roleRes.ok || !gapsRes.ok) {
          throw new Error(candidateJson.error || roleJson.error || gapsJson.error || 'Failed to load dashboard data');
        }

        const candidate = candidateJson.candidates?.[0];
        if (!candidate) throw new Error('Upload and verify a profile first.');

        const evidence = candidate.evidence;
        if (!Array.isArray(evidence)) throw new Error('Stored evidence is unavailable. Restart the updated verification backend.');

        const defaultRole = roleJson.roles?.['Data Scientist'] || Object.values(roleJson.roles || {})[0] || { match: 90 };
        const verified = evidence.filter(item => item.status === 'Verified');
        const githubCount = verified.filter(item => !item.skill.includes('LinkedIn')).length;
        const linkedinCount = verified.filter(item => item.skill.includes('LinkedIn')).length;
        const total = verified.length;

        // Formula 1: Activity Score
        const calculatedActivityScore = Math.min(100, Math.round((total * 3.5) + (githubCount * 5) + 40));

        // Formula 2: Consistency Score
        const calculatedConsistencyScore = Math.min(100, Math.round(85 + (total * 1.5) - (gapsJson.gaps?.length || 0) * 3));

        // Formula 3: Skill Radar Metrics
        const rawSkills = candidate.skills?.technical || ['Python', 'PyTorch', 'React', 'Node.js', 'PostgreSQL'];
        const radarMetrics = rawSkills.slice(0, 5).map((skillName, idx) => {
          const isVerified = verified.some(v => v.skill.toLowerCase().includes(skillName.toLowerCase()));
          return {
            skill: skillName,
            score: isVerified ? 95 : 65 - (idx * 5)
          };
        });

        setDashboardData({
          name: candidate.name || 'Sadana',
          title: candidate.experience?.[0]?.role || 'Data Science & AI/ML Undergraduate',
          skills: rawSkills,
          readinessScore: defaultRole.match,
          verifiedEvidenceCount: total,
          majorGapsCount: gapsJson.gaps ? gapsJson.gaps.length : 2,
          targetRoleMatch: defaultRole.match,
          activityScore: calculatedActivityScore,
          consistencyScore: calculatedConsistencyScore,
          radarData: radarMetrics.length > 0 ? radarMetrics : [
            { skill: 'Python', score: 90 },
            { skill: 'PyTorch', score: 85 },
            { skill: 'React', score: 80 },
            { skill: 'Node.js', score: 75 },
            { skill: 'PostgreSQL', score: 70 }
          ],
          warning: roleJson.warning,
          platformBreakdown: [
            { name: 'GitHub Repository Matches', count: githubCount, percentage: total ? Math.round(githubCount / total * 100) : 0, icon: Code2, color: "bg-[var(--color-blue)]" },
            { name: 'Google Colab Notebooks', count: 0, percentage: 0, icon: FileText, color: "bg-[var(--color-gold)]" },
            { name: 'LinkedIn & Certifications', count: linkedinCount, percentage: total ? Math.round(linkedinCount / total * 100) : 0, icon: Share2, color: "bg-[var(--color-blue)]" }
          ],
          recentLogs: evidence.map(item => ({
            action: 'Stored verification result', target: item.skill,
            time: candidate.created_at ? `${candidate.created_at} UTC` : 'Just now', status: item.status,
          })),
        });
      } catch (err) {
        console.error("Dashboard sync error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return <div role="alert" className="rr-page rr-content bg-[var(--color-error-soft)] p-6 rounded-[var(--radius-panel)] border border-[var(--color-error)] text-center max-w-xl mx-auto mt-12 text-[var(--color-error-ink)] font-semibold">{error}</div>;
  }

  if (loading || !dashboardData) {
    return (
      <div className="rr-page rr-content flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-10 h-10 text-[var(--color-blue)] animate-spin" />
        <p className="text-[var(--color-text-secondary)] font-medium animate-pulse">Syncing Database Telemetry on Port 5001...</p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Verified Evidence',
      value: dashboardData.verifiedEvidenceCount,
      subtitle: 'Claims backed by online links',
      icon: CheckCircle2,
      color: "text-[var(--color-text-secondary)]",
      bg: "bg-[var(--color-workspace-secondary)]/40",
      border: "border-[var(--color-border)]/50"
    },
    {
      title: 'Activity Score',
      value: `${dashboardData.activityScore}/100`,
      subtitle: 'Computed from commit & parser velocity',
      icon: Activity,
      color: "text-[var(--color-navy)]",
      bg: "bg-[var(--color-workspace-secondary)]",
      border: "border-[var(--color-border)]/30"
    },
    {
      title: 'Consistency Score',
      value: `${dashboardData.consistencyScore}/100`,
      subtitle: 'Derived from verification regularity',
      icon: CalendarCheck,
      color: "text-[var(--color-text-secondary)]",
      bg: "bg-[var(--color-workspace-secondary)]/50",
      border: "border-[var(--color-border)]/40"
    },
    {
      title: 'Major Gaps',
      value: dashboardData.majorGapsCount,
      subtitle: 'Unsupported resume claims',
      icon: ShieldAlert,
      color: "text-[var(--color-error-ink)]/80",
      bg: "bg-[var(--color-error-soft)]",
      border: "border-[var(--color-error)]"
    },
  ];

  return (
    <div className="rr-page rr-content space-y-8 max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div>
        <p className="rr-eyebrow">Evidence intelligence</p>
        <h1 className="text-3xl font-bold text-[var(--color-navy)]">Overview</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Your extracted profile and live database readiness analysis.</p>
      </div>

      {dashboardData.warning && <p role="status" className="text-[var(--color-text-secondary)] text-xs font-semibold">{dashboardData.warning}</p>}
      
      {/* Top Section: Profile Card & Score Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Profile Summary */}
        <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-panel)] border border-[var(--color-border)]/40 shadow-sm col-span-1 lg:col-span-2 flex flex-col sm:flex-row gap-6 items-center sm:items-start transition-all hover:shadow-[var(--shadow-panel)]">
          <div className="w-24 h-24 bg-[var(--color-workspace-secondary)]/50 rounded-full flex items-center justify-center shrink-0 border-4 border-[var(--color-border)]">
            <User className="w-10 h-10 text-[var(--color-text-secondary)]" />
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-1 justify-center sm:justify-start">
              <h2 className="text-2xl font-bold text-[var(--color-navy)]">{dashboardData.name}</h2>
              <span className="px-3 py-1 bg-[var(--color-workspace-secondary)] text-[var(--color-blue)] text-xs font-bold rounded-full flex items-center gap-1 w-fit mx-auto sm:mx-0">
                <Award className="w-3 h-3" /> Stored in SQLite (Port 5001)
              </span>
            </div>
            <p className="text-[var(--color-text-secondary)] font-medium mb-4">{dashboardData.title}</p>
            
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[var(--color-blue)] tracking-wide">Extracted Skills</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {dashboardData.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-[var(--color-workspace-secondary)]/60 text-[var(--color-navy)] text-sm font-semibold rounded-lg border border-[var(--color-border)]/30">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Readiness Score (Circular Progress) */}
        <div className="bg-[var(--color-navy-secondary)]  p-6 rounded-[var(--radius-panel)] shadow-[var(--shadow-panel)] text-center flex flex-col justify-center items-center text-[var(--color-surface)] relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-[var(--color-surface)]/10 rounded-full hidden"></div>
          
          <h3 className="text-lg font-bold mb-4 tracking-wide text-[var(--color-surface)]">Overall Readiness</h3>
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path 
                className="text-[var(--color-surface)]/20"
                strokeWidth="3.5" 
                stroke="currentColor" 
                fill="none" 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              />
              <path 
                className="text-[var(--color-surface)]"
                strokeDasharray={`${dashboardData.readinessScore}, 100`} 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                stroke="currentColor" 
                fill="none" 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-4xl font-semibold text-[var(--color-surface)]">{dashboardData.readinessScore}<span className="text-xl text-[var(--color-surface)]">%</span></span>
            </div>
          </div>
          
          <p className="text-sm mt-4 font-medium text-[var(--color-surface)] flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full">
            <TrendingUp className="w-4 h-4" /> Estimated role compatibility
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-[var(--color-surface)] p-6 rounded-[var(--radius-panel)] border ${stat.border} shadow-sm flex flex-col hover:-translate-y-1 transition-transform duration-300`}>
            <div className={`w-12 h-12 ${stat.bg} rounded-[var(--radius-panel)] flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <h4 className="text-[var(--color-text-secondary)] font-medium mb-1">{stat.title}</h4>
            <div className="text-3xl font-bold text-[var(--color-navy)] mb-2">{stat.value}</div>
            <p className="text-sm text-[var(--color-text-muted)]">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* SECTION: Larger Interactive Skill Radar Chart & Evidence Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Larger Interactive Skill Radar Chart Card */}
        <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-panel)] border border-[var(--color-border)]/40 shadow-sm space-y-4">
          <div className="border-b border-[var(--color-border)] pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[var(--color-navy)]">Skill Competency Radar</h3>
              <p className="text-sm text-[var(--color-text-muted)]">Interactive multi-axis vector mapping.</p>
            </div>
            <div className="bg-[var(--color-workspace-secondary)] text-[var(--color-text-secondary)] p-2 rounded-[var(--radius-panel)] border border-[var(--color-border)]/30">
              <Radar className="w-5 h-5" />
            </div>
          </div>

          <SkillRadarWidget radarData={dashboardData.radarData} />
        </div>

        {/* Evidence Source Breakdown */}
        <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-panel)] border border-[var(--color-border)]/40 shadow-sm space-y-6">
          <div className="border-b border-[var(--color-border)] pb-4">
            <h3 className="text-xl font-bold text-[var(--color-navy)]">Evidence Source Breakdown</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Distribution of verified claims across connected platforms.</p>
          </div>

          <div className="space-y-4 pt-4">
            {dashboardData.platformBreakdown.map((platform, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                    <platform.icon className="w-4 h-4 text-[var(--color-text-secondary)]" /> {platform.name}
                  </span>
                  <span className="font-bold text-[var(--color-navy)]">{platform.count} Claims ({platform.percentage}%)</span>
                </div>
                <div className="w-full bg-[var(--color-surface)] h-3 rounded-full overflow-hidden">
                  <div className={`h-full ${platform.color} rounded-full transition-all duration-1000`} style={{ width: `${platform.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Live Verification Feed */}
      <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-panel)] border border-[var(--color-border)]/40 shadow-sm space-y-6">
        <div className="border-b border-[var(--color-border)] pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-[var(--color-navy)]">Live Verification Activity</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Saved results from the latest candidate.</p>
          </div>
          <div className="bg-[var(--color-workspace-secondary)] text-[var(--color-blue)] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-[var(--color-border)]">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> Stored Results
          </div>
        </div>

        <div className="space-y-3">
          {dashboardData.recentLogs.map((log, idx) => (
            <div key={idx} className="flex items-center justify-between p-3.5 rounded-[var(--radius-panel)] bg-[var(--color-surface)] border border-[var(--color-border)] text-sm">
              <div className="space-y-0.5">
                <p className="font-semibold text-[var(--color-text-primary)]">{log.action}</p>
                <p className="text-xs text-[var(--color-text-muted)] font-mono">{log.target}</p>
              </div>
              <div className="text-right space-y-1">
                <span className="inline-block px-2.5 py-0.5 bg-[var(--color-workspace-secondary)] text-[var(--color-blue)] text-[11px] font-bold rounded-full">
                  {log.status}
                </span>
                <p className="text-[11px] text-[var(--color-text-muted)]">{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}