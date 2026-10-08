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
  Building
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

  // Fetch candidates and jobs from SQLite backend on port 5001
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
      <div className="rr-page rr-content flex flex-col items-center justify-center h-screen bg-[var(--color-workspace)] space-y-4">
        <Loader2 className="w-10 h-10 text-[var(--color-blue)] animate-spin" />
        <p className="text-[var(--color-navy)] font-semibold">Querying SQLite Database on Port 5001...</p>
      </div>
    );
  }

  return (
    <div className="rr-page rr-content min-h-screen bg-[var(--color-workspace)]">
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

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--color-border)]/30 bg-[var(--color-navy)] text-[var(--color-surface)] transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center justify-between border-b border-[var(--color-border)] px-5">
          <button onClick={() => navigate("dashboard")} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-panel)] bg-[var(--color-cyan)] text-sm font-bold text-[var(--color-surface)] shadow">
              RR
            </div>
            <div className="text-left">
              <p className="font-bold text-[var(--color-surface)]">Resume<span className="text-[var(--color-surface)]">Radar</span></p>
              <p className="text-[11px] font-medium text-[var(--color-surface)]/70">Recruiter Workspace</p>
            </div>
          </button>
          <button onClick={onClose} className="rounded-lg p-2 text-[var(--color-surface)] lg:hidden">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 px-3 py-6 space-y-6">
          <div>
            <p className="px-3 pb-3 text-[11px] font-bold tracking-wide text-[var(--color-surface)]/60">Workspace</p>
            <nav className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const active = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`flex w-full items-center gap-3 rounded-[var(--radius-control)] px-3 py-3 text-sm font-semibold transition cursor-pointer ${
                      active ? "bg-[var(--color-workspace-secondary)] text-[var(--color-navy)] shadow" : "text-[var(--color-surface)] hover:bg-[var(--color-gold)]"
                    }`}
                  >
                    <Icon size={19} className={active ? "text-[var(--color-navy)]" : "text-[var(--color-surface)]"} />
                    <span>{item.label}</span>
                    {item.id === "shortlist" && shortlistCount > 0 && (
                      <span className="ml-auto rounded-full bg-[var(--color-cyan)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-surface)]">
                        {shortlistCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] p-4">
          <div className="flex items-center gap-3 rounded-[var(--radius-panel)] bg-[var(--color-navy-secondary)]/40 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-workspace-secondary)] text-sm font-bold text-[var(--color-navy)]">
              RC
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[var(--color-surface)]">Recruiter</p>
              <p className="truncate text-xs text-[var(--color-surface)]/70">Placement Cell</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function Header({ onMenu, onLogout }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)]/30 bg-[var(--color-surface)]/95 ">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button onClick={onMenu} className="rounded-[var(--radius-control)] p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] lg:hidden">
            <Menu size={22} />
          </button>
          <div className="lg:hidden">
            <p className="font-bold text-[var(--color-navy)]">ResumeRadar</p>
            <p className="text-[11px] text-[var(--color-text-muted)]">Recruiter</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <button onClick={onLogout} className="px-4 py-2 rounded-[var(--radius-control)] bg-[var(--color-workspace-secondary)] hover:bg-[var(--color-workspace-secondary)] text-[var(--color-navy)] font-bold text-xs border border-[var(--color-border)]/20 transition cursor-pointer">
            Sign Out
          </button>
          <div className="flex items-center gap-3 rounded-[var(--radius-panel)] px-2 py-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-workspace-secondary)] text-sm font-bold text-[var(--color-navy)] border border-[var(--color-border)]/30">
              RC
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-bold text-[var(--color-navy)]">Recruiter</p>
              <p className="text-xs text-[var(--color-text-muted)]">Database Synchronized</p>
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
      <PageHeading eyebrow="Recruiter Dashboard" title="Good morning 👋" description="Review all candidates stored in your SQLite database." />

      <StatsGrid totalCount={totalCount} />

      <FilterBar selectedRole={selectedRole} setSelectedRole={setSelectedRole} search={search} setSearch={setSearch} minimumReadiness={minimumReadiness} setMinimumReadiness={setMinimumReadiness} />

      <section className="mt-8">
        <SectionHeading eyebrow="All Candidates Pool" title={`All Candidates (${candidates.length})`} action={<button onClick={() => navigate("candidates")} className="flex items-center gap-1 text-sm font-semibold text-[var(--color-navy)] hover:underline cursor-pointer">View full directory <ChevronRight size={16} /></button>} />
        
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
      <PageHeading eyebrow="Candidates Directory" title="All Candidates" description="Complete list of all candidate profiles loaded from SQLite database." />
      <FilterBar selectedRole={selectedRole} setSelectedRole={setSelectedRole} search={search} setSearch={setSearch} minimumReadiness={minimumReadiness} setMinimumReadiness={setMinimumReadiness} />
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-muted)]">Showing <span className="font-bold text-[var(--color-text-primary)]">{candidates.length}</span> total candidates</p>
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
        <PageHeading eyebrow="Recruiter Workspace" title="Job Postings" description="Create and manage opportunities for students in your placement pipeline." />
        <button
          onClick={() => { setEditingJob(null); setShowForm(true); }}
          className="flex items-center justify-center gap-2 rounded-[var(--radius-control)] bg-[var(--color-orange)] hover:bg-[var(--color-gold)] px-5 py-3 text-sm font-bold text-[var(--color-navy)] shadow transition cursor-pointer"
        >
          <Plus size={17} />
          Post New Job
        </button>
      </div>

      <div className="text-sm text-[var(--color-text-muted)]">
        <span className="font-bold text-[var(--color-text-primary)]">{jobs.length}</span> active job postings synchronized with SQLite.
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
        <div className="rounded-[var(--radius-panel)] border border-dashed border-[var(--color-border)]/30 bg-[var(--color-surface)] p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[var(--radius-panel)] bg-[var(--color-workspace-secondary)] text-[var(--color-navy)] border border-[var(--color-border)]/20">
            <BriefcaseBusiness size={26} />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-navy)]">No jobs posted yet</h3>
          <p className="mx-auto max-w-md text-sm text-[var(--color-text-muted)]">
            Create your first job posting to start building a role-specific hiring pipeline.
          </p>
          <button
            onClick={() => { setEditingJob(null); setShowForm(true); }}
            className="rounded-[var(--radius-control)] bg-[var(--color-orange)] hover:bg-[var(--color-gold)] text-[var(--color-navy)] px-5 py-3 text-sm font-semibold transition cursor-pointer"
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
    <div className="rounded-[var(--radius-panel)] border border-[var(--color-border)]/30 bg-[var(--color-surface)] p-6 shadow-sm transition hover:shadow-[var(--shadow-panel)] space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-panel)] bg-[var(--color-workspace-secondary)] text-[var(--color-navy)] border border-[var(--color-border)]/20">
            <BriefcaseBusiness size={21} />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-[var(--color-navy)] truncate">{job.title}</h2>
            <p className="text-sm font-medium text-[var(--color-text-muted)] flex items-center gap-1.5 mt-0.5">
              <Building size={14} className="text-[var(--color-blue)]" /> {job.company}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[var(--color-workspace-secondary)] px-2.5 py-1 text-[11px] font-bold text-[var(--color-blue)] border border-[var(--color-border)]">
          Active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-[var(--radius-panel)] bg-[var(--color-workspace)] p-3 border border-[var(--color-border)]/10">
          <p className="text-xs text-[var(--color-text-muted)]">Location</p>
          <p className="mt-1 font-semibold text-[var(--color-text-secondary)] flex items-center gap-1"><MapPin size={13} className="text-[var(--color-blue)]" />{job.location}</p>
        </div>
        <div className="rounded-[var(--radius-panel)] bg-[var(--color-workspace)] p-3 border border-[var(--color-border)]/10">
          <p className="text-xs text-[var(--color-text-muted)]">Employment</p>
          <p className="mt-1 font-semibold text-[var(--color-text-secondary)]">{job.type}</p>
        </div>
        <div className="rounded-[var(--radius-panel)] bg-[var(--color-workspace)] p-3 border border-[var(--color-border)]/10">
          <p className="text-xs text-[var(--color-text-muted)]">Minimum Readiness</p>
          <p className="mt-1 font-semibold text-[var(--color-navy)]">{job.readiness}%</p>
        </div>
        <div className="rounded-[var(--radius-panel)] bg-[var(--color-workspace)] p-3 border border-[var(--color-border)]/10">
          <p className="text-xs text-[var(--color-text-muted)]">Applicants</p>
          <p className="mt-1 font-semibold text-[var(--color-text-secondary)] flex items-center gap-1"><Users size={13} className="text-[var(--color-blue)]" />{job.applicants || 0}</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-blue)]">Required Skills</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {skillsList.map((skill, idx) => (
            <span key={idx} className="rounded-full bg-[var(--color-workspace-secondary)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-text-secondary)] border border-[var(--color-border)]/20">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4 text-xs">
        <span className="text-[var(--color-text-muted)] flex items-center gap-1">
          <Calendar size={13} className="text-[var(--color-blue)]" /> Deadline: <span className="font-semibold text-[var(--color-text-secondary)]">{job.deadline}</span>
        </span>
        <div className="flex gap-2">
          <button onClick={onView} className="rounded-lg border border-[var(--color-border)]/30 px-3 py-2 font-semibold text-[var(--color-navy)] hover:bg-[var(--color-workspace-secondary)] cursor-pointer">View</button>
          <button onClick={onEdit} className="rounded-lg bg-[var(--color-orange)] px-3 py-2 font-semibold text-[var(--color-navy)] hover:bg-[var(--color-gold)] cursor-pointer">Edit</button>
          <button onClick={onDelete} className="rounded-lg border border-[var(--color-error)] px-3 py-2 font-semibold text-[var(--color-error-ink)] hover:bg-[var(--color-error-soft)] cursor-pointer">Delete</button>
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

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    const skills = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
    onSave({ ...form, readiness: Number(form.readiness), skills });
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[var(--radius-panel)] bg-[var(--color-surface)] shadow-[var(--shadow-panel)] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-blue)]">Recruiter Workspace</p>
            <h2 className="text-xl font-bold text-[var(--color-navy)]">{job ? "Edit Job" : "Post a New Job"}</h2>
          </div>
          <button onClick={onClose} className="rounded-[var(--radius-control)] p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] cursor-pointer"><X size={20} /></button>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Job Title" value={form.title} onChange={(v) => update("title", v)} placeholder="e.g. Data Scientist" required />
            <FormField label="Company" value={form.company} onChange={(v) => update("company", v)} placeholder="e.g. TechNova" required />
            <FormField label="Location" value={form.location} onChange={(v) => update("location", v)} placeholder="e.g. Chennai, India" required />
            <div>
              <label className="mb-2 block text-xs font-bold tracking-wide text-[var(--color-text-secondary)]">Employment Type</label>
              <select value={form.type} onChange={(e) => update("type", e.target.value)} className="w-full rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-workspace)] px-4 py-3 text-sm outline-none focus:border-[var(--color-focus)]">
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

          <div>
            <label className="mb-2 block text-xs font-bold tracking-wide text-[var(--color-text-secondary)]">Job Description</label>
            <textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe responsibilities..." rows={4} required className="w-full resize-none rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-workspace)] px-4 py-3 text-sm outline-none focus:border-[var(--color-focus)]" />
          </div>

          <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-4">
            <button type="button" onClick={onClose} className="rounded-[var(--radius-control)] border border-[var(--color-border)]/30 px-5 py-3 text-sm font-semibold text-[var(--color-navy)] cursor-pointer">Cancel</button>
            <button type="submit" className="rounded-[var(--radius-control)] bg-[var(--color-orange)] hover:bg-[var(--color-gold)] px-5 py-3 text-sm font-bold text-[var(--color-navy)] shadow transition cursor-pointer">{job ? "Save Changes" : "Post Job"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, type = "text", min, max, hint, required = false }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold tracking-wide text-[var(--color-text-secondary)]">{label}</label>
      <input type={type} value={value} min={min} max={max} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="w-full rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-workspace)] px-4 py-3 text-sm outline-none focus:border-[var(--color-focus)]" />
      {hint && <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">{hint}</p>}
    </div>
  );
}

