import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileSearch, ShieldAlert, Target, Menu, UploadCloud, AlertCircle, Globe } from 'lucide-react';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);

  // Updated purely Magenta/Peach Palette (No Black)
  const colors = {
    darkMagenta: '#53041B',    // Main sidebar background
    vibrantMagenta: '#770429', // Borders, hover states, and gradients
    brightPink: '#BB2649',     // Small pops of color/accents
    peachCream: '#F8D8E3',     // Active text and icon highlights
    almond: '#FDF0F4',         // Standard text color
  };

  const navItems = [
    { name: 'Upload Profile', path: '/dashboard/upload', icon: UploadCloud },
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Evidence', path: '/dashboard/evidence', icon: FileSearch },
    { name: 'Gaps & Roadmap', path: '/dashboard/gaps', icon: ShieldAlert },
    { name: 'Career Gaps', path: '/dashboard/career-gaps', icon: AlertCircle },
    { name: 'Digital Footprint', path: '/dashboard/digital-footprint', icon: Globe },
    { name: 'Role Analyzer', path: '/dashboard/role-analyzer', icon: Target },
    { name: 'Resume Improver', path: '/dashboard/resume-improver', icon: Target },
  ];

  return (
    <div 
      style={{ backgroundColor: colors.darkMagenta }}
      className={`border-r border-[#770429] flex flex-col transition-all duration-300 ease-in-out h-screen text-[#FDF0F4] ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      {/* Header & Toggle Button */}
      <div 
        style={{ borderColor: colors.vibrantMagenta }}
        className={`flex items-center h-16 border-b ${isExpanded ? 'px-6 justify-between' : 'px-0 justify-center'}`}
      >
        {isExpanded && (
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: colors.brightPink }}></div>
            <h1 
              style={{ color: colors.almond }}
              className="text-xl font-extrabold tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300"
            >
              Resume<span style={{ color: colors.peachCream }}>Radar</span>
            </h1>
          </div>
        )}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ color: colors.peachCream }}
          className="p-2 rounded-lg hover:bg-[#770429] transition-colors cursor-pointer"
          title="Toggle Sidebar"
        >
          <Menu className="w-6 h-6 shrink-0" />
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2.5 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard'}
            title={!isExpanded ? item.name : ''}
            style={({ isActive }) => ({
              backgroundColor: isActive ? colors.peachCream : 'transparent',
              color: isActive ? colors.darkMagenta : colors.almond,
            })}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-xl transition-all duration-200 font-medium ${
                isActive
                  ? 'shadow-md shadow-[#53041B]/50 transform scale-[1.01]'
                  : 'hover:bg-[#770429] hover:text-white'
              } ${isExpanded ? 'gap-3 justify-start px-4' : 'justify-center'}`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  style={{ color: isActive ? colors.darkMagenta : colors.peachCream }} 
                  className="w-5 h-5 shrink-0 transition-colors" 
                />
                {isExpanded && (
                  <span className="whitespace-nowrap transition-opacity">
                    {item.name}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Decorative Accent at Footer */}
      {isExpanded && (
        <div className="p-4 border-t border-[#770429] text-center">
          <p className="text-xs tracking-wider" style={{ color: `${colors.peachCream}90` }}>
            POWERED BY <span className="font-semibold" style={{ color: colors.brightPink }}>DATAQUEST 3.0</span>
          </p>
        </div>
      )}
    </div>
  );
}