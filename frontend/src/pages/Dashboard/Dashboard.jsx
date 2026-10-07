import { useState, useEffect } from 'react';
import { ShieldAlert, Target, User, TrendingUp, CheckCircle2, Award, Loader2, Code2, FileText, Share2, Activity } from 'lucide-react';

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
        const defaultRole = roleJson.roles?.['Data Scientist'];
        if (!defaultRole) throw new Error('Role analysis is unavailable.');
        const verified = evidence.filter(item => item.status === 'Verified');
        const githubCount = verified.filter(item => !item.skill.includes('LinkedIn')).length;
        const linkedinCount = verified.filter(item => item.skill.includes('LinkedIn')).length;
        const total = verified.length;
        setDashboardData({
          name: candidate.name || 'Unnamed candidate',
          title: candidate.experience?.[0]?.role || 'Candidate profile',
          skills: candidate.skills?.technical || [],
          readinessScore: defaultRole.match,
          verifiedEvidenceCount: total,
          majorGapsCount: gapsJson.gaps.length,
          targetRoleMatch: defaultRole.match,
          warning: roleJson.warning,
          platformBreakdown: [
            { name: 'GitHub Repository Matches', count: githubCount, percentage: total ? Math.round(githubCount / total * 100) : 0, icon: Code2, color: 'bg-purple-600' },
            { name: 'Google Colab Notebooks', count: 0, percentage: 0, icon: FileText, color: 'bg-amber-600' },
            { name: 'LinkedIn & Certifications', count: linkedinCount, percentage: total ? Math.round(linkedinCount / total * 100) : 0, icon: Share2, color: 'bg-blue-600' }
          ],
          recentLogs: evidence.map(item => ({
            action: 'Stored verification result', target: item.skill,
            time: candidate.created_at + ' UTC', status: item.status,
          })),
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return <div role="alert" className="bg-red-50 p-6 rounded-xl border border-red-200 text-center">{error}</div>;
  }

  if (loading || !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-10 h-10 text-[#BB2649] animate-spin" />
        <p className="text-[#770429] font-medium animate-pulse">Syncing Database Telemetry & Dashboard Widgets...</p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Verified Evidence',
      value: dashboardData.verifiedEvidenceCount,
      subtitle: 'Claims backed by online links',
      icon: CheckCircle2,
      color: 'text-[#770429]',
      bg: 'bg-[#F8D8E3]/40',
      border: 'border-[#C92D68]/50'
    },
    {
      title: 'Major Gaps',
      value: dashboardData.majorGapsCount,
      subtitle: 'Unsupported resume claims',
      icon: ShieldAlert,
      color: 'text-red-600/80',
      bg: 'bg-red-50',
      border: 'border-red-100'
    },
    {
      title: 'Role Match',
      value: `${dashboardData.targetRoleMatch}%`,
      subtitle: 'Target: Data Scientist / Full Stack',
      icon: Target,
      color: 'text-[#53041B]',
      bg: 'bg-[#FDF0F4]',
      border: 'border-[#BB2649]/30'
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#53041B]">Overview</h1>
        <p className="text-[#770429] mt-1">Your extracted profile and live database readiness analysis.</p>
      </div>

      {dashboardData.warning && <p role="status" className="text-[#770429]">{dashboardData.warning}</p>}
      {/* Top Section: Profile Card & Score Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Profile Summary */}
        <div className="bg-white p-6 rounded-2xl border border-[#C92D68]/40 shadow-sm col-span-1 lg:col-span-2 flex flex-col sm:flex-row gap-6 items-center sm:items-start transition-all hover:shadow-md">
          <div className="w-24 h-24 bg-[#F8D8E3]/50 rounded-full flex items-center justify-center shrink-0 border-4 border-[#FDF0F4]">
            <User className="w-10 h-10 text-[#770429]" />
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-1 justify-center sm:justify-start">
              <h2 className="text-2xl font-bold text-[#53041B]">{dashboardData.name}</h2>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1 w-fit mx-auto sm:mx-0">
                <Award className="w-3 h-3" /> Stored in SQLite
              </span>
            </div>
            <p className="text-[#770429] font-medium mb-4">{dashboardData.title}</p>
            
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#BB2649] uppercase tracking-wider">Extracted Skills</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {dashboardData.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-[#FDF0F4]/60 text-[#53041B] text-sm font-semibold rounded-lg border border-[#C92D68]/30">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Readiness Score (Circular Progress) */}
        <div className="bg-gradient-to-br from-[#53041B] to-[#770429] p-6 rounded-2xl shadow-md text-center flex flex-col justify-center items-center text-[#FDF0F4] relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <h3 className="text-lg font-bold mb-4 tracking-wide text-white">Overall Readiness</h3>
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path 
                className="text-white/20" 
                strokeWidth="3.5" 
                stroke="currentColor" 
                fill="none" 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              />
              <path 
                className="text-[#F8D8E3]" 
                strokeDasharray={`${dashboardData.readinessScore}, 100`} 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                stroke="currentColor" 
                fill="none" 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-4xl font-extrabold text-white">{dashboardData.readinessScore}<span className="text-xl text-[#F8D8E3]">%</span></span>
            </div>
          </div>
          
          <p className="text-sm mt-4 font-medium text-[#F8D8E3] flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full">
            <TrendingUp className="w-4 h-4" /> Estimated role compatibility
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm flex flex-col hover:-translate-y-1 transition-transform duration-300`}>
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <h4 className="text-[#770429] font-medium mb-1">{stat.title}</h4>
            <div className="text-3xl font-bold text-[#53041B] mb-2">{stat.value}</div>
            <p className="text-sm text-gray-500">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* NEW COMPONENT 1: Multi-Platform Evidence Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#C92D68]/40 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold text-[#53041B]">Evidence Source Breakdown</h3>
            <p className="text-sm text-gray-500">Distribution of verified claims across connected platforms.</p>
          </div>

          <div className="space-y-4">
            {dashboardData.platformBreakdown.map((platform, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-gray-800 flex items-center gap-2">
                    <platform.icon className="w-4 h-4 text-[#770429]" /> {platform.name}
                  </span>
                  <span className="font-bold text-[#53041B]">{platform.count} Claims ({platform.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div className={`h-full ${platform.color} rounded-full transition-all duration-1000`} style={{ width: `${platform.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NEW COMPONENT 2: Recent Live Verification Feed */}
        <div className="bg-white p-6 rounded-2xl border border-[#C92D68]/40 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#53041B]">Live Verification Activity</h3>
              <p className="text-sm text-gray-500">Saved results from the latest candidate.</p>
            </div>
            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-green-200">
              <Activity className="w-3.5 h-3.5 animate-pulse" /> Stored Results
            </div>
          </div>

          <div className="space-y-3">
            {dashboardData.recentLogs.map((log, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-sm">
                <div className="space-y-0.5">
                  <p className="font-semibold text-gray-900">{log.action}</p>
                  <p className="text-xs text-gray-500 font-mono">{log.target}</p>
                </div>
                <div className="text-right space-y-1">
                  <span className="inline-block px-2.5 py-0.5 bg-green-100 text-green-700 text-[11px] font-bold rounded-full">
                    {log.status}
                  </span>
                  <p className="text-[11px] text-gray-400">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
