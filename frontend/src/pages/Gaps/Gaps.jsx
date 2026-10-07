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
    'Frontend Developer': {
      'step': 1,
      'title': 'Advanced React & Custom Hooks',
      'skill': 'React Hooks & State Management',
      'desc': 'Build reusable custom hooks, context controllers, and memoized components.',
      'time': '5 Days',
      'impact': 'Core Competency',
      'details': {
        'objective': 'Architect clean, modular user interface components.',
        'codeSnippet': 'function useDebounce(value, delay) { /* hook logic */ }',
        'tasks': ['Master useMemo and useCallback optimization', 'Build custom data-fetching hooks', 'Manage complex state architectures']
      }
    }
  };

  const milestones = roleRoadmaps[selectedRole] || roleRoadmaps['Full Stack Engineer'];
  const currentMilestones = Array.isArray(milestones) ? milestones : [milestones];

  useEffect(() => {
    const fetchGaps = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/gaps-roadmap');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load gaps');
        setGaps(data.gaps || []);
      } catch (err) {
        console.error("Failed to fetch database gaps:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGaps();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-10 h-10 text-[#BB2649] animate-spin" />
        <p className="text-[#770429] font-medium animate-pulse">Querying Verification Database & Building Roadmap...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#53041B]">Gaps & Roadmap</h1>
        <p className="text-[#770429] mt-1">Audit unsupported resume claims and follow your custom winding learning path.</p>
      </div>

      {/* Role Selection Tabs for Customized Learning */}
      {error && <p role="alert" className="text-red-600">{error}</p>}
      <div className="bg-white rounded-2xl border border-[#C92D68]/30 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#F8D8E3]/60 p-2.5 rounded-xl">
            <Briefcase className="w-5 h-5 text-[#770429]" />
          </div>
          <div>
            <h2 className="font-bold text-[#53041B] text-lg">Choose Role You Are Preparing For</h2>
            <p className="text-xs text-gray-500">Switch target roles to instantly adapt your winding milestone roadmap and required skills.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          {Object.keys(roleRoadmaps).map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                selectedRole === role
                  ? 'bg-[#53041B] text-white shadow-md scale-105'
                  : 'bg-gray-100 hover:bg-[#FDF0F4] text-gray-700 hover:text-[#53041B] border border-gray-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Database Gaps Audit Section */}
      <div className="bg-white rounded-2xl border border-[#C92D68]/40 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <div className="bg-red-50 p-2.5 rounded-xl">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h2 className="font-bold text-[#53041B] text-xl">Database Evidence Gaps</h2>
            <p className="text-sm text-gray-500">Unverified resume claims identified from SQLite verification logs.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!error && gaps.length === 0 && <p>No stored evidence gaps. Upload and verify a profile if you have not already.</p>}
          {gaps.map((gap) => {
            const isHigh = gap.severity === 'High';
            return (
              <div key={gap.id} className={`rounded-2xl border ${isHigh ? 'border-red-200 bg-red-50/40' : 'border-amber-200 bg-amber-50/40'} p-6 flex flex-col justify-between space-y-4 shadow-sm`}>
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100">
                      {isHigh ? <Terminal className="w-5 h-5 text-red-600" /> : <AlertTriangle className="w-5 h-5 text-orange-600" />}
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white ${isHigh ? 'text-red-600 border-red-200' : 'text-orange-600 border-orange-200'} shadow-sm border`}>
                      {gap.severity} Priority
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{gap.skill}</h3>
                  <p className="text-sm text-gray-800 font-medium mb-3">{gap.issue}</p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-xl border border-gray-200/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#770429] block">Why it was flagged:</span>
                  <p className="text-xs text-gray-600 leading-relaxed">{gap.whyMissing}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CURVED ROAD MAP SECTION (Light Background with Winding Path Look) */}
      <div className="bg-[#FDFBF7] rounded-3xl border border-[#C92D68]/30 shadow-lg p-6 sm:p-12 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-[#F8D8E3]/50 rounded-full blur-3xl pointer-events-none"></div>

        <div className="mb-10 relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#F8D8E3] text-[#53041B] mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Curated Winding Roadmap ({selectedRole})
          </div>
          <h2 className="font-bold text-[#53041B] text-2xl sm:text-3xl">Interactive Learning Highway</h2>
          <p className="text-[#770429] text-sm mt-1">Follow the curved checkpoints below to master required skills step by step.</p>
        </div>

        {/* Curved Road Container with SVG Winding Line */}
        <div className="relative z-10 max-w-3xl mx-auto py-6">
          
          {/* SVG Winding Road Path in Background */}
          <div className="absolute inset-0 flex justify-center pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 400 800" fill="none" preserveAspectRatio="none">
              <path 
                d="M 200 40 Q 350 200, 200 360 T 200 680" 
                stroke="#E5C5D2" 
                strokeWidth="32" 
                strokeLinecap="round" 
              />
              <path 
                d="M 200 40 Q 350 200, 200 360 T 200 680" 
                stroke="#53041B" 
                strokeWidth="4" 
                strokeDasharray="12 12" 
              />
            </svg>
          </div>

          {/* Staggered Milestone Nodes */}
          <div className="space-y-16 relative z-10">
            {currentMilestones.map((milestone, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={milestone.step}
                  onClick={() => setSelectedMilestone(milestone)}
                  className={`flex flex-col sm:flex-row items-center gap-6 ${isEven ? 'sm:flex-row-reverse' : ''} group cursor-pointer`}
                >
                  {/* Card Content Box */}
                  <div className="w-full sm:w-[calc(50%-40px)] bg-white border border-[#C92D68]/30 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-[#BB2649] transition-all group-hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-[#FDF0F4] text-[#770429] text-xs font-bold rounded-full border border-[#C92D68]/20">
                        {milestone.impact}
                      </span>
                      <span className="text-xs font-bold text-gray-400">Est. {milestone.time}</span>
                    </div>

                    <h3 className="font-bold text-[#53041B] text-lg mb-1 group-hover:text-[#BB2649] transition-colors">{milestone.title}</h3>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Required Skill: <span className="text-[#BB2649]">{milestone.skill}</span></p>
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">{milestone.desc}</p>

                    <div className="flex items-center gap-1 text-xs font-bold text-[#770429] group-hover:translate-x-1 transition-transform">
                      <span>Inspect Deep Dive</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Centered Node Marker on Road */}
                  <div className="w-14 h-14 bg-[#53041B] text-[#F8D8E3] rounded-full border-4 border-[#FDFBF7] shadow-xl flex items-center justify-center font-black text-lg shrink-0 group-hover:scale-110 group-hover:bg-[#BB2649] transition-transform">
                    0{milestone.step}
                  </div>

                  {/* Spacer for alternating layout on desktop */}
                  <div className="hidden sm:block sm:w-[calc(50%-40px)]"></div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Deep-Dive Guide Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#C92D68]/30 space-y-6 relative animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setSelectedMilestone(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#53041B] text-[#F8D8E3] rounded-xl flex items-center justify-center font-black text-lg shadow-sm">
                0{selectedMilestone.step}
              </div>
              <div>
                <span className="text-xs font-bold text-[#770429] uppercase tracking-wider">Required Skill: {selectedMilestone.skill}</span>
                <h3 className="text-xl font-bold text-[#53041B]">{selectedMilestone.title}</h3>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-2xl bg-[#FDF0F4]/50 border border-[#C92D68]/20 space-y-1">
                <span className="text-xs font-bold text-[#770429] uppercase">Core Objective</span>
                <p className="text-gray-800 font-medium">{selectedMilestone.details.objective}</p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#BB2649]" /> Reference Configuration / Code
                </span>
                <div className="bg-gray-900 text-emerald-400 font-mono text-xs p-4 rounded-xl overflow-x-auto shadow-inner">
                  <code>{selectedMilestone.details.codeSnippet}</code>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#BB2649]" /> Execution Tasks
                </span>
                <div className="space-y-2">
                  {selectedMilestone.details.tasks.map((task, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-800 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => setSelectedMilestone(null)}
                className="w-full py-3 bg-[#53041B] hover:bg-[#770429] text-white font-bold rounded-xl transition-colors shadow-md text-sm"
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
