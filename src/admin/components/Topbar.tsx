// ============================================================
// BuildMySite Admin — Topbar
// ============================================================
import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Menu,
  ChevronRight,
  LogOut,
  UserCircle,
  Settings,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils';
import ThemeToggle from '../../components/ThemeToggle';

interface TopbarProps {
  onMobileMenuOpen: () => void;
}

// Build breadcrumbs from path
const buildBreadcrumbs = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  return segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1),
    path: '/' + segments.slice(0, i + 1).join('/'),
  }));
};

const Topbar = ({ onMobileMenuOpen }: TopbarProps) => {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const breadcrumbs = buildBreadcrumbs(location.pathname);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 md:px-6 h-14 bg-obsidian-900/80 backdrop-blur-xl border-b border-obsidian-700/50">
      {/* Left: Mobile menu + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden p-1.5 rounded-lg text-obsidian-400 hover:text-obsidian-100 hover:bg-obsidian-700 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-sm min-w-0" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.path} className="flex items-center gap-1 min-w-0">
              {i > 0 && <ChevronRight size={12} className="text-obsidian-600 shrink-0" />}
              {i === breadcrumbs.length - 1 ? (
                <span className="text-obsidian-200 font-medium truncate">{crumb.label}</span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-obsidian-500 hover:text-gold-400 transition-colors truncate"
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Right: Search + Bell + Profile */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Search */}
        <AnimatePresence>
          {searchOpen ? (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative overflow-hidden"
            >
              <input
                autoFocus
                type="text"
                placeholder="Search…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onBlur={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="w-full h-8 pl-3 pr-8 bg-obsidian-800 border border-obsidian-600 rounded-lg text-sm text-obsidian-100 placeholder-obsidian-500 focus:outline-none focus:border-gold-500 transition-colors"
              />
              <button
                onMouseDown={e => { e.preventDefault(); setSearchOpen(false); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-obsidian-500 hover:text-obsidian-200"
              >
                <X size={14} />
              </button>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(true)}
              className="p-1.5 rounded-lg text-obsidian-400 hover:text-obsidian-100 hover:bg-obsidian-700 transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(o => !o)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-obsidian-700 transition-colors"
            aria-label="Profile menu"
            aria-expanded={profileOpen}
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-gold-gradient flex items-center justify-center text-obsidian-900 text-xs font-bold">
              {admin?.avatar ? (
                <img src={admin.avatar} alt={admin.name} className="w-full h-full object-cover" />
              ) : (
                admin ? getInitials(admin.name) : 'A'
              )}
            </div>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 bg-obsidian-800 border border-obsidian-700 rounded-xl shadow-xl overflow-hidden z-50"
              >
                {/* User info */}
                <div className="px-4 py-3 border-b border-obsidian-700">
                  <p className="text-sm font-semibold text-obsidian-100">{admin?.name}</p>
                  <p className="text-xs text-obsidian-400 truncate">{admin?.email}</p>
                </div>
                <div className="p-1.5 space-y-0.5">
                  <Link
                    to="/admin/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-obsidian-300 hover:text-obsidian-100 hover:bg-obsidian-700 transition-colors"
                  >
                    <UserCircle size={15} />
                    Profile
                  </Link>
                  <Link
                    to="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-obsidian-300 hover:text-obsidian-100 hover:bg-obsidian-700 transition-colors"
                  >
                    <Settings size={15} />
                    Settings
                  </Link>
                  <div className="border-t border-obsidian-700 my-1" />
                  <button
                    onClick={() => { setProfileOpen(false); logout(); }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
