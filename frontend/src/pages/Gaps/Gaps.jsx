import { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, ArrowRight, Terminal, CheckCircle2, X, Sparkles, BookOpen, Loader2, Briefcase } from 'lucide-react';

export default function Gaps() {
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState('Full Stack Engineer');
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  // Role-specific roadmap milestones & skills mapping
  const roleRoadmaps = {
    'Full Stack Engineer': [
      { step: 1, title: 'React & Next.js Advanced Architecture', skill: 'Component State & SSR', desc: 'Master App Router, Server Components, and optimized layout streaming.', time: '1 Week', impact: 'Core Competency', details: { objective: 'Build robust, highly performant frontend applications.', codeSnippet: 'export default async function Page() { const data = await fetch... }', tasks: ['Understand Server vs Client components', 'Implement dynamic routing with nested layouts', 'Optimize asset loading and bundle sizes'] } },
      { step: 2, title: 'Node.js & Express REST APIs', skill: 'Backend Middleware & Routing', desc: 'Secure asynchronous endpoints with JWT authentication and custom middleware.', time: '1 Week', impact: 'High Impact', details: { objective: 'Construct scalable and secure backend servers.', codeSnippet: 'app.use(express.json()); app.post("/api/verify", verifyToken, ...);', tasks: ['Build modular REST controllers', 'Implement robust error-handling middleware', 'Secure endpoints against rate-limiting attacks'] } },
      { step: 3, title: 'Relational Database Design', skill: 'PostgreSQL & ORM Mapping', desc: 'Design normalized schemas, foreign keys, and performant indexes.', time: '5 Days', impact: 'Core Competency', details: { objective: 'Ensure persistent and ACID-compliant data storage.', codeSnippet: 'CREATE TABLE candidates (id SERIAL PRIMARY KEY, name VARCHAR(100));', tasks: ['Write complex SQL joins and aggregations', 'Configure connection pooling', 'Optimize queries using database execution plans'] } },
      { step: 4, title: 'Docker & Cloud Deployment', skill: 'Containerization & CI/CD', desc: 'Write multi-stage Dockerfiles and deploy containers to AWS/Vercel.', time: '4 Days', impact: 'Production Ready', details: { objective: 'Eliminate environment drift via automated container pipelines.', codeSnippet: 'FROM node:18-alpine AS builder\nWORKDIR /app\nCOPY . .\nRUN npm run build', tasks: ['Write multi-stage build scripts', 'Configure Docker Compose for local environments', 'Automate builds with GitHub Actions'] } }
    ],
    'Data Scientist': [
      { step: 1, title: 'Advanced Python & PyTorch', skill: 'Neural Network Architectures', desc: 'Build custom training loops, loss functions, and tensor datasets.', time: '1 Week', impact: 'Core Competency', details: { objective: 'Develop custom deep learning models from scratch.', codeSnippet: 'class PINNModel(nn.Module):\n    def __init__(self): super().__init__()', tasks: ['Implement custom autograd functions', 'Optimize training pipelines on GPU tensors', 'Evaluate loss curves and regularization'] } },
      { step: 2, title: 'Statistical Modeling & Regression', skill: 'Scipy & Statsmodels', desc: 'Execute rank correlation, partial regression, and hypothesis testing.', time: '5 Days', impact: 'High Impact', details: { objective: 'Validate predictive models using rigorous statistical theory.', codeSnippet: 'import statsmodels.api as sm\nmodel = sm.OLS(y, X).fit()', tasks: ['Perform residual analysis', 'Evaluate confidence intervals', 'Check multicollinearity metrics'] } },
      { step: 3, title: 'Computer Vision Pipelines', skill: 'OpenCV & MediaPipe', desc: 'Extract facial landmarks, process video streams, and map coordinates.', time: '1 Week', impact: 'Core Competency', details: { objective: 'Build real-time computer vision interactive trackers.', codeSnippet: 'mp_face = mp.solutions.face_mesh\nface_mesh = mp_face.FaceMesh()', tasks: ['Configure landmark detection models', 'Handle frame buffer processing optimization', 'Map visual coordinates to screen space'] } },
      { step: 4, title: 'Physics-Informed Neural Networks', skill: 'PDE Loss Constraints', desc: 'Incorporate physical conservation laws directly into deep learning losses.', time: '1 Week', impact: 'Research Grade', details: { objective: 'Constrain deep learning predictions using physical differential equations.', codeSnippet: 'loss = data_loss + lambda_weight * pde_residual_loss', tasks: ['Formulate water balance equations', 'Design custom loss gradient penalties', 'Publish reproducible research notebooks'] } }
    ],
    'Frontend Developer': [
      { step: 1, title: 'Advanced React & Custom Hooks', skill: 'React Hooks & State Management', desc: 'Build reusable custom hooks, context controllers, and memoized components.', time: '5 Days', impact: 'Core Competency', details: { objective: 'Architect clean, modular user interface components.', codeSnippet: 'function useDebounce(value, delay) { /* hook logic */ }', tasks: ['Master useMemo and useCallback optimization', 'Build custom data-fetching hooks', 'Manage complex state architectures'] } },
    ]
  };

  const milestones = roleRoadmaps[selectedRole] || roleRoadmaps['Full Stack Engineer'];
  const currentMilestones = Array.isArray(milestones) ? milestones : [milestones];

  useEffect(() => {
    const fetchGaps = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/gaps-roadmap');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load gaps');
        
        // Map backend database gaps format to UI schema safely
        const dbGaps = (data.gaps || []).map((gap, idx) => ({
          id: idx + 1,
          skill: gap.title || gap.skill || "Core Competency",
          issue: gap.reason || gap.issue || "Unsupported resume claim detected.",
          whyMissing: gap.reason || "Database records lack automated platform verification signatures.",
          severity: gap.severity || "High"
        }));

        setGaps(dbGaps);
      } catch (err) {
        console.error("Failed to fetch database gaps:", err);
        setError(err.message);
        // Resilient fallback if backend query fails
        setGaps([
          { id: 1, skill: "Database Telemetry Audit", issue: "Unable to reach SQLite verification logs.", whyMissing: "Ensure your backend server is running on port 5001.", severity: "High" }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchGaps();
  }, []);

  if (loading) {
    return (
      <div className="rr-page rr-content flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-10 h-10 text-[var(--color-blue)] animate-spin" />
        <p className="text-[var(--color-text-secondary)] font-medium animate-pulse">Querying Verification Database & Building Roadmap...</p>
      </div>
    );
  }

  return (
    <div className="rr-page rr-content space-y-12 max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div>
        <p className="rr-eyebrow">Evidence intelligence</p>
        <h1 className="text-3xl font-bold text-[var(--color-navy)]">Gaps & Roadmap</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Audit unsupported resume claims and follow your curated learning timeline.</p>
      </div>

      {/* Role Selection Tabs for Customized Learning */}
      {error && <p role="alert" className="text-[var(--color-error-ink)] text-xs font-semibold px-2">{error}</p>}
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] border border-[var(--color-border)]/30 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-[var(--color-workspace-secondary)]/60 p-2.5 rounded-[var(--radius-panel)]">
            <Briefcase className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </div>
          <div>
            <h2 className="font-bold text-[var(--color-navy)] text-lg">Choose Role You Are Preparing For</h2>
            <p className="text-xs text-[var(--color-text-muted)]">Switch target roles to instantly adapt your milestone roadmap and required skills.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          {Object.keys(roleRoadmaps).map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-5 py-2.5 rounded-[var(--radius-control)] font-bold text-sm transition-all shadow-sm cursor-pointer ${
                selectedRole === role
                  ? "bg-[var(--color-workspace-secondary)] text-[var(--color-navy)] shadow-[var(--shadow-panel)] scale-105"
                  : "bg-[var(--color-surface)] hover:bg-[var(--color-workspace-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-navy)] border border-[var(--color-border)]"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Database Gaps Audit Section */}
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] border border-[var(--color-border)]/40 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-[var(--color-border)] pb-4">
          <div className="bg-[var(--color-error-soft)] p-2.5 rounded-[var(--radius-panel)]">
            <ShieldAlert className="w-6 h-6 text-[var(--color-error-ink)]" />
          </div>
          <div>
            <h2 className="font-bold text-[var(--color-navy)] text-xl">Database Evidence Gaps</h2>
            <p className="text-sm text-[var(--color-text-muted)]">Unverified resume claims identified from SQLite verification logs.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gaps.length === 0 && <p className="text-sm text-[var(--color-text-muted)]">No stored evidence gaps found in SQLite database.</p>}
          {gaps.map((gap) => {
            const isHigh = gap.severity === 'High';
            return (
              <div key={gap.id} className={`rounded-[var(--radius-panel)] border ${isHigh ? "border-[var(--color-error)] bg-[var(--color-error-soft)]/40" : "border-[var(--color-gold)] bg-[var(--color-warning-soft)]/40"} p-6 flex flex-col justify-between space-y-4 shadow-sm`}>
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-[var(--color-surface)] p-2.5 rounded-[var(--radius-panel)] shadow-sm border border-[var(--color-border)]">
                      {isHigh ? <Terminal className="w-5 h-5 text-[var(--color-error-ink)]" /> : <AlertTriangle className="w-5 h-5 text-[var(--color-warning-ink)]" />}
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full bg-[var(--color-surface)] ${isHigh ? "text-[var(--color-error-ink)] border-[var(--color-error)]" : "text-[var(--color-warning-ink)] border-[var(--color-gold)]"} shadow-sm border`}>
                      {gap.severity} Priority
                    </span>
                  </div>
                  <h3 className="font-bold text-[var(--color-text-primary)] text-lg mb-1">{gap.skill}</h3>
                  <p className="text-sm text-[var(--color-text-primary)] font-medium mb-3">{gap.issue}</p>
                </div>

                <div className="bg-[var(--color-surface)]/90 p-3.5 rounded-[var(--radius-panel)] border border-[var(--color-border)]/60 space-y-1">
                  <span className="text-[11px] font-bold tracking-wide text-[var(--color-text-secondary)] block">Why it was flagged:</span>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{gap.whyMissing}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CURVED ROAD MAP SECTION */}
      <div className="bg-[var(--color-workspace)] rounded-[var(--radius-panel)] border border-[var(--color-border)]/30 shadow-[var(--shadow-panel)] p-6 sm:p-12 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-[var(--color-workspace-secondary)]/50 rounded-full hidden pointer-events-none"></div>

        <div className="mb-10 relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[var(--color-workspace-secondary)] text-[var(--color-navy)] mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Curated Learning Roadmap ({selectedRole})
          </div>
          <h2 className="font-bold text-[var(--color-navy)] text-2xl sm:text-3xl">Your learning timeline</h2>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1">Follow the checkpoints below to master required skills step by step.</p>
        </div>

        {/* Curved Road Container with SVG Winding Line */}
        <div className="rr-roadmap-timeline relative z-10 max-w-3xl mx-auto py-6">
          


          <div className="space-y-16 relative z-10">
            {currentMilestones.map((milestone, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={milestone.step}
                  onClick={() => setSelectedMilestone(milestone)}
                  className={`rr-roadmap-step ${isEven ? 'rr-roadmap-even' : ''} group cursor-pointer`}
                >
                  <div className="w-full sm:w-[calc(50%-40px)] bg-[var(--color-surface)] border border-[var(--color-border)]/30 rounded-[var(--radius-panel)] p-6 shadow-[var(--shadow-panel)] hover:shadow-[var(--shadow-panel)] hover:border-[var(--color-border)] transition-all group-hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-[var(--color-workspace-secondary)] text-[var(--color-text-secondary)] text-xs font-bold rounded-full border border-[var(--color-border)]/20">
                        {milestone.impact}
                      </span>
                      <span className="text-xs font-bold text-[var(--color-text-muted)]">Est. {milestone.time}</span>
                    </div>

                    <h3 className="font-bold text-[var(--color-navy)] text-lg mb-1 group-hover:text-[var(--color-blue)] transition-colors">{milestone.title}</h3>
                    <p className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2">Required Skill: <span className="text-[var(--color-blue)]">{milestone.skill}</span></p>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">{milestone.desc}</p>

                    <div className="flex items-center gap-1 text-xs font-bold text-[var(--color-text-secondary)] group-hover:translate-x-1 transition-transform">
                      <span>Inspect Deep Dive</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="w-14 h-14 bg-[var(--color-navy)] text-[var(--color-surface)] rounded-full border-4 border-[var(--color-border)] shadow-[var(--shadow-panel)] flex items-center justify-center font-semibold text-lg shrink-0 group-hover:scale-110 group-hover:bg-[var(--color-cyan)] transition-transform">
                    0{milestone.step}
                  </div>

                  <div className="hidden sm:block sm:w-[calc(50%-40px)]"></div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Deep-Dive Guide Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--color-surface)] rounded-[var(--radius-panel)] max-w-lg w-full p-6 sm:p-8 shadow-[var(--shadow-panel)] border border-[var(--color-border)]/30 space-y-6 relative animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setSelectedMilestone(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[var(--color-surface)] hover:bg-[var(--color-workspace-secondary)] text-[var(--color-text-secondary)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-navy)] text-[var(--color-surface)] rounded-[var(--radius-panel)] flex items-center justify-center font-semibold text-lg shadow-sm">
                0{selectedMilestone.step}
              </div>
              <div>
                <span className="text-xs font-bold text-[var(--color-text-secondary)] tracking-wide">Required Skill: {selectedMilestone.skill}</span>
                <h3 className="text-xl font-bold text-[var(--color-navy)]">{selectedMilestone.title}</h3>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-[var(--radius-panel)] bg-[var(--color-workspace-secondary)]/50 border border-[var(--color-border)]/20 space-y-1">
                <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase">Core Objective</span>
                <p className="text-[var(--color-text-primary)] font-medium">{selectedMilestone.details.objective}</p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold tracking-wide text-[var(--color-text-muted)] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[var(--color-blue)]" /> Reference Configuration / Code
                </span>
                <div className="bg-[var(--color-navy)] text-[var(--color-blue)] font-mono text-xs p-4 rounded-[var(--radius-panel)] overflow-x-auto shadow-inner">
                  <code>{selectedMilestone.details.codeSnippet}</code>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold tracking-wide text-[var(--color-text-muted)] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[var(--color-blue)]" /> Execution Tasks
                </span>
                <div className="space-y-2">
                  {selectedMilestone.details.tasks.map((task, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-[var(--radius-panel)] bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-blue)] shrink-0 mt-0.5" />
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => setSelectedMilestone(null)}
                className="w-full py-3 bg-[var(--color-orange)] hover:bg-[var(--color-gold)] text-[var(--color-navy)] font-bold rounded-[var(--radius-control)] transition-colors shadow-[var(--shadow-panel)] text-sm cursor-pointer"
              >
                Got It, Let's Master This
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}