function JobDetails({ job, onClose, onEdit, onDelete }) {
  const skillsList = typeof job.skills === 'string' ? JSON.parse(job.skills || '[]') : (job.skills || []);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[var(--radius-panel)] bg-[var(--color-surface)] shadow-[var(--shadow-panel)] p-6 sm:p-8 space-y-6">
        <div className="flex items-start justify-between border-b border-[var(--color-border)] pb-4">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-navy)]">{job.title}</h2>
            <p className="text-sm font-medium text-[var(--color-text-muted)] mt-1">{job.company} · {job.location}</p>
          </div>
          <button onClick={onClose} className="rounded-[var(--radius-control)] p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] cursor-pointer"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[var(--radius-panel)] bg-[var(--color-workspace)] p-3 border border-[var(--color-border)]/10"><p className="text-xs text-[var(--color-text-muted)]">Employment</p><p className="font-bold text-[var(--color-text-primary)]">{job.type}</p></div>
            <div className="rounded-[var(--radius-panel)] bg-[var(--color-workspace)] p-3 border border-[var(--color-border)]/10"><p className="text-xs text-[var(--color-text-muted)]">Min Readiness</p><p className="font-bold text-[var(--color-navy)]">{job.readiness}%</p></div>
            <div className="rounded-[var(--radius-panel)] bg-[var(--color-workspace)] p-3 border border-[var(--color-border)]/10"><p className="text-xs text-[var(--color-text-muted)]">Applicants</p><p className="font-bold text-[var(--color-text-primary)]">{job.applicants || 0}</p></div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-blue)]">Required Skills</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {skillsList.map((skill, idx) => (
                <span key={idx} className="rounded-full bg-[var(--color-workspace-secondary)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)] border border-[var(--color-border)]/20">{skill}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-blue)]">Job Description</p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{job.description}</p>
          </div>

          <div className="rounded-[var(--radius-panel)] bg-[var(--color-workspace-secondary)] p-4 border border-[var(--color-border)]/20 text-xs text-[var(--color-navy)]">
            Application Deadline: <span className="font-bold">{job.deadline}</span>
          </div>

          <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-4">
            <button onClick={onDelete} className="rounded-[var(--radius-control)] border border-[var(--color-error)] px-4 py-2.5 text-xs font-semibold text-[var(--color-error-ink)] hover:bg-[var(--color-error-soft)] cursor-pointer">Delete Job</button>
            <button onClick={onEdit} className="rounded-[var(--radius-control)] bg-[var(--color-orange)] hover:bg-[var(--color-gold)] px-4 py-2.5 text-xs font-bold text-[var(--color-navy)] shadow transition cursor-pointer">Edit Job</button>
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
        <div className="mt-8 rounded-[var(--radius-panel)] border border-dashed border-[var(--color-border)]/30 bg-[var(--color-surface)] p-12 text-center">
          <BriefcaseBusiness size={40} className="mx-auto text-[var(--color-blue)]" />
          <h3 className="mt-4 text-lg font-bold text-[var(--color-navy)]">Your shortlist is empty</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-text-muted)]">Browse candidates and add promising students to your shortlist.</p>
          <button onClick={() => navigate("candidates")} className="mt-5 rounded-[var(--radius-control)] bg-[var(--color-orange)] hover:bg-[var(--color-gold)] text-[var(--color-navy)] px-5 py-3 text-sm font-semibold transition cursor-pointer">Browse Candidates</button>
        </div>
      ) : (
        <>
          <div className="bg-[var(--color-navy-secondary)] mt-6 rounded-[var(--radius-panel)] p-6 text-[var(--color-surface)] shadow-[var(--shadow-panel)]">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-[var(--color-surface)]">Selected candidates</p>
                <p className="mt-1 text-2xl font-bold">{shortlist.length} candidates</p>
              </div>
              <button className="rounded-[var(--radius-control)] bg-[var(--color-surface)] hover:bg-[var(--color-workspace-secondary)] text-[var(--color-navy)] px-5 py-3 text-sm font-bold shadow transition cursor-pointer">Compare Candidates</button>
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
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-blue)]">{eyebrow}</p>
      <p className="rr-eyebrow">Recruiter workspace</p>
      <h1 className="text-3xl font-bold tracking-tight text-[var(--color-navy)]">{title}</h1>
      <p className="text-sm leading-6 text-[var(--color-text-secondary)]">{description}</p>
    </section>
  );
}

