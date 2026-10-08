import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileSearch, ShieldAlert, Target, Menu, UploadCloud, AlertCircle, Globe, Radar, PanelLeftClose, PanelLeftOpen, ChevronRight, X } from 'lucide-react';

const navGroups = [
  { name: 'Overview', items: [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ] },
  { name: 'Profile', items: [
    { name: 'Upload', path: '/dashboard/upload', icon: UploadCloud },
    { name: 'Evidence', path: '/dashboard/evidence', icon: FileSearch },
    { name: 'Digital Footprint', path: '/dashboard/digital-footprint', icon: Globe },
  ] },
  { name: 'Intelligence', items: [
    { name: 'Career Gaps', path: '/dashboard/career-gaps', icon: AlertCircle },
    { name: 'Role Analyzer', path: '/dashboard/role-analyzer', icon: Target },
  ] },
  { name: 'Action', items: [
    { name: 'Gaps & Roadmap', path: '/dashboard/gaps', icon: ShieldAlert },
    { name: 'Resume Improver', path: '/dashboard/resume-improver', icon: Target },
  ] },
];

function Brand() {
  return (
    <div className="candidate-brand">
      <Radar size={24} className="candidate-brand-icon" aria-hidden="true" />
      <span className="candidate-brand-name">Resume<span className="candidate-brand-accent">Radar</span></span>
    </div>
  );
}

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sidebarRef = useRef(null);
  const mobileToggleRef = useRef(null);
  const mobileCloseRef = useRef(null);
  const desktopToggleRef = useRef(null);

  useEffect(() => {
    if (!isMobileOpen) return;

    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const mobileToggle = mobileToggleRef.current;
    const desktopToggle = desktopToggleRef.current;
    mobileCloseRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsMobileOpen(false);
      }
      if (event.key !== 'Tab') return;

      const controls = [...sidebarRef.current.querySelectorAll('a[href], button:not([disabled])')]
        .filter((control) => control.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !sidebarRef.current.contains(active))) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (active === last || !sidebarRef.current.contains(active))) {
        event.preventDefault();
        first?.focus();
      }
    };

    const handleResize = (event) => {
      if (!event.matches) setIsMobileOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    mobileQuery.addEventListener('change', handleResize);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      mobileQuery.removeEventListener('change', handleResize);
      const toggle = mobileQuery.matches ? mobileToggle : desktopToggle;
      if (toggle?.isConnected) toggle.focus();
    };
  }, [isMobileOpen]);

  return (
    <>
      <a className="candidate-skip-link" href="#candidate-content">Skip to content</a>

      <header className="candidate-mobile-header">
        <Brand />
        <button
          ref={mobileToggleRef}
          type="button"
          className="candidate-icon-button"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open navigation"
          aria-expanded={isMobileOpen}
          aria-controls="candidate-navigation"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      </header>

      {isMobileOpen && (
        <button
          type="button"
          className="candidate-nav-backdrop"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close navigation"
          tabIndex={-1}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`candidate-sidebar${isExpanded ? '' : ' is-collapsed'}${isMobileOpen ? ' is-mobile-open' : ''}`}
        role={isMobileOpen ? 'dialog' : undefined}
        aria-modal={isMobileOpen ? true : undefined}
        aria-label="Candidate navigation"
      >
        <div className="candidate-sidebar-header">
          <Brand />
          <button
            ref={desktopToggleRef}
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="candidate-icon-button candidate-desktop-toggle"
            aria-label={isExpanded ? 'Collapse navigation' : 'Expand navigation'}
            aria-expanded={isExpanded}
            aria-controls="candidate-navigation"
            title={isExpanded ? 'Collapse navigation' : 'Expand navigation'}
          >
            {isExpanded ? <PanelLeftClose size={20} aria-hidden="true" /> : <PanelLeftOpen size={20} aria-hidden="true" />}
          </button>
          <button
            ref={mobileCloseRef}
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="candidate-icon-button candidate-mobile-close"
            aria-label="Close navigation"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <nav id="candidate-navigation" className="candidate-navigation" aria-label="Candidate">
          {navGroups.map((group) => (
            <section key={group.name} className="candidate-nav-group" aria-label={group.name}>
              <h2 className="candidate-nav-heading">{group.name}</h2>
              <ul className="candidate-nav-list">
                {group.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/dashboard'}
                      title={item.name}
                      aria-label={item.name}
                      onClick={() => setIsMobileOpen(false)}
                      className={({ isActive }) => `candidate-nav-link${isActive ? ' is-active' : ''}`}
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon size={20} className="candidate-nav-icon" aria-hidden="true" />
                          <span className="candidate-nav-label">{item.name}</span>
                          {isActive && <ChevronRight size={16} className="candidate-nav-active-marker" aria-hidden="true" />}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>

        <footer className="candidate-sidebar-footer">
          Powered by <span>DATAQUEST 3.0</span>
        </footer>
      </aside>
    </>
  );
}
