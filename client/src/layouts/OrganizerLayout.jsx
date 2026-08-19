import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Trophy, BarChart3, LogOut, Menu, X, Leaf, Building
} from 'lucide-react';

const navItems = [
  { to: '/organizer', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/organizer/competitions', icon: Trophy, label: 'Competitions' },
  { to: '/organizer/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function OrganizerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-xl fixed h-full z-30">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gradient">EcoLearn</h1>
              <p className="text-xs text-muted-foreground">Organizer Portal</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-eco-purple/10 text-eco-purple' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
              <item.icon className="w-4.5 h-4.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-eco-purple/20 flex items-center justify-center text-lg">{user?.avatar || '👩‍💼'}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground">Organizer</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition w-full px-2 py-1.5 rounded-lg hover:bg-destructive/10">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-card/80 backdrop-blur-xl border-b border-border z-40 flex items-center px-4 justify-between">
        <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-secondary rounded-lg"><Menu className="w-5 h-5" /></button>
        <div className="flex items-center gap-2"><Building className="w-5 h-5 text-eco-purple" /><span className="font-bold text-gradient">EcoLearn</span></div>
        <div className="w-9" />
      </div>
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25 }} className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border z-50 lg:hidden flex flex-col">
              <div className="p-4 border-b border-border flex justify-between items-center">
                <span className="font-bold text-gradient">EcoLearn</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1"><X className="w-5 h-5" /></button>
              </div>
              <nav className="flex-1 py-4 px-3 space-y-1">
                {navItems.map(item => (
                  <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-eco-purple/10 text-eco-purple' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
                    <item.icon className="w-4.5 h-4.5" />{item.label}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-64 mt-14 lg:mt-0">
        <div className="hidden lg:flex items-center justify-between px-6 h-14 border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-20">
          <div />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg">
            <span className="text-lg">{user?.avatar || '👩‍💼'}</span>
            <span className="text-sm font-medium">{user?.name?.split(' ')[0]}</span>
          </div>
        </div>
        <div className="p-4 lg:p-6"><Outlet /></div>
      </main>
    </div>
  );
}
