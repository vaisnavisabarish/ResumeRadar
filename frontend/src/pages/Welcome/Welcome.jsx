import { useNavigate } from 'react-router-dom';
import { UserCheck, Building2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-gray-900">
      <div className="max-w-4xl w-full space-y-12 text-center">
        
        {/* Header Statement */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[#FDF0F4] text-[#770429] border border-[#C92D68]/20">
            <Sparkles className="w-4 h-4 text-[#BB2649]" /> ResumeRadar Intelligence Platform
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#53041B] tracking-tight">
            Converge Scattered Work Into One Unified Career Profile
          </h1>
          <p className="text-base text-[#770429] max-w-2xl mx-auto leading-relaxed font-medium">
            Select your portal to authenticate securely via Google OAuth and access verified telemetry.
          </p>
        </div>

        {/* Two Role Selection Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          
          {/* Applicant Box */}
          <div 
            onClick={() => navigate('/applicant/login')}
            className="bg-white rounded-3xl p-8 border-2 border-[#C92D68]/30 hover:border-[#53041B] shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-6 group text-left"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FDF0F4] flex items-center justify-center text-[#53041B] group-hover:bg-[#53041B] group-hover:text-white transition-all">
                <UserCheck className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#BB2649]">Candidate Portal</span>
                <h2 className="text-2xl font-bold text-[#53041B]">I'm an Applicant</h2>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Upload resumes, audit your digital footprint across GitHub and portfolios, and resolve career gaps.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-[#53041B] pt-4 border-t border-gray-100">
              <span>Sign in with Google</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Recruiter Box */}
          <div 
            onClick={() => navigate('/recruiter/login')}
            className="bg-white rounded-3xl p-8 border-2 border-[#C92D68]/30 hover:border-[#53041B] shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-6 group text-left"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FDF0F4] flex items-center justify-center text-[#53041B] group-hover:bg-[#53041B] group-hover:text-white transition-all">
                <Building2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#BB2649]">Hiring Team Portal</span>
                <h2 className="text-2xl font-bold text-[#53041B]">I'm a Recruiter</h2>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Evaluate candidates against role requirements using semantic vector comparison and database telemetry.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-[#53041B] pt-4 border-t border-gray-100">
              <span>Enterprise Google Login</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        {/* Footer Note */}
        <p className="text-xs text-gray-500 font-medium">
          Protected by SQLite backend telemetry on port 5001 • Secure OAuth 2.0 Integration
        </p>

      </div>
    </div>
  );
}