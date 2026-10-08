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
    <div className="space-y-6">
      {/* Header Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#BB2649]">Recruiter Workspace</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#53041B]">Job Postings</h1>
          <p className="text-sm text-gray-600">Create and manage opportunities for students in your placement pipeline.</p>
        </div>

        <button
          onClick={() => { setEditingJob(null); setShowForm(true); }}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#53041B] hover:bg-[#770429] px-5 py-3 text-sm font-bold text-white shadow transition cursor-pointer"
        >
          <Plus size={17} />
          Post New Job
        </button>
      </div>

      <div className="text-sm text-gray-500">
        <span className="font-bold text-gray-800">{jobs.length}</span> active job postings synchronized with SQLite.
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading jobs from database...</div>
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
  // Parse skills if stored as a JSON string
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
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#BB2649]">Recruiter Workspace</p>
            <h2 className="text-xl font-bold text-[#53041B]">{job ? "Edit Job" : "Post a New Job"}</h2>
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

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">Job Description</label>
            <textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe responsibilities..." rows={4} required className="w-full resize-none rounded-xl border border-gray-200 bg-[#FDFBF7] px-4 py-3 text-sm outline-none focus:border-[#BB2649]" />
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