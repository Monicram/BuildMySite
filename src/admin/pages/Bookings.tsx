// ============================================================
// BuildMySite Admin — Bookings Page
// ============================================================
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Calendar, Check, X, Trash2, Eye, RefreshCw, Clock } from 'lucide-react';
import DataTable, { type Column } from '../components/DataTable';
import { bookingService } from '../services/booking';
import { formatDate, formatDateTime, getStatusColor, capitalize } from '../utils';
import type { Booking, BookingStatus } from '../types';

const STATUSES: BookingStatus[] = ['pending', 'accepted', 'rejected', 'rescheduled', 'completed'];

// ─── Time formatting ──────────────────────────────────────────────────────────
function formatDisplayTime(time?: string | null): string {
  if (!time) return '—';
  const [hStr, mStr] = time.split(':');
  const h    = parseInt(hStr, 10);
  const m    = parseInt(mStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = h % 12 === 0 ? 12 : h % 12;
  return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

// ─── Reschedule Modal ─────────────────────────────────────────────────────────
const RescheduleModal = ({
  booking, onClose, onConfirm, isLoading,
}: { booking: Booking; onClose: () => void; onConfirm: (d: string, t: string) => void; isLoading: boolean }) => {
  const [date, setDate] = useState(booking.preferred_date ?? '');
  const [time, setTime] = useState(booking.preferred_time ?? '');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative bg-obsidian-900 border border-obsidian-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-obsidian-100 mb-1">Reschedule Booking</h2>
        <p className="text-sm text-obsidian-400 mb-5">For {booking.name}</p>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-1.5">New Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-dark" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-1.5">New Time</label>
            <input type="time" min="09:00" max="20:00" value={time} onChange={e => setTime(e.target.value)} className="input-dark" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-obsidian-600 text-obsidian-300 text-sm hover:bg-obsidian-800 transition-colors">Cancel</button>
          <button onClick={() => onConfirm(date, time)} disabled={isLoading || !date}
            className="flex-1 gold-btn py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
            {isLoading ? 'Saving…' : 'Confirm'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Booking Detail Modal ─────────────────────────────────────────────────────
const BookingModal = ({
  booking, onClose, onAction, isUpdating, onReschedule,
}: { booking: Booking; onClose: () => void; onAction: (s: BookingStatus) => void; isUpdating: boolean; onReschedule: () => void }) => {
  const slotStart   = booking.preferred_time;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        className="relative bg-obsidian-900 border border-obsidian-700 rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-obsidian-900 border-b border-obsidian-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-obsidian-100 text-lg">{booking.name}</h2>
            <p className="text-sm text-obsidian-400">{booking.email}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-obsidian-400 hover:text-obsidian-100 hover:bg-obsidian-800 transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-5">
          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {['accepted', 'rejected'].map(s => (
              <button key={s} onClick={() => onAction(s as BookingStatus)} disabled={isUpdating || booking.status === s}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  s === 'accepted'
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20'
                }`}>
                {s === 'accepted' ? <Check size={14} /> : <X size={14} />}
                {capitalize(s)}
              </button>
            ))}
            <button onClick={onReschedule} disabled={isUpdating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <Clock size={14} /> Reschedule
            </button>
          </div>

          {/* Booking details grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              ['Phone',        booking.phone],
              ['Company',      booking.company],
              ['Budget',       booking.budget_range],
              ['Date',         formatDate(booking.preferred_date)],
              ['Time',         formatDisplayTime(slotStart)],
              ['Submitted',    formatDateTime(booking.created_at)],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs font-semibold text-obsidian-500 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-sm text-obsidian-200">{value ?? '—'}</p>
              </div>
            ))}
          </div>



          {/* Booking status */}
          <div>
            <p className="text-xs font-semibold text-obsidian-500 uppercase tracking-wider mb-2">Booking Status</p>
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>{capitalize(booking.status)}</span>
          </div>

          {booking.notes && (
            <div>
              <p className="text-xs font-semibold text-obsidian-500 uppercase tracking-wider mb-2">Notes</p>
              <p className="text-sm text-obsidian-300 bg-obsidian-800 rounded-xl p-4 leading-relaxed">{booking.notes}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Bookings = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<Booking | null>(null);

  const defaultSearch = [searchParams.get('date'), searchParams.get('time')].filter(Boolean).join(' ');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingService.getAll,
    staleTime: 30_000,
  });
  const bookings = data?.data ?? [];

  const updateMutation = useMutation({
    mutationFn: ({ id, status, extra }: { id: number; status: BookingStatus; extra?: Partial<Booking> }) =>
      bookingService.updateStatus(id, status, extra),
    onSuccess: updated => {
      queryClient.setQueryData(['bookings'], (old: typeof data) => {
        if (!old) return old;
        return { ...old, data: old.data.map((b: Booking) => (b.id === updated.id ? updated : b)) };
      });
      setSelectedBooking(prev => (prev?.id === updated.id ? updated : prev));
      setRescheduleTarget(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: bookingService.delete,
    onSuccess: (_, id) => {
      queryClient.setQueryData(['bookings'], (old: typeof data) => {
        if (!old) return old;
        return { ...old, data: old.data.filter((b: Booking) => b.id !== id), count: old.count - 1 };
      });
      if (selectedBooking?.id === id) setSelectedBooking(null);
    },
  });

  const columns: Column<Booking>[] = [
    {
      key: 'id', label: '#', sortable: true, className: 'w-12',
      render: row => <span className="text-obsidian-500 text-xs">#{row.id}</span>,
    },
    {
      key: 'name', label: 'Customer', sortable: true,
      render: row => (
        <div>
          <p className="font-medium text-obsidian-100">{row.name}</p>
          <p className="text-xs text-obsidian-500">{(row as any).company ?? row.email}</p>
          <p className="text-[10px] text-obsidian-400">{row.phone}</p>
        </div>
      ),
    },
    {
      key: 'preferred_date', label: 'Booking Date', sortable: true,
      render: row => (
        <span className="text-obsidian-300 text-sm">
          {row.preferred_date ? formatDate(row.preferred_date) : '—'}
        </span>
      ),
    },
    {
      key: 'preferred_time', label: 'Time', sortable: true,
      render: row => {
        const slotStart = row.preferred_time;
        return (
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-gold-400/60" />
            <span className="text-obsidian-200 text-sm">{formatDisplayTime(slotStart)}</span>
          </div>
        );
      },
    },

    {
      key: 'status', label: 'Booking Status', sortable: true,
      render: row => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(row.status)}`}>
          {capitalize(row.status)}
        </span>
      ),
    },
    {
      key: 'created_at', label: 'Created', sortable: true,
      render: row => <span className="text-obsidian-400 text-xs">{formatDateTime(row.created_at)}</span>,
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-obsidian-50 flex items-center gap-2">
            <Calendar size={22} className="text-gold-400" /> Discovery Bookings
          </h1>
          <p className="text-sm text-obsidian-400 mt-0.5">{bookings.length} total bookings</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-obsidian-800 border border-obsidian-700 text-obsidian-300 text-sm hover:text-obsidian-100 transition-colors"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="bg-obsidian-800/40 border border-obsidian-700/50 rounded-2xl p-6">
        <DataTable
          columns={columns}
          data={bookings}
          isLoading={isLoading}
          searchKeys={['name', 'email', 'company', 'status', 'preferred_date', 'preferred_time'] as never[]}
          filterOptions={[{ key: 'status' as never, label: 'All Statuses', options: STATUSES }]}
          defaultSearch={defaultSearch}
          pageSize={10}
          emptyMessage="No bookings yet."
          actions={row => {
            const b = row as unknown as Booking;
            return (
              <>
                <button onClick={() => setSelectedBooking(b)} title="View"
                  className="p-1.5 rounded-lg text-obsidian-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"><Eye size={15} /></button>
                <button onClick={() => updateMutation.mutate({ id: b.id, status: 'accepted' })} title="Accept"
                  className="p-1.5 rounded-lg text-obsidian-400 hover:text-green-400 hover:bg-green-500/10 transition-colors"><Check size={15} /></button>
                <button onClick={() => updateMutation.mutate({ id: b.id, status: 'rejected' })} title="Reject"
                  className="p-1.5 rounded-lg text-obsidian-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><X size={15} /></button>
                <button onClick={() => setRescheduleTarget(b)} title="Reschedule"
                  className="p-1.5 rounded-lg text-obsidian-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"><Clock size={15} /></button>
                <button onClick={() => { if (confirm(`Delete booking for ${b.name}?`)) deleteMutation.mutate(b.id); }} title="Delete"
                  className="p-1.5 rounded-lg text-obsidian-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={15} /></button>
              </>
            );
          }}
        />
      </div>

      <AnimatePresence>
        {selectedBooking && !rescheduleTarget && (
          <BookingModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            onAction={status => updateMutation.mutate({ id: selectedBooking.id, status })}
            isUpdating={updateMutation.isPending}
            onReschedule={() => setRescheduleTarget(selectedBooking)}
          />
        )}
        {rescheduleTarget && (
          <RescheduleModal
            booking={rescheduleTarget}
            onClose={() => setRescheduleTarget(null)}
            onConfirm={(date, time) =>
              updateMutation.mutate({
                id: rescheduleTarget.id,
                status: 'rescheduled',
                extra: { preferred_date: date, preferred_time: time },
              })
            }
            isLoading={updateMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bookings;
