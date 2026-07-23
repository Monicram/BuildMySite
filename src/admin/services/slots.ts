import adminApi from './api';

export interface Slot {
  id: string; // Virtual ID (date_time)
  date: string;
  start_time: string;
  end_time: string;
  max_bookings: number;
  is_disabled: boolean;
  booked_count: number;
  remaining_capacity: number;
  status: 'Available' | 'Booked' | 'Full' | 'Disabled';
}

export const slotService = {
  getAll: async ({ startDate, endDate }: { startDate?: string; endDate?: string } = {}): Promise<{ data: Slot[]; stats: any }> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const { data } = await adminApi.get(`/slots?${params.toString()}`);
    return { data: data.data, stats: data.stats };
  },

  enable: async (payload: { date: string; start_time: string; end_time: string }): Promise<void> => {
    await adminApi.patch('/slots/enable', payload);
  },

  disable: async (payload: { date: string; start_time: string; end_time: string }): Promise<void> => {
    await adminApi.patch('/slots/disable', payload);
  },
};