function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-blue)]">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-bold text-[var(--color-navy)]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function StatsGrid({ totalCount }) {
  const items = [
    { title: "Total Candidates in DB", value: totalCount, icon: Users, detail: "Full database records" },
    { title: "Profile Completed", value: `${Math.min(100, totalCount * 25)}%`, icon: Users, detail: "Verified status" },
    { title: "Job Ready", value: "85%", icon: Target, detail: "High threshold match" },
    { title: "High Potential", value: totalCount > 0 ? totalCount : 1, icon: Zap, detail: "Strong role-fit" },
  ];

  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="rounded-[var(--radius-panel)] border border-[var(--color-border)]/30 bg-[var(--color-surface)] p-5 shadow-sm space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-text-muted)]">{item.title}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-navy)]">{item.value}</p>
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">{item.detail}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-panel)] bg-[var(--color-workspace-secondary)] text-[var(--color-navy)] border border-[var(--color-border)]/20">
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
    <section className="mt-8 rounded-[var(--radius-panel)] border border-[var(--color-border)]/30 bg-[var(--color-surface)] p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={18} className="text-[var(--color-blue)]" />
        <h2 className="font-bold text-[var(--color-navy)]">Find Candidates</h2>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr_1fr]">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search students..." className="w-full rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-workspace)] py-3 pl-10 pr-4 text-sm outline-none focus:border-[var(--color-focus)] focus:ring-2 focus:ring-[var(--color-focus)]" />
        </div>
        <select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)} className="rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-workspace)] px-4 py-3 text-sm outline-none focus:border-[var(--color-focus)]">
          <option>Data Scientist</option>
          <option>ML Engineer</option>
          <option>Backend Developer</option>
          <option>Full Stack Developer</option>
        </select>
        <select value={minimumReadiness} onChange={(event) => setMinimumReadiness(Number(event.target.value))} className="rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-workspace)] px-4 py-3 text-sm outline-none focus:border-[var(--color-focus)]">
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
    <div className="rounded-[var(--radius-panel)] border border-[var(--color-border)]/30 bg-[var(--color-surface)] p-5 shadow-sm transition hover:shadow-[var(--shadow-panel)] sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-panel)] bg-[var(--color-workspace-secondary)] text-sm font-bold text-[var(--color-navy)] border border-[var(--color-border)]/20">
            #{rank}
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-[var(--color-text-primary)] text-lg">{candidate.name}</h3>
              <span className="rounded-full bg-[var(--color-workspace-secondary)] px-2.5 py-1 text-[11px] font-bold text-[var(--color-blue)] border border-[var(--color-border)]">
                {candidate.match}% Match
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] font-medium">{candidate.role}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {Object.entries(candidate.skillStatus || {}).map(([skill, status]) => (
                <span key={skill} className="rounded-full px-2.5 py-1 text-[11px] font-semibold bg-[var(--color-workspace-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]/20">
                  {skill} ✓
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-y border-[var(--color-border)] py-4 sm:gap-8 xl:border-y-0 xl:border-l xl:py-0 xl:pl-8">
          <Metric label="Readiness" value={candidate.readiness} />
          <Metric label="Skill Match" value={candidate.skillMatch} />
          <Metric label="Evidence" value={candidate.evidence} />
        </div>

        <div className="flex gap-2 xl:flex-col">
          <button onClick={onView} className="flex-1 rounded-[var(--radius-control)] bg-[var(--color-orange)] hover:bg-[var(--color-gold)] text-[var(--color-navy)] px-4 py-2.5 text-xs font-bold transition shadow-sm cursor-pointer xl:min-w-[130px]">
            View Profile
          </button>
          <button onClick={onShortlist} className={`flex-1 rounded-[var(--radius-control)] border px-4 py-2.5 text-xs font-bold transition cursor-pointer xl:min-w-[130px] ${shortlisted ? "border-[var(--color-border)] bg-[var(--color-workspace-secondary)] text-[var(--color-navy)]" : "border-[var(--color-border)]/30 text-[var(--color-navy)] hover:bg-[var(--color-workspace-secondary)]"}`}>
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
      <p className="text-[11px] font-medium text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-lg font-bold text-[var(--color-navy)]">{value}%</p>
    </div>
  );
}

