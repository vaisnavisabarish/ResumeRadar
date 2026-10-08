import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Code, Briefcase, Link as LinkIcon, X, CheckCircle2 } from 'lucide-react';

export default function Upload() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const fileInput = useRef(null);
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const selectFile = (selectedFile) => {
    setError(null);
    if (!selectedFile) return;
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('The extraction backend supports PDF files only.');
      return;
    }
    setFile(selectedFile);
  };

  const submitProfile = async () => {
    if (!file || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('resume', file);
      const extractionResponse = await fetch('http://localhost:5000/api/resume/upload', {
        method: 'POST', body: form,
      });
      const profile = await extractionResponse.json();
      if (!extractionResponse.ok || !profile.success) {
        throw new Error(profile.message || 'Resume extraction failed.');
      }
      const links = profile.candidate.profile_links;
      const normalizeUrl = (value) => /^https?:\/\//i.test(value) ? value : `https://${value}`;
      if (github.trim()) links.github = normalizeUrl(github.trim());
      if (linkedin.trim()) links.linkedin = normalizeUrl(linkedin.trim());
      if (portfolio.trim()) links.portfolio = normalizeUrl(portfolio.trim());
      if (!links.github) throw new Error('Provide a GitHub profile URL to verify this resume.');
      const verificationResponse = await fetch('http://localhost:5001/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const verification = await verificationResponse.json();
      if (!verificationResponse.ok || !verification.success) {
        throw new Error(verification.error || 'Candidate verification failed.');
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Drag & Drop events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      selectFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="rr-page rr-upload min-h-screen bg-[var(--color-workspace)] flex flex-col items-center justify-center p-6 w-full">
      <div className="bg-[var(--color-surface)] p-8 md:p-10 rounded-[var(--radius-panel)] shadow-sm border border-[var(--color-border)]/20 max-w-2xl w-full">
        
        <div className="text-center mb-8">
          <p className="rr-eyebrow">Profile pipeline</p>
          <h1 className="text-3xl font-bold text-[var(--color-navy)] mb-3">Profile Setup</h1>
          <p className="text-[var(--color-text-secondary)] opacity-80">Upload your resume and provide online evidence links for the engine to verify your claims.</p>
        </div>
        
        <ol className="rr-pipeline rr-upload-pipeline" aria-label="Resume processing workflow">
          <li><span className="rr-pipeline-marker">01</span><strong>PDF</strong></li>
          <li><span className="rr-pipeline-marker">02</span><strong>Extract</strong></li>
          <li><span className="rr-pipeline-marker">03</span><strong>Verify</strong></li>
          <li><span className="rr-pipeline-marker">04</span><strong>Profile</strong></li>
        </ol>

        <input ref={fileInput} type="file" accept="application/pdf,.pdf" hidden
          onChange={(e) => selectFile(e.target.files?.[0])} />
        {/* Drag & Drop Zone */}
        {!file ? (
          <div 
            className={`relative border-2 border-dashed rounded-[var(--radius-panel)] p-10 flex flex-col items-center justify-center transition-colors cursor-pointer ${dragActive ? "border-[var(--color-border)] bg-[var(--color-workspace-secondary)]/20" : "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-workspace-secondary)]/30"}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInput.current.click()}
          >
            <div className="bg-[var(--color-workspace-secondary)] w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8 text-[var(--color-text-secondary)]" />
            </div>
            <p className="text-lg font-medium text-[var(--color-navy)] mb-1">Click to upload or drag and drop</p>
            <p className="text-sm text-[var(--color-text-secondary)] opacity-70">PDF files</p>
          </div>
        ) : (
          <div className="bg-[var(--color-workspace-secondary)]/30 border border-[var(--color-border)]/30 rounded-[var(--radius-panel)] p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[var(--color-surface)] p-3 rounded-lg shadow-sm">
                <FileText className="w-8 h-8 text-[var(--color-text-secondary)]" />
              </div>
              <div>
                <p className="font-semibold text-[var(--color-navy)] flex items-center gap-2">
                  {file.name} <CheckCircle2 className="w-4 h-4 text-[var(--color-blue)]" />
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] opacity-80">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              disabled={submitting}
              onClick={(e) => { e.stopPropagation(); setFile(null); fileInput.current.value = ''; }}
              className="p-2 hover:bg-[var(--color-surface)] rounded-full transition-colors text-[var(--color-text-secondary)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="my-8 flex items-center text-[var(--color-blue)]">
          <div className="flex-grow border-t border-[var(--color-border)]"></div>
          <span className="px-4 text-sm font-medium tracking-wide">Online Evidence</span>
          <div className="flex-grow border-t border-[var(--color-border)]"></div>
        </div>

        {/* Evidence Links Inputs */}
        <div className="space-y-4 mb-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Code className="h-5 w-5 text-[var(--color-text-secondary)]" />
            </div>
            <input 
              type="text" 
              placeholder="github.com/yourusername" 
              value={github} onChange={(e) => setGithub(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-focus)] focus:border-[var(--color-focus)] outline-none text-[var(--color-navy)] transition-all"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-[var(--color-text-secondary)]" />
            </div>
            <input 
              type="text" 
              placeholder="linkedin.com/in/yourusername" 
              value={linkedin} onChange={(e) => setLinkedin(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-focus)] focus:border-[var(--color-focus)] outline-none text-[var(--color-navy)] transition-all"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <LinkIcon className="h-5 w-5 text-[var(--color-text-secondary)]" />
            </div>
            <input 
              type="text" 
              placeholder="Portfolio URL (e.g. yoursite.com)" 
              value={portfolio} onChange={(e) => setPortfolio(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-focus)] focus:border-[var(--color-focus)] outline-none text-[var(--color-navy)] transition-all"
            />
          </div>
        </div>
        
        {error && <p role="alert" className="text-[var(--color-error-ink)] mb-4">{error}</p>}
        {/* Action Button */}
        <button 
          onClick={submitProfile}
          disabled={!file || submitting}
          className={`w-full py-4 rounded-[var(--radius-control)] font-bold text-lg transition-all shadow-[var(--shadow-panel)] ${
            file 
              ? "bg-[var(--color-orange)] text-[var(--color-navy)] hover:bg-[var(--color-gold)] hover:shadow-[var(--shadow-panel)] transform hover:-translate-y-0.5 cursor-pointer"
              : "bg-[var(--color-workspace-secondary)] text-[var(--color-text-muted)] cursor-not-allowed shadow-none"
          }`}
        >
          {submitting ? 'Extracting and verifying...' : file ? 'Run Full Extraction & Map Evidence →' : 'Upload a resume to begin'}
        </button>

      </div>
    </div>
  );
}
