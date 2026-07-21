// ============================================================
// BuildMySite Admin — Dashboard Page (Premium SaaS Look)
// ============================================================
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Calendar,
  Clock,
  UserCircle,
  Settings,
  RefreshCw,
  ChevronRight,
  ArrowRight,
  Zap,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { dashboardService } from '../services/dashboard';
import { enquiryService } from '../services/enquiry';
import { bookingService } from '../services/booking';
import { formatDateTime, getStatusColor } from '../utils';

const Dashboard = () => {
  const queryClient = useQueryClient();

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
    staleTime: 30_000,
  });

  const { data: recentEnquiries, isLoading: enquiriesLoading } = useQuery({
    queryKey: ['enquiries'],
    queryFn: enquiryService.getAll,
    staleTime: 30_000,
    select: d => d.data.slice(0, 5),
  });

  const { data: recentBookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingService.getAll,
    staleTime: 30_000,
    select: d => d.data.slice(0, 5),
  });

  const formatMins = (mins: number) => {
    if (mins === undefined || isNaN(mins)) return '—';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const statCards = [
    {
      title: "Today's Bookings",
      value: stats?.todaysBookings ?? '—',
      icon: Zap,
      color: 'gold' as const,
    },
    {
      title: 'Upcoming Discovery Calls',
      value: stats?.upcomingCalls ?? '—',
      icon: Calendar,
      color: 'blue' as const,
    },
    {
      title: 'Available Time (30d)',
      value: formatMins(stats?.availableTimeMins as number),
      icon: CheckCircle,
      color: 'green' as const,
    },
    {
      title: 'Booked Time (30d)',
      value: formatMins(stats?.bookedTimeMins as number),
      icon: Clock,
      color: 'purple' as const,
    },
    {
      title: 'Disabled Time (30d)',
      value: formatMins(stats?.disabledTimeMins as number),
      icon: XCircle,
      color: 'red' as const,
    },
  ];

  const quickActions = [
    {
      title: 'Manage Bookings',
      description: 'Accept, reject or reschedule discovery calls.',
      icon: Calendar,
      link: '/admin/bookings',
      color: 'from-amber-500/20 to-yellow-600/10 hover:border-gold-500/40',
      iconColor: 'text-gold-400',
    },
    {
      title: 'View Enquiries',
      description: 'Respond to new project inquiries and client briefs.',
      icon: MessageSquare,
      link: '/admin/enquiries',
      color: 'from-blue-500/20 to-indigo-600/10 hover:border-blue-500/40',
      iconColor: 'text-blue-400',
    },
    {
      title: 'Manage Availability',
      description: 'Disable dates or time ranges and view active bookings.',
      icon: Clock,
      link: '/admin/slots',
      color: 'from-emerald-500/20 to-teal-600/10 hover:border-emerald-500/40',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Site Settings',
      description: 'Configure branding, contact details, and social links.',
      icon: Settings,
      link: '/admin/settings',
      color: 'from-purple-500/20 to-pink-600/10 hover:border-purple-500/40',
      iconColor: 'text-purple-400',
    },
    {
      title: 'Edit Profile',
      description: 'Update your display photo, name, phone, and password.',
      icon: UserCircle,
      link: '/admin/profile',
      color: 'from-cyan-500/20 to-sky-600/10 hover:border-cyan-500/40',
      iconColor: 'text-cyan-400',
    },
  ];

  const handleRefresh = async () => {
    await Promise.all([
      refetchStats(),
      queryClient.invalidateQueries({ queryKey: ['enquiries'] }),
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    ]);
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-obsidian-50 flex items-center gap-2">
            <Zap size={22} className="text-gold-400 animate-pulse" />
            Dashboard
          </h1>
          <p className="text-sm text-obsidian-400 mt-0.5">
            Admin Overview & Control Center
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-obsidian-800 border border-obsidian-700 text-obsidian-300 text-sm hover:text-obsidian-100 hover:border-obsidian-600 transition-all duration-200 shadow-lg active:scale-95"
        >
          <RefreshCw size={14} className={statsLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 bg-obsidian-800/40 border border-obsidian-700/30 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((card, i) => (
            <StatCard key={card.title} {...card} index={i} />
          ))}
        </div>
      )}

      {/* Quick Actions Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-obsidian-100">Quick Actions</h3>
          <p className="text-xs text-obsidian-400">Instantly navigate to key administration workflows</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="h-full"
              >
                <Link
                  to={action.link}
                  className={`flex flex-col justify-between h-full p-5 rounded-2xl bg-gradient-to-br border border-obsidian-700/50 backdrop-blur-md transition-all duration-300 cursor-pointer shadow-xl ${action.color}`}
                >
                  <div className="space-y-3">
                    <div className={`w-10 h-10 rounded-xl bg-obsidian-900/60 border border-obsidian-700/50 flex items-center justify-center ${action.iconColor} shadow-inner`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-obsidian-100 group-hover:text-gold-400 transition-colors">
                        {action.title}
                      </h4>
                      <p className="text-xs text-obsidian-400 mt-1 leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-gold-400/80 mt-4 group-hover:text-gold-400">
                    Execute <ChevronRight size={12} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enquiries */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-obsidian-850/60 border border-obsidian-700/50 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-obsidian-700/50 bg-obsidian-900/40">
            <div>
              <h3 className="font-bold text-obsidian-100 text-sm">Recent Enquiries</h3>
              <p className="text-[11px] text-obsidian-500 mt-0.5">Most recent design and build requests</p>
            </div>
            <Link to="/admin/enquiries" className="flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 font-semibold transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-obsidian-800/50">
            {enquiriesLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-4 animate-pulse space-y-2">
                  <div className="h-4 bg-obsidian-750 rounded w-1/3" />
                  <div className="h-3 bg-obsidian-750 rounded w-1/2" />
                </div>
              ))
            ) : !recentEnquiries?.length ? (
              <p className="px-6 py-12 text-center text-obsidian-500 text-sm">No enquiries received yet.</p>
            ) : (
              recentEnquiries.map(e => (
                <div key={e.id} className="flex items-center justify-between px-6 py-4 hover:bg-obsidian-800/20 transition-all duration-200">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-obsidian-200 truncate">{e.name}</p>
                    <p className="text-xs text-obsidian-400 truncate mt-0.5">{e.email}</p>
                    <p className="text-[10px] text-obsidian-500 mt-1 font-mono">{formatDateTime(e.created_at)}</p>
                  </div>
                  <span className={`shrink-0 ml-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getStatusColor(e.status)} shadow-sm`}>
                    {e.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-obsidian-850/60 border border-obsidian-700/50 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-obsidian-700/50 bg-obsidian-900/40">
            <div>
              <h3 className="font-bold text-obsidian-100 text-sm">Recent Bookings</h3>
              <p className="text-[11px] text-obsidian-500 mt-0.5">Most recent discovery call schedule requests</p>
            </div>
            <Link to="/admin/bookings" className="flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 font-semibold transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-obsidian-800/50">
            {bookingsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-4 animate-pulse space-y-2">
                  <div className="h-4 bg-obsidian-750 rounded w-1/3" />
                  <div className="h-3 bg-obsidian-750 rounded w-1/2" />
                </div>
              ))
            ) : !recentBookings?.length ? (
              <p className="px-6 py-12 text-center text-obsidian-500 text-sm">No discovery calls booked yet.</p>
            ) : (
              recentBookings.map(b => (
                <div key={b.id} className="flex items-center justify-between px-6 py-4 hover:bg-obsidian-800/20 transition-all duration-200">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-obsidian-200 truncate">{b.name}</p>
                    <p className="text-xs text-obsidian-400 mt-0.5 font-medium flex items-center gap-1.5">
                      <Calendar size={11} className="text-gold-500" />
                      {b.preferred_date ? `${b.preferred_date} @ ${b.preferred_time ?? 'TBC'}` : 'Date TBC'}
                    </p>
                    <p className="text-[10px] text-obsidian-500 mt-1 font-mono">{formatDateTime(b.created_at)}</p>
                  </div>
                  <span className={`shrink-0 ml-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getStatusColor(b.status)} shadow-sm`}>
                    {b.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