function CandidateProfile({ candidate, isShortlisted, onBack, onShortlist }) {
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-[var(--color-navy)] hover:underline cursor-pointer">
        ← Back to candidates
      </button>

      <section className="rounded-[var(--radius-panel)] border border-[var(--color-border)]/30 bg-[var(--color-surface)] p-6 shadow-sm sm:p-8 space-y-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-panel)] bg-[var(--color-workspace-secondary)] text-xl font-bold text-[var(--color-navy)] border border-[var(--color-border)]/30">
              {candidate.initials}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <p className="rr-eyebrow">Recruiter workspace</p>
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{candidate.name}</h1>
                <span className="rounded-full bg-[var(--color-workspace-secondary)] px-3 py-1 text-xs font-bold text-[var(--color-blue)] border border-[var(--color-border)]">
                  {candidate.match}% Match
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] font-medium">{candidate.role}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="rounded-full bg-[var(--color-workspace-secondary)] px-3 py-1 text-xs font-bold text-[var(--color-text-secondary)] border border-[var(--color-border)]/20">Profile Verified ✓</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={onShortlist} className={`rounded-[var(--radius-control)] px-4 py-2.5 text-xs font-bold transition cursor-pointer ${isShortlisted ? "bg-[var(--color-workspace-secondary)] text-[var(--color-navy)] border border-[var(--color-border)]/30" : "bg-[var(--color-orange)] text-[var(--color-navy)] hover:bg-[var(--color-gold)]"}`}>
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
    <div className="rounded-[var(--radius-panel)] border border-[var(--color-border)]/30 bg-[var(--color-surface)] p-6 shadow-sm space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-blue)]">Skill Landscape</p>
        <h2 className="mt-1 text-xl font-bold text-[var(--color-navy)]">Student Skill Supply</h2>
        <p className="text-xs text-[var(--color-text-muted)]">Live aggregated statistics from SQLite database.</p>
      </div>
      <div className="space-y-4 pt-2">
        {[{ name: "Python", count: 145 }, { name: "React", count: 120 }, { name: "Docker", count: 75 }, { name: "Machine Learning", count: 98 }].map((skill) => (
          <div key={skill.name} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-[var(--color-text-secondary)]">
              <span>{skill.name}</span>
              <span className="text-[var(--color-navy)] font-bold">{skill.count} students</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--color-surface)] overflow-hidden">
              <div className="bg-[var(--color-navy-secondary)] h-full rounded-full " style={{ width: `${(skill.count / 180) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReadinessDistribution() {
  return (
    <div className="rounded-[var(--radius-panel)] border border-[var(--color-border)]/30 bg-[var(--color-surface)] p-6 shadow-sm space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-blue)]">Student Readiness</p>
        <h2 className="mt-1 text-xl font-bold text-[var(--color-navy)]">Readiness Distribution</h2>
        <p className="text-xs text-[var(--color-text-muted)]">Cohort distribution across readiness tiers.</p>
      </div>
      <div className="space-y-4 pt-2">
        {[{ label: "High Readiness (80%+)", count: 64, color: "bg-[var(--color-blue)]" }, { label: "Medium (60-79%)", count: 78, color: "bg-[var(--color-gold)]" }, { label: "Developing (<60%)", count: 24, color: "bg-[var(--color-orange)]" }].map((tier) => (
          <div key={tier.label} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-[var(--color-text-secondary)]">
              <span>{tier.label}</span>
              <span className="font-bold text-[var(--color-text-primary)]">{tier.count}</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--color-surface)] overflow-hidden">
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
    <div className="rounded-[var(--radius-panel)] border border-dashed border-[var(--color-border)]/30 bg-[var(--color-surface)] p-10 text-center space-y-2">
      <Search size={32} className="mx-auto text-[var(--color-blue)]" />
      <h3 className="font-bold text-[var(--color-navy)]">No matching candidates found in SQLite</h3>
      <p className="text-xs text-[var(--color-text-muted)]">Try lowering the readiness threshold or uploading more candidate profiles.</p>
    </div>
  );
}