// ============================================================
// BuildMySite Admin — Slot Management
// ============================================================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, CheckCircle, Ban, Users } from 'lucide-react';
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

// ─── Main Component ───────────────────────────────────────────────────────────
const Slots = () => {
  const queryClient = useQueryClient();

  const { data: slotData, isLoading } = useQuery({
    queryKey: ['slots'],
    queryFn: slotService.getAll,
  });

  const slots = slotData?.data || [];
  const stats = slotData?.stats || { total: 0, available: 0, booked: 0, full: 0, disabled: 0 };

  const enableMutation = useMutation({
    mutationFn: (payload: { date: string; start_time: string; end_time: string }) => slotService.enable(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to enable slot');
    },
  });

  const disableMutation = useMutation({
    mutationFn: (payload: { date: string; start_time: string; end_time: string }) => slotService.disable(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to disable slot');
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
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to ${row.is_disabled ? 'enable' : 'disable'} this slot?`)) {
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
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
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
          searchKeys={['date', 'status'] as never[]}
          pageSize={15}
          emptyMessage="No working slots found."
        />
      </div>
    </div>
  );
};

export default Slots;
