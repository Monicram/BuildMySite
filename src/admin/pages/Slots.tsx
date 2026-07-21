// ============================================================
// BuildMySite Admin — Availability Manager
// ============================================================
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Eye, Pencil } from 'lucide-react';
import DataTable, { type Column } from '../components/DataTable';
import { availabilityService, type Override } from '../services/availability';
import { bookingService } from '../services/booking';
import { formatDate, formatDateTime, getStatusColor, capitalize } from '../utils';
import { formatDisplayTime } from '../../lib/availabilityUtils';
import type { Booking } from '../types';

// ─── Disable Modal ────────────────────────────────────────────────────────────
const DisableModal = ({
  onClose,
  onConfirm,
  isLoading,
  initial,
}: {
  onClose: () => void;
  onConfirm: (date: string, start?: string, end?: string, reason?: string) => void;
  isLoading: boolean;
  initial?: Override;
}) => {
  const [date, setDate] = useState(initial?.date ?? '');
  const [startTime, setStartTime] = useState(initial?.start_time?.substring(0, 5) ?? '');
  const [endTime, setEndTime] = useState(initial?.end_time?.substring(0, 5) ?? '');
  const [reason, setReason] = useState(initial?.reason ?? '');
  const [isWholeDay, setIsWholeDay] = useState(!initial?.start_time);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative bg-obsidian-900 border border-obsidian-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-obsidian-100 mb-5">
          {initial ? 'Edit Disabled Availability' : 'Disable Availability'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-1.5">Date <span className="text-gold-500">*</span></label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-dark" min={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="flex items-center gap-3 py-2">
            <input type="checkbox" id="whole-day" checked={isWholeDay} onChange={e => setIsWholeDay(e.target.checked)} className="checkbox-gold" />
            <label htmlFor="whole-day" className="text-sm text-obsidian-300 cursor-pointer">Disable whole day</label>
          </div>
          {!isWholeDay && (
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
          )}
          <div>
            <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-1.5">Reason (Optional)</label>
            <input type="text" placeholder="e.g. Lunch break, Public Holiday" value={reason} onChange={e => setReason(e.target.value)} className="input-dark" />
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-obsidian-600 text-obsidian-300 text-sm hover:bg-obsidian-800 transition-colors">Cancel</button>
          <button onClick={() => onConfirm(date, isWholeDay ? undefined : startTime, isWholeDay ? undefined : endTime, reason)}
            disabled={isLoading || !date || (!isWholeDay && (!startTime || !endTime))}
            className="flex-1 gold-btn py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Saving…' : initial ? 'Update' : 'Disable'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
type UnifiedRow = {
  id: string;
  type: 'override' | 'booking';
  rawDate: string;
  dateStr: string;
  startTimeStr: string;
  endTimeStr: string;
  status: 'Available' | 'Disabled' | 'Booked';
  customerName?: string;
  bookingStatus?: string;
  disabledReason?: string;
  createdAt: string;
  rawOverride?: Override;
  rawBooking?: Booking;
};

const Slots = () => {
  const queryClient = useQueryClient();
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [editOverride, setEditOverride] = useState<Override | null>(null);

  const { data: overridesData, isLoading: isLoadingOverrides } = useQuery({
    queryKey: ['overrides'],
    queryFn: availabilityService.getAll,
  });

  const { data: bookingsData, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingService.getAll,
  });

  const disableMutation = useMutation({
    mutationFn: availabilityService.disable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overrides'] });
      setIsDisableModalOpen(false);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      alert(error.response?.data?.message || 'Failed to disable availability');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof availabilityService.update>[1] }) =>
      availabilityService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overrides'] });
      setEditOverride(null);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      alert(error.response?.data?.message || 'Failed to update override');
    },
  });

  const enableMutation = useMutation({
    mutationFn: availabilityService.enable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overrides'] });
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: bookingService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const overrides = overridesData ?? [];
  const bookings = bookingsData?.data ?? [];

  const rows: UnifiedRow[] = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = -30; i <= 90; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const day = d.getDay();
    if (day === 0 || day === 6) {
      const dateString = d.toISOString().split('T')[0];
      rows.push({
        id: `weekend-${dateString}`,
        type: 'override',
        rawDate: dateString,
        dateStr: formatDate(dateString),
        startTimeStr: 'Whole Day',
        endTimeStr: 'Whole Day',
        status: 'Disabled',
        disabledReason: 'Weekend (Non-Working Day)',
        createdAt: d.toISOString(),
      });
    }
  }

  overrides.forEach(o => {
    const d = new Date(o.date);
    if (d.getDay() === 0 || d.getDay() === 6) return;

    rows.push({
      id: `override-${o.id}`,
      type: 'override',
      rawDate: o.date,
      dateStr: formatDate(o.date),
      startTimeStr: o.start_time ? formatDisplayTime(o.start_time) : 'Whole Day',
      endTimeStr: o.end_time ? formatDisplayTime(o.end_time) : 'Whole Day',
      status: 'Disabled',
      disabledReason: o.reason || '—',
      createdAt: o.created_at,
      rawOverride: o,
    });
  });

  bookings.forEach(b => {
    if (b.status === 'pending' || b.status === 'accepted') {
      rows.push({
        id: `booking-${b.id}`,
        type: 'booking',
        rawDate: b.preferred_date || b.created_at,
        dateStr: formatDate(b.preferred_date),
        startTimeStr: b.preferred_time ? formatDisplayTime(b.preferred_time) : '—',
        endTimeStr: b.preferred_end_time ? formatDisplayTime(b.preferred_end_time) : '—',
        status: 'Booked',
        customerName: b.name,
        bookingStatus: b.status,
        disabledReason: '—',
        createdAt: b.created_at,
        rawBooking: b,
      });
    }
  });

  rows.sort((a, b) => {
    const d1 = new Date(a.rawDate).getTime();
    const d2 = new Date(b.rawDate).getTime();
    if (d1 !== d2) return d2 - d1;
    return a.startTimeStr.localeCompare(b.startTimeStr);
  });

  const columns: Column<UnifiedRow>[] = [
    {
      key: 'dateStr', label: 'Date', sortable: true,
      render: row => (
        <div className="flex items-center gap-2">
          <CalendarIcon size={14} className="text-gold-400/60" />
          <span className="text-obsidian-200 font-medium">{row.dateStr}</span>
        </div>
      ),
    },
    {
      key: 'startTimeStr', label: 'Start Time',
      render: row => (
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-obsidian-500" />
          <span className="text-obsidian-300">{row.startTimeStr}</span>
        </div>
      ),
    },
    {
      key: 'endTimeStr', label: 'End Time',
      render: row => <span className="text-obsidian-300">{row.endTimeStr}</span>,
    },
    {
      key: 'status', label: 'Status',
      render: row => {
        const colors = {
          Booked: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
          Disabled: 'text-red-400 border-red-500/30 bg-red-500/10',
          Available: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
        };
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[row.status]}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      key: 'customerName', label: 'Customer Name',
      render: row => <span className="text-obsidian-300">{row.customerName || '—'}</span>,
    },
    {
      key: 'bookingStatus', label: 'Booking Status',
      render: row => row.bookingStatus ? (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(row.bookingStatus)}`}>
          {capitalize(row.bookingStatus)}
        </span>
      ) : (
        <span className="text-obsidian-600 text-xs">—</span>
      ),
    },
    {
      key: 'disabledReason', label: 'Disabled Reason',
      render: row => <span className="text-obsidian-400 text-xs">{row.disabledReason}</span>,
    },
    {
      key: 'createdAt', label: 'Created Date', sortable: true,
      render: row => <span className="text-obsidian-400 text-xs">{formatDateTime(row.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-obsidian-50 flex items-center gap-2">
            <Clock size={22} className="text-gold-400" /> Availability Manager
          </h1>
          <p className="text-sm text-obsidian-400 mt-0.5">Manage disabled times and view active bookings. Days are available 09:00 AM – 09:00 PM by default.</p>
        </div>
        <button
          onClick={() => setIsDisableModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl gold-btn text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Disable Date/Time
        </button>
      </div>

      <div className="bg-obsidian-800/40 border border-obsidian-700/50 rounded-2xl p-6">
        <DataTable
          columns={columns}
          data={rows}
          isLoading={isLoadingOverrides || isLoadingBookings}
          searchKeys={['customerName', 'dateStr', 'startTimeStr', 'disabledReason'] as never[]}
          pageSize={15}
          emptyMessage="No blocked times or active bookings yet."
          actions={row => {
            if (row.type === 'override') {
              if (!row.rawOverride) return null; // Hide actions for generated weekends
              return (
                <>
                  <button
                    onClick={() => setEditOverride(row.rawOverride!)}
                    title="Edit"
                    className="p-1.5 rounded-lg text-obsidian-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => { if (confirm('Re-enable this time?')) enableMutation.mutate(row.rawOverride!.id); }}
                    title="Enable"
                    className="p-1.5 rounded-lg text-obsidian-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </>
              );
            }
            if (row.type === 'booking') {
              return (
                <>
                  <a href="/admin/bookings" title="View Booking"
                    className="p-1.5 inline-block rounded-lg text-obsidian-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                    <Eye size={15} />
                  </a>
                  <button
                    onClick={() => { if (confirm(`Delete booking for ${row.customerName}?`)) deleteBookingMutation.mutate(row.rawBooking!.id); }}
                    title="Delete"
                    className="p-1.5 rounded-lg text-obsidian-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </>
              );
            }
            return null;
          }}
        />
      </div>

      <AnimatePresence>
        {isDisableModalOpen && (
          <DisableModal
            onClose={() => setIsDisableModalOpen(false)}
            isLoading={disableMutation.isPending}
            onConfirm={(date, start_time, end_time, reason) =>
              disableMutation.mutate({ date, start_time, end_time, reason })
            }
          />
        )}
        {editOverride && (
          <DisableModal
            initial={editOverride}
            onClose={() => setEditOverride(null)}
            isLoading={updateMutation.isPending}
            onConfirm={(date, start_time, end_time, reason) =>
              updateMutation.mutate({
                id: editOverride.id,
                payload: {
                  date,
                  start_time: start_time ?? null,
                  end_time: end_time ?? null,
                  reason: reason ?? null,
                },
              })
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Slots;
