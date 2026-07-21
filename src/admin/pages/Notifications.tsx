// ============================================================
// BuildMySite Admin — Notifications Page
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MessageSquare, Calendar, Settings, CheckCheck, Trash2 } from 'lucide-react';
import { formatDateTime } from '../utils';
import type { Notification, NotificationType } from '../types';

const typeIcon: Record<NotificationType, React.ElementType> = {
  enquiry: MessageSquare,
  booking: Calendar,
  system: Settings,
};

const typeColor: Record<NotificationType, string> = {
  enquiry: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  booking: 'bg-gold-500/10 text-gold-400 border-gold-500/20',
  system: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'enquiry', title: 'New Enquiry Received', message: 'Sophie Carter submitted a website enquiry for a corporate site with a £3,500 budget.', read: false, created_at: new Date(Date.now() - 5 * 60000).toISOString(), link: '/admin/enquiries' },
  { id: 2, type: 'booking', title: 'New Discovery Call Booked', message: 'James Reid has booked a discovery call for Thursday 28th November at 10:00 AM.', read: false, created_at: new Date(Date.now() - 25 * 60000).toISOString(), link: '/admin/bookings' },
  { id: 4, type: 'system', title: 'Server Health Check', message: 'All systems operational. PostgreSQL connection stable. API response time: 45ms.', read: true, created_at: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: 5, type: 'enquiry', title: 'Enquiry Status Updated', message: 'Tom Hughes enquiry status changed from "new" to "contacted".', read: true, created_at: new Date(Date.now() - 24 * 3600000).toISOString(), link: '/admin/enquiries' },
  { id: 6, type: 'booking', title: 'Booking Accepted', message: 'You accepted the discovery call booking for Emma Walsh on 15th December.', read: true, created_at: new Date(Date.now() - 2 * 86400000).toISOString(), link: '/admin/bookings' },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id));

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = filter === 'all' ? notifications : notifications.filter(n => !n.read);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-obsidian-50 flex items-center gap-2">
            <Bell size={22} className="text-gold-400" /> Notifications
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-gold-500/20 border border-gold-500/30 rounded-full text-xs text-gold-400 font-medium">{unreadCount}</span>
            )}
          </h1>
          <p className="text-sm text-obsidian-400 mt-0.5">{unreadCount} unread notifications</p>
        </div>
        <button onClick={markAllRead} disabled={unreadCount === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-obsidian-800 border border-obsidian-700 text-obsidian-300 text-sm hover:text-obsidian-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <CheckCheck size={14} /> Mark all read
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'unread'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border capitalize transition-all ${
              filter === f ? 'bg-gold-500/15 border-gold-500/30 text-gold-400' : 'border-obsidian-700 text-obsidian-400 hover:text-obsidian-200'}`}>
            {f} ({f === 'all' ? notifications.length : unreadCount})
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map((n, i) => {
            const Icon = typeIcon[n.type];
            return (
              <motion.div key={n.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }} transition={{ delay: i * 0.04 }}
                onClick={() => markRead(n.id)}
                className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:border-obsidian-600 ${
                  n.read ? 'bg-obsidian-800/40 border-obsidian-700/50' : 'bg-obsidian-800/80 border-obsidian-600'}`}>
                <div className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center ${typeColor[n.type]}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-semibold ${n.read ? 'text-obsidian-300' : 'text-obsidian-100'}`}>{n.title}</p>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-gold-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-obsidian-400 leading-relaxed mb-1">{n.message}</p>
                  <p className="text-[10px] text-obsidian-600">{formatDateTime(n.created_at)}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); deleteNotif(n.id); }}
                  className="shrink-0 p-1.5 rounded-lg text-obsidian-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 size={13} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-obsidian-500">
            <Bell size={32} className="mx-auto mb-3 text-obsidian-700" />
            <p>No {filter === 'unread' ? 'unread ' : ''}notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
