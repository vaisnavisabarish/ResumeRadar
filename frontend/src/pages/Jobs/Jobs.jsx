import { useState, useEffect } from 'react';
import { BriefcaseBusiness, X, Plus, Calendar, MapPin, Building, Users } from 'lucide-react';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewingJob, setViewingJob] = useState(null);

  // Fetch jobs from SQLite backend on port 5001
  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/jobs');
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  async function saveJob(formData) {
    try {
      const url = editingJob 
        ? `http://localhost:5001/api/jobs/${editingJob.id}`
        : 'http://localhost:5001/api/jobs';
      
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
      const res = await fetch(`http://localhost:5001/api/jobs/${id}`, {
        method: 'DELETE',
      });
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
    <div className="rr-page rr-content space-y-6">
      {/* Header Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-blue)]">Recruiter Workspace</p>
          <p className="rr-eyebrow">Evidence intelligence</p>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-navy)]">Job Postings</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Create and manage opportunities for students in your placement pipeline.</p>
        </div>

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

      {loading ? (
        <div className="text-center py-12 text-[var(--color-text-muted)]">Loading jobs from database...</div>
      ) : jobs.length > 0 ? (
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
  // Parse skills if stored as a JSON string
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