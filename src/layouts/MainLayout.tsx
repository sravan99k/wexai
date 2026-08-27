import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Network, Briefcase, Menu, X } from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, end }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          isActive
            ? 'bg-primary text-white font-medium'
            : 'text-neutral-dark hover:bg-neutral-lightest hover:text-primary-dark'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-neutral-lightest overflow-hidden">
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden absolute top-4 left-4 z-50 p-2 bg-white rounded-md shadow-sm text-neutral-dark"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-neutral-light
        transition-transform duration-300 ease-in-out flex flex-col
      `}>
        <div className="p-6 border-b border-neutral-light">
          <h1 className="text-2xl font-bold text-primary-dark">SkillPath</h1>
          <p className="text-xs text-neutral mt-1 font-medium">Understand your skills. Find your path.</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <SidebarItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" end />
          <SidebarItem to="/assessment" icon={<CheckSquare size={20} />} label="Skill Assessment" />
          <SidebarItem to="/jobs" icon={<Briefcase size={20} />} label="Jobs & Skill Gaps" />
          <SidebarItem to="/career-graph" icon={<Network size={20} />} label="Explore Career Graph" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-neutral-darkest/20 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
