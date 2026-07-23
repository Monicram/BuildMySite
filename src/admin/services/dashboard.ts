// ============================================================
// BuildMySite Admin — Dashboard Stats Service
// ============================================================
import adminApi from './api';
import type {
  EnquiriesResponse,
  BookingsResponse,
  MonthlyDataPoint,
  StatusDistribution,
  DashboardStats,
} from '../types';

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await adminApi.get<{ data: DashboardStats }>('/dashboard/stats');
    return data.data;
  },

  getMonthlyData: async (): Promise<MonthlyDataPoint[]> => {
    const [enqRes, bkgRes] = await Promise.all([
      adminApi.get<EnquiriesResponse>('/enquiries'),
      adminApi.get<BookingsResponse>('/bookings'),
    ]);

    const enquiries = enqRes.data.data;
    const bookings = bkgRes.data.data;

    const months: MonthlyDataPoint[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      const monthMatch = (dateStr: string) => {
        const date = new Date(dateStr);
        return (
          date.getMonth() === d.getMonth() &&
          date.getFullYear() === d.getFullYear()
        );
      };
      const monthEnq = enquiries.filter(e => monthMatch(e.created_at)).length;
      const monthBkg = bookings.filter(b => monthMatch(b.created_at)).length;
      months.push({
        month: label,
        enquiries: monthEnq,
        bookings: monthBkg,
        revenue: monthBkg * 2500, // estimated avg revenue per booking
      });
    }
    return months;
  },

  getEnquiryStatusDistribution: async (): Promise<StatusDistribution[]> => {
    const { data } = await adminApi.get<EnquiriesResponse>('/enquiries');
    const enquiries = data.data;

    const statusGroups = enquiries.reduce<Record<string, number>>((acc, e) => {
      acc[e.status] = (acc[e.status] || 0) + 1;
      return acc;
    }, {});

    const colorMap: Record<string, string> = {
      new: '#3B82F6',
      contacted: '#F59E0B',
      in_progress: '#8B5CF6',
      closed: '#10B981',
      rejected: '#EF4444',
    };

    return Object.entries(statusGroups).map(([name, value]) => ({
      name,
      value,
      color: colorMap[name] ?? '#D4AF37',
    }));
  },

  getBookingStatusDistribution: async (): Promise<StatusDistribution[]> => {
    const { data } = await adminApi.get<BookingsResponse>('/bookings');
    const bookings = data.data;

    const statusGroups = bookings.reduce<Record<string, number>>((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {});

    const colorMap: Record<string, string> = {
      pending: '#F59E0B',
      accepted: '#10B981',
      rejected: '#EF4444',
      rescheduled: '#3B82F6',

    };

    return Object.entries(statusGroups).map(([name, value]) => ({
      name,
      value,
      color: colorMap[name] ?? '#D4AF37',
    }));
  },
};
