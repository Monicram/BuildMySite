// ============================================================
// BuildMySite Admin — Sidebar
// ============================================================
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Settings,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onMobileClose?: () => void;
}

const navItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/bookings', icon: Calendar, label: 'Bookings' },
  { path: '/admin/enquiries', icon: MessageSquare, label: 'Enquiries' },
  { path: '/admin/slots', icon: Clock, label: 'Availability' },
];

const bottomItems = [
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
  { path: '/admin/profile', icon: UserCircle, label: 'Profile' },
];

const Sidebar = ({ collapsed, onToggle, onMobileClose }: SidebarProps) => {
  const { admin, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({
    item,
    onClick,
  }: {
    item: { path: string; icon: React.ElementType; label: string };
    onClick?: () => void;
  }) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    return (
      <NavLink
        to={item.path}
        onClick={onClick}
        className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
          active
            ? 'bg-gold-500/15 text-gold-400'
            : 'text-obsidian-400 hover:text-obsidian-100 hover:bg-obsidian-700/60'
        }`}
      >
        {active && (
          <motion.div
            layoutId="activeNav"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gold-500 rounded-full"
          />
        )}
        <Icon
          size={18}
          className={`shrink-0 ${active ? 'text-gold-400' : 'text-obsidian-500 group-hover:text-obsidian-300'}`}
        />
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="text-sm font-medium truncate"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-obsidian-800 border border-obsidian-600 rounded-lg text-xs text-obsidian-100 font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
            {item.label}
          </div>
        )}
      </NavLink>
    );
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-full bg-obsidian-900 border-r border-obsidian-700/50 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-5 border-b border-obsidian-700/50">
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gold-gradient flex items-center justify-center">
          <Zap size={18} className="text-obsidian-900" strokeWidth={2.5} />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <p className="text-sm font-bold text-obsidian-100 leading-none">BuildMySite</p>
              <p className="text-xs text-gold-600 mt-0.5">Admin Panel</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-[4.5rem] z-10 w-6 h-6 rounded-full bg-obsidian-800 border border-obsidian-600 flex items-center justify-center text-obsidian-400 hover:text-gold-400 hover:border-gold-600 transition-colors"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 space-y-0.5 scrollbar-thin scrollbar-thumb-obsidian-700 scrollbar-track-transparent">
        {navItems.map(item => (
          <NavItem key={item.path} item={item} onClick={onMobileClose} />
        ))}

        <div className="my-3 border-t border-obsidian-700/50" />

        {bottomItems.map(item => (
          <NavItem key={item.path} item={item} onClick={onMobileClose} />
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-obsidian-700/50 px-2 py-3 space-y-1">
        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-lg ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gold-gradient flex items-center justify-center text-obsidian-900 text-xs font-bold shrink-0">
            {admin?.avatar ? (
              <img src={admin.avatar} alt={admin.name} className="w-full h-full object-cover" />
            ) : (
              admin ? getInitials(admin.name) : 'A'
            )}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0 flex-1"
              >
                <p className="text-xs font-semibold text-obsidian-100 truncate">{admin?.name}</p>
                <p className="text-[10px] text-obsidian-400 truncate">{admin?.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={logout}
          className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-obsidian-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}
          aria-label="Logout"
        >
          <LogOut size={18} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
          {collapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-obsidian-800 border border-obsidian-600 rounded-lg text-xs text-obsidian-100 font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
              Logout
            </div>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
