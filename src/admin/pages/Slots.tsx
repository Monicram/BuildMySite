// ============================================================
// BuildMySite Admin — Slot Management
// ============================================================
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Pencil, CheckCircle, Ban, Users } from 'lucide-react';
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

// ─── Slot Form Modal ──────────────────────────────────────────────────────────
const SlotModal = ({
  onClose,
  onSave,
  isLoading,
  initial,
}: {
  onClose: () => void;
  onSave: (payload: any) => void;
  isLoading: boolean;
  initial?: Slot;
}) => {
  const [date, setDate] = useState(initial?.date?.split('T')[0] ?? '');
  const [startTime, setStartTime] = useState(initial?.start_time?.substring(0, 5) ?? '');
  const [endTime, setEndTime] = useState(initial?.end_time?.substring(0, 5) ?? '');
  const [maxBookings, setMaxBookings] = useState(initial?.max_bookings ?? 1);

  const handleSubmit = () => {
    if (!date || !startTime || !endTime || maxBookings < 1) return;
    onSave({ date, start_time: startTime, end_time: endTime, max_bookings: maxBookings });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative bg-obsidian-900 border border-obsidian-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-obsidian-100 mb-5">
          {initial ? 'Edit Slot' : 'Create New Slot'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-1.5">Date <span className="text-gold-500">*</span></label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-dark" min={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-1.5">Start Time <span className="text-gold-500">*</span></label>
              <input type="time" min="09:00" max="21:00" value={startTime} onChange={e => setStartTime(e.target.value)} className="input-dark" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-1.5">End Time <span className="text-gold-500">*</span></label>
              <input type="time" min="09:00" max="21:00" value={endTime} onChange={e => setEndTime(e.target.value)} className="input-dark" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-1.5">Maximum Bookings <span className="text-gold-500">*</span></label>
            <input type="number" min="1" value={maxBookings} onChange={e => setMaxBookings(parseInt(e.target.value) || 1)} className="input-dark" />
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-obsidian-600 text-obsidian-300 text-sm hover:bg-obsidian-800 transition-colors">Cancel</button>
          <button onClick={handleSubmit}
            disabled={isLoading || !date || !startTime || !endTime || maxBookings < 1}
            className="flex-1 gold-btn py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Saving…' : initial ? 'Update Slot' : 'Create Slot'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Slots = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSlot, setEditSlot] = useState<Slot | null>(null);

  const { data: slotData, isLoading } = useQuery({
    queryKey: ['slots'],
    queryFn: slotService.getAll,
  });

  const slots = slotData?.data || [];
  const stats = slotData?.stats || { total: 0, available: 0, booked: 0, full: 0, disabled: 0 };

  const createMutation = useMutation({
    mutationFn: slotService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to create slot');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => slotService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      setEditSlot(null);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to update slot');
    },
  });

  const enableMutation = useMutation({
    mutationFn: (id: number) => slotService.enable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to enable slot');
    },
  });

  const disableMutation = useMutation({
    mutationFn: (id: number) => slotService.disable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to disable slot');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: slotService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to delete slot');
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
            onClick={() => setEditSlot(row)}
            title="Edit Slot"
            className="p-1.5 rounded-lg text-obsidian-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to ${row.is_disabled ? 'enable' : 'disable'} this slot?`)) {
                if (row.is_disabled) {
                  enableMutation.mutate(row.id);
                } else {
                  disableMutation.mutate(row.id);
                }
              }
            }}
            title={row.is_disabled ? "Enable Slot" : "Disable Slot"}
            className={`p-1.5 rounded-lg transition-colors ${
              row.is_disabled 
                ? 'text-obsidian-400 hover:text-emerald-400 hover:bg-emerald-500/10' 
                : 'text-obsidian-400 hover:text-amber-400 hover:bg-amber-500/10'
            }`}
          >
            {row.is_disabled ? <CheckCircle size={15} /> : <Ban size={15} />}
          </button>
          <button
            onClick={() => {
              if (row.booked_count > 0) {
                alert('Cannot delete a slot with existing bookings.');
                return;
              }
              if (confirm('Are you sure you want to delete this slot?')) {
                deleteMutation.mutate(row.id);
              }
            }}
            title="Delete Slot"
            className={`p-1.5 rounded-lg transition-colors ${
              row.booked_count > 0
                ? 'text-obsidian-600 cursor-not-allowed'
                : 'text-obsidian-400 hover:text-red-400 hover:bg-red-500/10'
            }`}
          >
            <Trash2 size={15} />
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
            <Clock size={22} className="text-gold-400" /> Slot Management
          </h1>
          <p className="text-sm text-obsidian-400 mt-0.5">
            Manage your availability slots and booking capacities.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl gold-btn text-sm font-medium transition-colors shadow-lg shadow-gold-500/10"
        >
          <Plus size={16} /> Create Slot
        </button>
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
          pageSize={10}
          emptyMessage="No slots created yet. Create a slot to get started."
        />
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isModalOpen && (
          <SlotModal
            onClose={() => setIsModalOpen(false)}
            isLoading={createMutation.isPending}
            onSave={payload => createMutation.mutate(payload)}
          />
        )}
        {editSlot && (
          <SlotModal
            initial={editSlot}
            onClose={() => setEditSlot(null)}
            isLoading={updateMutation.isPending}
            onSave={payload => updateMutation.mutate({ id: editSlot.id, payload })}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Slots;
