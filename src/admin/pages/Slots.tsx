// ============================================================
// BuildMySite Admin — Slot Management
// ============================================================
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, CheckCircle, Ban, Users, Eye, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable, { type Column } from '../components/DataTable';
import { slotService, type Slot } from '../services/slots';
import { formatDate } from '../utils';
import { formatDisplayTime } from '../../lib/availabilityUtils';

// ─── Stat Card Component ──────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, colorClass }: { title: string; value: number; icon: any; colorClass: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-obsidian-800/40 border border-obsidian-700/50 rounded-2xl p-5 flex items-center justify-between"
  >
    <div>
      <p className="text-obsidian-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-obsidian-50">{value}</h3>
    </div>
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <Icon size={20} />
    </div>
  </motion.div>
);

// ─── Toast Component ──────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.9 }}
    className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border ${
      type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
    }`}
  >
    {type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
    <p className="text-sm font-medium">{message}</p>
    <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity"><XCircle size={16} /></button>
  </motion.div>
);

type DateRangeFilter = 'Today' | 'Tomorrow' | 'This Week' | 'Next 30 Days' | 'Custom';

// ─── Main Component ───────────────────────────────────────────────────────────
const Slots = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter>('Next 30 Days');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const { startDate, endDate } = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    let start = new Date(today);
    let end = new Date(today);

    if (dateRangeFilter === 'Today') {
      end = new Date(today);
    } else if (dateRangeFilter === 'Tomorrow') {
      start.setDate(today.getDate() + 1);
      end = new Date(start);
    } else if (dateRangeFilter === 'This Week') {
      // Assuming week ends on Sunday (+ (7 - dayOfWeek))
      const day = today.getDay() || 7; 
      end.setDate(today.getDate() + (7 - day));
    } else if (dateRangeFilter === 'Next 30 Days') {
      end.setDate(today.getDate() + 29);
    } else if (dateRangeFilter === 'Custom') {
      return { 
        startDate: customStart || undefined, 
        endDate: customEnd || undefined 
      };
    }

    // Offset timezone correctly for formatting to YYYY-MM-DD
    start.setMinutes(start.getMinutes() - start.getTimezoneOffset());
    end.setMinutes(end.getMinutes() - end.getTimezoneOffset());

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }, [dateRangeFilter, customStart, customEnd]);

  const { data: slotData, isLoading } = useQuery({
    queryKey: ['slots', startDate, endDate],
    queryFn: () => slotService.getAll({ startDate, endDate }),
    refetchInterval: 10000, // Real-time sync every 10s
  });

  const slots = slotData?.data || [];
  const stats = slotData?.stats || { total: 0, available: 0, booked: 0, full: 0, disabled: 0 };

  const enableMutation = useMutation({
    mutationFn: (payload: { date: string; start_time: string; end_time: string }) => slotService.enable(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      showToast('Slot enabled successfully.', 'success');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Failed to enable slot.', 'error');
    },
  });

  const disableMutation = useMutation({
    mutationFn: (payload: { date: string; start_time: string; end_time: string }) => slotService.disable(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      showToast('Slot disabled successfully.', 'success');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Failed to disable slot.', 'error');
    },
  });

  const columns: Column<Slot>[] = [
    {
      key: 'date', label: 'Date', sortable: true,
      render: row => (
        <div className="flex items-center gap-2">
          <CalendarIcon size={14} className="text-gold-400/60" />
          <span className="text-obsidian-200 font-medium">{formatDate(row.date)}</span>
        </div>
      ),
    },
    {
      key: 'start_time', label: 'Time',
      render: row => (
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-obsidian-500" />
          <span className="text-obsidian-300">
            {formatDisplayTime(row.start_time)} - {formatDisplayTime(row.end_time)}
          </span>
        </div>
      ),
    },
    {
      key: 'status', label: 'Status', sortable: true,
      render: row => {
        const colors = {
          Available: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
          Booked: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
          Full: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
          Disabled: 'text-red-400 border-red-500/30 bg-red-500/10',
        };
        return (
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${colors[row.status]}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      key: 'booked_count', label: 'Capacity',
      render: row => (
        <div className="flex flex-col">
          <span className="text-obsidian-200 font-medium text-sm">
            {row.booked_count} / {row.max_bookings}
          </span>
          <span className="text-obsidian-500 text-[10px] uppercase tracking-wider">
            {row.remaining_capacity} remaining
          </span>
        </div>
      ),
    },
    {
      key: 'id', label: 'Actions',
      render: row => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const payload = {
                date: row.date,
                start_time: row.start_time,
                end_time: row.end_time,
              };
              if (row.is_disabled) {
                enableMutation.mutate(payload);
              } else {
                disableMutation.mutate(payload);
              }
            }}
            title={row.is_disabled ? "Enable Slot" : "Disable Slot"}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              row.is_disabled 
                ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20' 
                : 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
            }`}
          >
            {row.is_disabled ? <><CheckCircle size={14} /> Enable</> : <><Ban size={14} /> Disable</>}
          </button>
          
          <button
            onClick={() => navigate(`/admin/bookings?date=${row.date}&time=${row.start_time}`)}
            title="View Booking Details"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition-colors flex items-center gap-1.5"
          >
            <Eye size={14} /> View
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-obsidian-50 flex items-center gap-2">
            <Clock size={22} className="text-gold-400" /> Availability Manager
          </h1>
          <p className="text-sm text-obsidian-400 mt-0.5">
            Manage your daily availability slots and monitor booking capacities.
          </p>
        </div>
        
        {/* Date Filter */}
        <div className="flex items-center gap-3">
          <select
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value as DateRangeFilter)}
            className="px-4 py-2 bg-obsidian-800 border border-obsidian-700 rounded-xl text-sm text-obsidian-200 focus:outline-none focus:border-gold-500 transition-colors"
          >
            {['Today', 'Tomorrow', 'This Week', 'Next 30 Days', 'Custom'].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {dateRangeFilter === 'Custom' && (
            <div className="flex items-center gap-2">
              <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="px-3 py-1.5 bg-obsidian-800 border border-obsidian-700 rounded-xl text-sm text-obsidian-200 focus:outline-none focus:border-gold-500" />
              <span className="text-obsidian-500">to</span>
              <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="px-3 py-1.5 bg-obsidian-800 border border-obsidian-700 rounded-xl text-sm text-obsidian-200 focus:outline-none focus:border-gold-500" />
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="Total Slots" value={stats.total} icon={CalendarIcon} colorClass="bg-obsidian-700/50 text-obsidian-300" />
        <StatCard title="Available" value={stats.available} icon={CheckCircle} colorClass="bg-emerald-500/10 text-emerald-400" />
        <StatCard title="Booked" value={stats.booked} icon={Users} colorClass="bg-blue-500/10 text-blue-400" />
        <StatCard title="Full" value={stats.full} icon={Clock} colorClass="bg-amber-500/10 text-amber-400" />
        <StatCard title="Disabled" value={stats.disabled} icon={Ban} colorClass="bg-red-500/10 text-red-400" />
      </div>

      {/* Data Table */}
      <div className="bg-obsidian-800/40 border border-obsidian-700/50 rounded-2xl p-6 shadow-xl">
        <DataTable
          columns={columns}
          data={slots}
          isLoading={isLoading}
          searchKeys={['date', 'start_time', 'status'] as never[]}
          filterOptions={[{ key: 'status' as never, label: 'All Statuses', options: ['Available', 'Booked', 'Full', 'Disabled'] }]}
          pageSize={10}
          emptyMessage="No working slots found for this date range."
        />
      </div>

      <AnimatePresence>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Slots;
