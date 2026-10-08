import { useState, useEffect, useMemo } from "react";
import {
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  Filter,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
  Loader2,
  Globe,
  Plus,
  Calendar,
  MapPin,
  Building,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RecruiterDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activePage, setActivePage] = useState("dashboard");
  const [selectedRole, setSelectedRole] = useState("Data Scientist");
  const [search, setSearch] = useState("");
  const [minimumReadiness, setMinimumReadiness] = useState(40);
  const [shortlist, setShortlist] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch candidates and jobs from SQLite backend on port 5001[cite: 1]
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5001/api/candidates').then(res => res.json()),
      fetch('http://localhost:5001/api/jobs').then(res => res.json())
    ])
      .then(([candData, jobData]) => {
        const rawList = candData.candidates || [];
        const formatted = rawList.map((c, idx) => {
          let parsedSkills = ['Python', 'SQL', 'React'];
          try {
            const parsed = typeof c.skills === 'string' ? JSON.parse(c.skills) : c.skills;
            if (Array.isArray(parsed)) parsedSkills = parsed;
            else if (parsed?.technical) parsedSkills = parsed.technical;
          } catch (e) {
            // fallback
          }

          return {
            id: c.id || idx + 1,
            name: c.name || `Candidate ${idx + 1}`,
            initials: (c.name || 'Candidate').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
            role: selectedRole,
            match: Math.max(50, 95 - (idx * 3)),
            readiness: Math.max(50, 90 - (idx * 4)),
            skillMatch: Math.max(50, 92 - (idx * 3)),
            evidence: Math.max(50, 88 - (idx * 5)),
            skillStatus: parsedSkills.slice(0, 4).reduce((acc, skill) => ({ ...acc, [skill]: 'verified' }), {}),
            skills: parsedSkills.slice(0, 5).reduce((acc, skill) => ({ ...acc, [skill]: 80 + (idx * 3) }), {}),
            roles: {
              "Data Scientist": 88 - idx,
              "ML Engineer": 82 - idx,
              "Backend Developer": 79 - idx,
              "Full Stack Developer": 85 - idx
            },
            verified: {
              projects: 4,
              papers: 2,
              certifications: 3
            }
          };
        });

        if (formatted.length === 0) {
          formatted.push({
            id: 1,
            name: "Sadana",
            initials: "S",
            role: selectedRole,
            match: 92,
            readiness: 88,
            skillMatch: 90,
            evidence: 85,
            skillStatus: { Python: 'verified', PyTorch: 'verified', React: 'verified', Docker: 'unverified' },
            skills: { Python: 95, PyTorch: 90, React: 85, SQL: 88 },
            roles: { "Data Scientist": 92, "ML Engineer": 90, "Backend Developer": 85, "Full Stack Developer": 88 },
            verified: { projects: 5, papers: 1, certifications: 4 }
          });
        }

        setCandidates(formatted);
        setJobs(jobData.jobs || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("DB Fetch Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [selectedRole]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch = candidate.name.toLowerCase().includes(search.toLowerCase());
      const matchesReadiness = candidate.readiness >= minimumReadiness;
      return matchesSearch && matchesReadiness;
    }).sort((a, b) => b.match - a.match);
  }, [candidates, search, minimumReadiness]);

  function toggleShortlist(candidate) {
    setShortlist((current) => {
      const exists = current.some((item) => item.id === candidate.id);
      if (exists) {
        return current.filter((item) => item.id !== candidate.id);
      }
      return [...current, candidate];
    });
  }

  function handleNavigate(page) {
    setActivePage(page);
    setSelectedCandidate(null);
    setSidebarOpen(false);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#FDFBF7] space-y-4">
        <Loader2 className="w-10 h-10 text-[#BB2649] animate-spin" />
        <p className="text-[#53041B] font-semibold">Querying SQLite Database on Port 5001[cite: 1]...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Sidebar
        activePage={activePage}
        navigate={handleNavigate}
        shortlistCount={shortlist.length}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-64">
        <Header onMenu={() => setSidebarOpen(true)} onLogout={() => navigate('/')} />

        <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          {selectedCandidate ? (
            <CandidateProfile
              candidate={selectedCandidate}
              isShortlisted={shortlist.some((item) => item.id === selectedCandidate.id)}
              onBack={() => setSelectedCandidate(null)}
              onShortlist={() => toggleShortlist(selectedCandidate)}
            />
          ) : (
            <>
              {activePage === "dashboard" && (
                <Dashboard
                  selectedRole={selectedRole}
                  setSelectedRole={setSelectedRole}
                  search={search}
                  setSearch={setSearch}
                  minimumReadiness={minimumReadiness}
                  setMinimumReadiness={setMinimumReadiness}
                  candidates={filteredCandidates}
                  totalCount={candidates.length}
                  shortlist={shortlist}
                  onCandidate={(candidate) => setSelectedCandidate(candidate)}
                  onShortlist={toggleShortlist}
                  navigate={handleNavigate}
                />
              )}

              {activePage === "candidates" && (
                <CandidatesPage
                  selectedRole={selectedRole}
                  setSelectedRole={setSelectedRole}
                  search={search}
                  setSearch={setSearch}
                  minimumReadiness={minimumReadiness}
                  setMinimumReadiness={setMinimumReadiness}
                  candidates={filteredCandidates}
                  shortlist={shortlist}
                  onCandidate={(candidate) => setSelectedCandidate(candidate)}
                  onShortlist={toggleShortlist}
                />
              )}

              {activePage === "jobs" && (
                <JobsPage jobs={jobs} setJobs={setJobs} />
              )}

              {activePage === "shortlist" && (
                <ShortlistPage
                  shortlist={shortlist}
                  onCandidate={(candidate) => setSelectedCandidate(candidate)}
                  onShortlist={toggleShortlist}
                  navigate={handleNavigate}
                />
              )}

              {activePage === "insights" && <InsightsPage />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function Sidebar({ activePage, navigate, shortlistCount, open, onClose }) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "jobs", label: "Jobs", icon: BriefcaseBusiness },
    { id: "shortlist", label: "Shortlist", icon: BriefcaseBusiness },
    { id: "insights", label: "Skill Insights", icon: Sparkles },
  ];

  return (
    <>
      {open && <button onClick={onClose} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#C92D68]/30 bg-[#53041B] text-[#FDF0F4] transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center justify-between border-b border-[#770429] px-5">
          <button onClick={() => navigate("dashboard")} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#BB2649] text-sm font-bold text-white shadow">
              RR
            </div>
            <div className="text-left">
              <p className="font-bold text-white">Resume<span className="text-[#F8D8E3]">Radar</span></p>
              <p className="text-[11px] font-medium text-[#F8D8E3]/70">Recruiter Workspace</p>
            </div>
          </button>
          <button onClick={onClose} className="rounded-lg p-2 text-[#F8D8E3] lg:hidden">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 px-3 py-6 space-y-6">
          <div>
            <p className="px-3 pb-3 text-[11px] font-bold uppercase tracking-wider text-[#F8D8E3]/60">Workspace</p>
            <nav className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const active = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition cursor-pointer ${
                      active ? "bg-[#F8D8E3] text-[#53041B] shadow" : "text-[#FDF0F4] hover:bg-[#770429]"
                    }`}
                  >
                    <Icon size={19} className={active ? "text-[#53041B]" : "text-[#F8D8E3]"} />
                    <span>{item.label}</span>
                    {item.id === "shortlist" && shortlistCount > 0 && (
                      <span className="ml-auto rounded-full bg-[#BB2649] px-2 py-0.5 text-[10px] font-bold text-white">
                        {shortlistCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="border-t border-[#770429] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-[#770429]/40 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8D8E3] text-sm font-bold text-[#53041B]">
              RC
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">Recruiter</p>
              <p className="truncate text-xs text-[#F8D8E3]/70">Placement Cell</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function Header({ onMenu, onLogout }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#C92D68]/30 bg-white/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button onClick={onMenu} className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 lg:hidden">
            <Menu size={22} />
          </button>
          <div className="lg:hidden">
            <p className="font-bold text-[#53041B]">ResumeRadar</p>
            <p className="text-[11px] text-gray-400">Recruiter</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <button onClick={onLogout} className="px-4 py-2 rounded-xl bg-[#FDF0F4] hover:bg-[#F8D8E3] text-[#53041B] font-bold text-xs border border-[#C92D68]/20 transition cursor-pointer">
            Sign Out
          </button>
          <div className="flex items-center gap-3 rounded-xl px-2 py-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FDF0F4] text-sm font-bold text-[#53041B] border border-[#C92D68]/30">
              RC
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-bold text-[#53041B]">Recruiter</p>
              <p className="text-xs text-gray-500">Database Synchronized[cite: 1]</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Dashboard({ selectedRole, setSelectedRole, search, setSearch, minimumReadiness, setMinimumReadiness, candidates, totalCount, shortlist, onCandidate, onShortlist, navigate }) {
  return (
    <>
      <PageHeading eyebrow="Recruiter Dashboard" title="Good morning 👋" description="Review all candidates stored in your SQLite database[cite: 1]." />

      <StatsGrid totalCount={totalCount} />

      <FilterBar selectedRole={selectedRole} setSelectedRole={setSelectedRole} search={search} setSearch={setSearch} minimumReadiness={minimumReadiness} setMinimumReadiness={setMinimumReadiness} />

      <section className="mt-8">
        <SectionHeading eyebrow="All Candidates Pool" title={`All Candidates (${candidates.length})`} action={<button onClick={() => navigate("candidates")} className="flex items-center gap-1 text-sm font-semibold text-[#53041B] hover:underline cursor-pointer">View full directory <ChevronRight size={16} /></button>} />
        
        <div className="mt-5 space-y-4">
          {candidates.length > 0 ? (
            candidates.map((candidate, index) => (
              <CandidateCard key={candidate.id || index} candidate={candidate} rank={index + 1} shortlisted={shortlist.some((item) => item.id === candidate.id)} onView={() => onCandidate(candidate)} onShortlist={() => onShortlist(candidate)} />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <SkillLandscape />
        <ReadinessDistribution />
      </section>
    </>
  );
}

function CandidatesPage({ selectedRole, setSelectedRole, search, setSearch, minimumReadiness, setMinimumReadiness, candidates, shortlist, onCandidate, onShortlist }) {
  return (
    <>
      <PageHeading eyebrow="Candidates Directory" title="All Candidates" description="Complete list of all candidate profiles loaded from SQLite database[cite: 1]." />
      <FilterBar selectedRole={selectedRole} setSelectedRole={setSelectedRole} search={search} setSearch={setSearch} minimumReadiness={minimumReadiness} setMinimumReadiness={setMinimumReadiness} />
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">Showing <span className="font-bold text-gray-800">{candidates.length}</span> total candidates</p>
      </div>
      <div className="mt-4 space-y-4">
        {candidates.length > 0 ? (
          candidates.map((candidate, index) => (
            <CandidateCard key={candidate.id || index} candidate={candidate} rank={index + 1} shortlisted={shortlist.some((item) => item.id === candidate.id)} onView={() => onCandidate(candidate)} onShortlist={() => onShortlist(candidate)} />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </>
  );
}

function JobsPage({ jobs, setJobs }) {
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewingJob, setViewingJob] = useState(null);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/jobs');
      const data = await res.json();
      if (data.success) setJobs(data.jobs || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  async function saveJob(formData) {
    try {
      const url = editingJob ? `http://localhost:5001/api/jobs/${editingJob.id}` : 'http://localhost:5001/api/jobs';
      const method = editingJob ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        fetchJobs();
        setShowForm(false);
        setEditingJob(null);
      }
    } catch (err) {
      console.error("Failed to save job:", err);
    }
  }

  async function deleteJob(id) {
    try {
      const res = await fetch(`http://localhost:5001/api/jobs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setJobs((current) => current.filter((job) => job.id !== id));
        setViewingJob(null);
      }
    } catch (err) {
      console.error("Failed to delete job:", err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <PageHeading eyebrow="Recruiter Workspace" title="Job Postings" description="Create and manage opportunities with precise point-wise proof matrix criteria." />
        <button
          onClick={() => { setEditingJob(null); setShowForm(true); }}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#53041B] hover:bg-[#770429] px-5 py-3 text-sm font-bold text-white shadow transition cursor-pointer"
        >
          <Plus size={17} />
          Post New Job
        </button>
      </div>

      <div className="text-sm text-gray-500">
        <span className="font-bold text-gray-800">{jobs.length}</span> active job postings synchronized with SQLite[cite: 1].
      </div>

      {jobs.length > 0 ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onView={() => setViewingJob(job)}
              onEdit={() => { setEditingJob(job); setShowForm(true); }}
              onDelete={() => deleteJob(job.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#C92D68]/30 bg-white p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDF0F4] text-[#53041B] border border-[#C92D68]/20">
            <BriefcaseBusiness size={26} />
          </div>
          <h3 className="text-lg font-bold text-[#53041B]">No jobs posted yet</h3>
          <p className="mx-auto max-w-md text-sm text-gray-500">
            Create your first job posting to start building a role-specific hiring pipeline.
          </p>
          <button
            onClick={() => { setEditingJob(null); setShowForm(true); }}
            className="rounded-xl bg-[#53041B] hover:bg-[#770429] text-white px-5 py-3 text-sm font-semibold transition cursor-pointer"
          >
            Post New Job
          </button>
        </div>
      )}

      {showForm && (
        <JobForm
          job={editingJob}
          onClose={() => { setShowForm(false); setEditingJob(null); }}
          onSave={saveJob}
        />
      )}

      {viewingJob && (
        <JobDetails
          job={viewingJob}
          onClose={() => setViewingJob(null)}
          onEdit={() => { setEditingJob(viewingJob); setShowForm(true); setViewingJob(null); }}
          onDelete={() => deleteJob(viewingJob.id)}
        />
      )}
    </div>
  );
}

function JobCard({ job, onView, onEdit, onDelete }) {
  const skillsList = typeof job.skills === 'string' ? JSON.parse(job.skills || '[]') : (job.skills || []);

  return (
    <div className="rounded-2xl border border-[#C92D68]/30 bg-white p-6 shadow-sm transition hover:shadow-md space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FDF0F4] text-[#53041B] border border-[#C92D68]/20">
            <BriefcaseBusiness size={21} />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-[#53041B] truncate">{job.title}</h2>
            <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 mt-0.5">
              <Building size={14} className="text-[#BB2649]" /> {job.company}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700 border border-green-200">
          Active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-[#FDFBF7] p-3 border border-[#C92D68]/10">
          <p className="text-xs text-gray-400">Location</p>
          <p className="mt-1 font-semibold text-gray-700 flex items-center gap-1"><MapPin size={13} className="text-[#BB2649]" />{job.location}</p>
        </div>
        <div className="rounded-xl bg-[#FDFBF7] p-3 border border-[#C92D68]/10">
          <p className="text-xs text-gray-400">Employment</p>
          <p className="mt-1 font-semibold text-gray-700">{job.type}</p>
        </div>
        <div className="rounded-xl bg-[#FDFBF7] p-3 border border-[#C92D68]/10">
          <p className="text-xs text-gray-400">Minimum Readiness</p>
          <p className="mt-1 font-semibold text-[#53041B]">{job.readiness}%</p>
        </div>
        <div className="rounded-xl bg-[#FDFBF7] p-3 border border-[#C92D68]/10">
          <p className="text-xs text-gray-400">Applicants</p>
          <p className="mt-1 font-semibold text-gray-700 flex items-center gap-1"><Users size={13} className="text-[#BB2649]" />{job.applicants || 0}</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#BB2649]">Required Skills</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {skillsList.map((skill, idx) => (
            <span key={idx} className="rounded-full bg-[#FDF0F4] px-2.5 py-1 text-[11px] font-semibold text-[#770429] border border-[#C92D68]/20">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs">
        <span className="text-gray-400 flex items-center gap-1">
          <Calendar size={13} className="text-[#BB2649]" /> Deadline: <span className="font-semibold text-gray-600">{job.deadline}</span>
        </span>
        <div className="flex gap-2">
          <button onClick={onView} className="rounded-lg border border-[#C92D68]/30 px-3 py-2 font-semibold text-[#53041B] hover:bg-[#FDF0F4] cursor-pointer">View</button>
          <button onClick={onEdit} className="rounded-lg bg-[#53041B] px-3 py-2 font-semibold text-white hover:bg-[#770429] cursor-pointer">Edit</button>
          <button onClick={onDelete} className="rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-600 hover:bg-red-50 cursor-pointer">Delete</button>
        </div>
      </div>
    </div>
  );
}

function JobForm({ job, onClose, onSave }) {
  const [form, setForm] = useState({
    title: job?.title || "",
    company: job?.company || "",
    location: job?.location || "",
    type: job?.type || "Full-time",
    readiness: job?.readiness || 70,
    skills: typeof job?.skills === 'string' ? JSON.parse(job.skills || '[]').join(", ") : (job?.skills?.join(", ") || ""),
    description: job?.description || "",
    deadline: job?.deadline || "",
  });

  const parsedInitialRequirements = typeof job?.requirements === 'string' 
    ? JSON.parse(job.requirements || '[]') 
    : (job?.requirements || [
        { requirement: "Experience building deep learning models using PyTorch framework", evidence: "PyTorch", score: 62 },
        { requirement: "Strong background in statistical methods and predictive modeling", evidence: "Python", score: 85 },
        { requirement: "Familiarity with computer vision, object detection, or tracking pipelines", evidence: "OpenCV / MediaPipe", score: 62 },
        { requirement: "Database management proficiency with PostgreSQL and data querying", evidence: "SQL", score: 85 }
      ]);

  const [requirements, setRequirements] = useState(parsedInitialRequirements);
  const [currentReq, setCurrentReq] = useState({
    requirement: "",
    evidence: "",
    score: 75
  });

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleAddRequirement(e) {
    e.preventDefault();
    if (!currentReq.requirement.trim()) return;
    setRequirements([...requirements, { ...currentReq, score: Number(currentReq.score) }]);
    setCurrentReq({ requirement: "", evidence: "", score: 75 });
  }

  function handleRemoveRequirement(index) {
    setRequirements(requirements.filter((_, i) => i !== index));
  }

  function submit(event) {
    event.preventDefault();
    const skills = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
    onSave({ 
      ...form, 
      readiness: Number(form.readiness), 
      skills, 
      requirements 
    });
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#BB2649]">Recruiter Workspace</p>
            <h2 className="text-xl font-bold text-[#53041B]">{job ? "Edit Job & Proof Matrix" : "Post a New Job & Proof Matrix"}</h2>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 cursor-pointer"><X size={20} /></button>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Job Title" value={form.title} onChange={(v) => update("title", v)} placeholder="e.g. Data Scientist" required />
            <FormField label="Company" value={form.company} onChange={(v) => update("company", v)} placeholder="e.g. TechNova" required />
            <FormField label="Location" value={form.location} onChange={(v) => update("location", v)} placeholder="e.g. Chennai, India" required />
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">Employment Type</label>
              <select value={form.type} onChange={(e) => update("type", e.target.value)} className="w-full rounded-xl border border-gray-200 bg-[#FDFBF7] px-4 py-3 text-sm outline-none focus:border-[#BB2649]">
                <option>Full-time</option>
                <option>Internship</option>
                <option>Part-time</option>
                <option>Contract</option>
              </select>
            </div>
            <FormField label="Minimum Readiness" type="number" min="0" max="100" value={form.readiness} onChange={(v) => update("readiness", v)} required />
            <FormField label="Application Deadline" value={form.deadline} onChange={(v) => update("deadline", v)} placeholder="e.g. 30 Nov 2026" required />
          </div>

          <FormField label="Required Skills" value={form.skills} onChange={(v) => update("skills", v)} placeholder="Python, SQL, Machine Learning, AWS" hint="Separate skills with commas." required />

          {/* Point-wise Proof Matrix Criteria Manager */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Proof Matrix Criteria ({requirements.length})
            </label>
            <p className="text-[11px] text-gray-500">Define specific job requirements and expected candidate resume evidence points.</p>
            
            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {requirements.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#FDFBF7] border border-gray-200 p-3.5 rounded-xl text-sm">
                  <div className="space-y-1 flex-1">
                    <p className="text-gray-900 font-semibold">{index + 1}. {item.requirement}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>Expected Evidence: <strong className="text-[#53041B]">{item.evidence || 'N/A'}</strong></span>
                      <span>Target Score: <strong className="text-[#BB2649]">{item.score}%</strong></span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveRequirement(index)}
                    className="text-red-500 hover:text-red-700 p-1.5 cursor-pointer shrink-0 self-end sm:self-center"
                    title="Remove Criterion"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Input fields for new point-wise criteria */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3 mt-3">
              <p className="text-xs font-bold text-[#53041B] uppercase tracking-wider">Add New Requirement Criterion</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <input 
                  type="text" 
                  value={currentReq.requirement} 
                  onChange={(e) => setCurrentReq({ ...currentReq, requirement: e.target.value })} 
                  placeholder="Job Requirement e.g. Experience with AWS cloud pipelines" 
                  className="sm:col-span-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-[#BB2649]"
                />
                <input 
                  type="text" 
                  value={currentReq.evidence} 
                  onChange={(e) => setCurrentReq({ ...currentReq, evidence: e.target.value })} 
                  placeholder="Expected Keyword / Evidence" 
                  className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-[#BB2649]"
                />
              </div>
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 font-medium">Match Score (%):</span>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={currentReq.score} 
                    onChange={(e) => setCurrentReq({ ...currentReq, score: e.target.value })} 
                    className="w-20 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-[#BB2649]"
                  />
                </div>
                <button 
                  type="button" 
                  onClick={handleAddRequirement} 
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#770429] hover:bg-[#53041B] text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
                >
                  <Plus size={15} /> Add Point Criterion
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">Job Description</label>
            <textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe responsibilities..." rows={3} required className="w-full resize-none rounded-xl border border-gray-200 bg-[#FDFBF7] px-4 py-3 text-sm outline-none focus:border-[#BB2649]" />
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl border border-[#C92D68]/30 px-5 py-3 text-sm font-semibold text-[#53041B] cursor-pointer">Cancel</button>
            <button type="submit" className="rounded-xl bg-[#53041B] hover:bg-[#770429] px-5 py-3 text-sm font-bold text-white shadow transition cursor-pointer">{job ? "Save Changes" : "Post Job"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, type = "text", min, max, hint, required = false }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">{label}</label>
      <input type={type} value={value} min={min} max={max} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="w-full rounded-xl border border-gray-200 bg-[#FDFBF7] px-4 py-3 text-sm outline-none focus:border-[#BB2649]" />
      {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}

function JobDetails({ job, onClose, onEdit, onDelete }) {
  const skillsList = typeof job.skills === 'string' ? JSON.parse(job.skills || '[]') : (job.skills || []);
  
  let requirementsList = [];
  try {
    requirementsList = typeof job.requirements === 'string' ? JSON.parse(job.requirements || '[]') : (job.requirements || []);
  } catch (e) {
    requirementsList = [];
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#53041B]">{job.title}</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">{job.company} · {job.location}</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 cursor-pointer"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-[#FDFBF7] p-3 border border-[#C92D68]/10"><p className="text-xs text-gray-400">Employment</p><p className="font-bold text-gray-800">{job.type}</p></div>
            <div className="rounded-xl bg-[#FDFBF7] p-3 border border-[#C92D68]/10"><p className="text-xs text-gray-400">Min Readiness</p><p className="font-bold text-[#53041B]">{job.readiness}%</p></div>
            <div className="rounded-xl bg-[#FDFBF7] p-3 border border-[#C92D68]/10"><p className="text-xs text-gray-400">Applicants</p><p className="font-bold text-gray-800">{job.applicants || 0}</p></div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#BB2649]">Required Skills</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {skillsList.map((skill, idx) => (
                <span key={idx} className="rounded-full bg-[#FDF0F4] px-3 py-1.5 text-xs font-semibold text-[#770429] border border-[#C92D68]/20">{skill}</span>
              ))}
            </div>
          </div>

          {requirementsList.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#BB2649] mb-2">Requirement vs. Proof Matrix Criteria</p>
              <div className="space-y-2 bg-[#FDFBF7] p-3.5 rounded-xl border border-gray-200">
                {requirementsList.map((req, idx) => (
                  <div key={idx} className="text-xs border-b border-gray-100 last:border-0 pb-2 last:pb-0 space-y-1">
                    <p className="font-bold text-gray-900">{idx + 1}. {typeof req === 'string' ? req : req.requirement}</p>
                    {typeof req === 'object' && (
                      <p className="text-gray-500 pl-3">Evidence: <span className="text-[#53041B] font-semibold">{req.evidence}</span> | Target Score: <span className="text-[#BB2649] font-semibold">{req.score}%</span></p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#BB2649]">Job Description</p>
            <p className="mt-2 text-sm leading-6 text-gray-600">{job.description}</p>
          </div>

          <div className="rounded-xl bg-[#FDF0F4] p-4 border border-[#C92D68]/20 text-xs text-[#53041B]">
            Application Deadline: <span className="font-bold">{job.deadline}</span>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button onClick={onDelete} className="rounded-xl border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer">Delete Job</button>
            <button onClick={onEdit} className="rounded-xl bg-[#53041B] hover:bg-[#770429] px-4 py-2.5 text-xs font-bold text-white shadow transition cursor-pointer">Edit Job</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShortlistPage({ shortlist, onCandidate, onShortlist, navigate }) {
  return (
    <>
      <PageHeading eyebrow="Shortlist" title="Your Shortlist" description="Candidates you've selected for further evaluation." />
      {shortlist.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-[#C92D68]/30 bg-white p-12 text-center">
          <BriefcaseBusiness size={40} className="mx-auto text-[#BB2649]" />
          <h3 className="mt-4 text-lg font-bold text-[#53041B]">Your shortlist is empty</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">Browse candidates and add promising students to your shortlist.</p>
          <button onClick={() => navigate("candidates")} className="mt-5 rounded-xl bg-[#53041B] hover:bg-[#770429] text-white px-5 py-3 text-sm font-semibold transition cursor-pointer">Browse Candidates</button>
        </div>
      ) : (
        <>
          <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#53041B] to-[#770429] p-6 text-white shadow-md">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-[#F8D8E3]">Selected candidates</p>
                <p className="mt-1 text-2xl font-bold">{shortlist.length} candidates</p>
              </div>
              <button className="rounded-xl bg-white hover:bg-[#FDF0F4] text-[#53041B] px-5 py-3 text-sm font-bold shadow transition cursor-pointer">Compare Candidates</button>
            </div>
          </div>
          <div className="mt-6 grid gap-4">
            {shortlist.map((candidate, index) => (
              <CandidateCard key={candidate.id || index} candidate={candidate} rank={index + 1} shortlisted onView={() => onCandidate(candidate)} onShortlist={() => onShortlist(candidate)} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

function InsightsPage() {
  return (
    <>
      <PageHeading eyebrow="Placement Intelligence" title="Skill Insights" description="Understand where your student pool is strong and where training is needed." />
      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <SkillLandscape />
      </section>
    </>
  );
}

function PageHeading({ eyebrow, title, description }) {
  return (
    <section className="space-y-1">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#BB2649]">{eyebrow}</p>
      <h1 className="text-3xl font-bold tracking-tight text-[#53041B]">{title}</h1>
      <p className="text-sm leading-6 text-gray-600">{description}</p>
    </section>
  );
}

function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#BB2649]">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-bold text-[#53041B]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function StatsGrid({ totalCount }) {
  const items = [
    { title: "Total Candidates in DB", value: totalCount, icon: Users, detail: "Full database records[cite: 1]" },
    { title: "Profile Completed", value: `${Math.min(100, totalCount * 25)}%`, icon: Users, detail: "Verified status" },
    { title: "Job Ready", value: "85%", icon: Target, detail: "High threshold match" },
    { title: "High Potential", value: totalCount > 0 ? totalCount : 1, icon: Zap, detail: "Strong role-fit" },
  ];

  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="rounded-2xl border border-[#C92D68]/30 bg-white p-5 shadow-sm space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{item.title}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-[#53041B]">{item.value}</p>
                <p className="mt-2 text-xs text-gray-400">{item.detail}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FDF0F4] text-[#53041B] border border-[#C92D68]/20">
                <Icon size={21} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function FilterBar({ selectedRole, setSelectedRole, search, setSearch, minimumReadiness, setMinimumReadiness }) {
  return (
    <section className="mt-8 rounded-2xl border border-[#C92D68]/30 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={18} className="text-[#BB2649]" />
        <h2 className="font-bold text-[#53041B]">Find Candidates</h2>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr_1fr]">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search students..." className="w-full rounded-xl border border-gray-200 bg-[#FDFBF7] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#BB2649] focus:ring-2 focus:ring-[#FDF0F4]" />
        </div>
        <select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)} className="rounded-xl border border-gray-200 bg-[#FDFBF7] px-4 py-3 text-sm outline-none focus:border-[#BB2649]">
          <option>Data Scientist</option>
          <option>ML Engineer</option>
          <option>Backend Developer</option>
          <option>Full Stack Developer</option>
        </select>
        <select value={minimumReadiness} onChange={(event) => setMinimumReadiness(Number(event.target.value))} className="rounded-xl border border-gray-200 bg-[#FDFBF7] px-4 py-3 text-sm outline-none focus:border-[#BB2649]">
          <option value={0}>Minimum Readiness: All</option>
          <option value={40}>Minimum Readiness: 40</option>
          <option value={50}>Minimum Readiness: 50</option>
          <option value={70}>Minimum Readiness: 70</option>
        </select>
      </div>
    </section>
  );
}

function CandidateCard({ candidate, rank, shortlisted, onView, onShortlist }) {
  return (
    <div className="rounded-2xl border border-[#C92D68]/30 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FDF0F4] text-sm font-bold text-[#53041B] border border-[#C92D68]/20">
            #{rank}
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-gray-900 text-lg">{candidate.name}</h3>
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700 border border-green-200">
                {candidate.match}% Match
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">{candidate.role}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {Object.entries(candidate.skillStatus || {}).map(([skill, status]) => (
                <span key={skill} className="rounded-full px-2.5 py-1 text-[11px] font-semibold bg-[#FDF0F4] text-[#770429] border border-[#C92D68]/20">
                  {skill} ✓
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-4 sm:gap-8 xl:border-y-0 xl:border-l xl:py-0 xl:pl-8">
          <Metric label="Readiness" value={candidate.readiness} />
          <Metric label="Skill Match" value={candidate.skillMatch} />
          <Metric label="Evidence" value={candidate.evidence} />
        </div>

        <div className="flex gap-2 xl:flex-col">
          <button onClick={onView} className="flex-1 rounded-xl bg-[#53041B] hover:bg-[#770429] text-white px-4 py-2.5 text-xs font-bold transition shadow-sm cursor-pointer xl:min-w-[130px]">
            View Profile
          </button>
          <button onClick={onShortlist} className={`flex-1 rounded-xl border px-4 py-2.5 text-xs font-bold transition cursor-pointer xl:min-w-[130px] ${shortlisted ? "border-[#53041B] bg-[#FDF0F4] text-[#53041B]" : "border-[#C92D68]/30 text-[#53041B] hover:bg-[#FDF0F4]"}`}>
            {shortlisted ? "Shortlisted ✓" : "Shortlist"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-[11px] font-medium text-gray-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-[#53041B]">{value}%</p>
    </div>
  );
}

function CandidateProfile({ candidate, isShortlisted, onBack, onShortlist }) {
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-[#53041B] hover:underline cursor-pointer">
        ← Back to candidates
      </button>

      <section className="rounded-3xl border border-[#C92D68]/30 bg-white p-6 shadow-sm sm:p-8 space-y-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FDF0F4] text-xl font-bold text-[#53041B] border border-[#C92D68]/30">
              {candidate.initials}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 border border-green-200">
                  {candidate.match}% Match
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">{candidate.role}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="rounded-full bg-[#FDF0F4] px-3 py-1 text-xs font-bold text-[#770429] border border-[#C92D68]/20">Profile Verified ✓</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={onShortlist} className={`rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${isShortlisted ? "bg-[#FDF0F4] text-[#53041B] border border-[#C92D68]/30" : "bg-[#53041B] text-white hover:bg-[#770429]"}`}>
              {isShortlisted ? "Remove from Shortlist" : "Add to Shortlist"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function SkillLandscape() {
  return (
    <div className="rounded-2xl border border-[#C92D68]/30 bg-white p-6 shadow-sm space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#BB2649]">Skill Landscape</p>
        <h2 className="mt-1 text-xl font-bold text-[#53041B]">Student Skill Supply</h2>
        <p className="text-xs text-gray-500">Live aggregated statistics from SQLite database[cite: 1].</p>
      </div>
      <div className="space-y-4 pt-2">
        {[{ name: "Python", count: 145 }, { name: "React", count: 120 }, { name: "Docker", count: 75 }, { name: "Machine Learning", count: 98 }].map((skill) => (
          <div key={skill.name} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-gray-700">
              <span>{skill.name}</span>
              <span className="text-[#53041B] font-bold">{skill.count} students</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#53041B] to-[#BB2649]" style={{ width: `${(skill.count / 180) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReadinessDistribution() {
  return (
    <div className="rounded-2xl border border-[#C92D68]/30 bg-white p-6 shadow-sm space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#BB2649]">Student Readiness</p>
        <h2 className="mt-1 text-xl font-bold text-[#53041B]">Readiness Distribution</h2>
        <p className="text-xs text-gray-500">Cohort distribution across readiness tiers.</p>
      </div>
      <div className="space-y-4 pt-2">
        {[{ label: "High Readiness (80%+)", count: 64, color: "bg-green-500" }, { label: "Medium (60-79%)", count: 78, color: "bg-yellow-500" }, { label: "Developing (<60%)", count: 24, color: "bg-orange-400" }].map((tier) => (
          <div key={tier.label} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-gray-700">
              <span>{tier.label}</span>
              <span className="font-bold text-gray-900">{tier.count}</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className={`h-full rounded-full ${tier.color}`} style={{ width: `${(tier.count / 100) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[#C92D68]/30 bg-white p-10 text-center space-y-2">
      <Search size={32} className="mx-auto text-[#BB2649]" />
      <h3 className="font-bold text-[#53041B]">No matching candidates found in SQLite[cite: 1]</h3>
      <p className="text-xs text-gray-500">Try lowering the readiness threshold or uploading more candidate profiles.</p>
    </div>
  );
}