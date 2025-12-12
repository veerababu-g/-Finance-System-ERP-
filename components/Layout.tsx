import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, DollarSign, LogOut, Menu, X, HardHat } from 'lucide-react';
import { AuthService } from '../services/dataService';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={20} /> },
    { name: 'Finance', path: '/finance', icon: <DollarSign size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl relative z-20">
        <div className="p-8 flex items-center gap-4 border-b border-white/10">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-xl shadow-lg shadow-blue-900/50">
             <HardHat size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white">BuildERP</h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide">CONSTRUCTION OS</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 translate-x-1'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
                }`
              }
            >
              <span className="relative z-10 flex items-center gap-3">
                {item.icon}
                <span className="font-medium tracking-wide">{item.name}</span>
              </span>
              {/* Active Indicator Glow */}
              <NavLink 
                 to={item.path} 
                 className={({ isActive }) => isActive ? "absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-100 z-0" : "hidden"} 
              />
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10 bg-slate-900/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f8fafc]">
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-md z-20">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <HardHat size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg">BuildERP</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[72px] left-0 w-full bg-slate-800 text-white shadow-xl z-30 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col p-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-4 rounded-xl font-medium ${
                      isActive ? 'bg-blue-600 shadow-lg' : 'hover:bg-white/5 text-slate-300'
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
              <div className="h-px bg-white/10 my-2"></div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-4 text-red-400 hover:bg-white/5 w-full text-left rounded-xl"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </nav>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-10 scroll-smooth">
           <div className="max-w-7xl mx-auto space-y-8 pb-10">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;