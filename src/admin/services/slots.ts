import adminApi from './api';

export interface Slot {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  max_bookings: number;
  is_disabled: boolean;
  booked_count: number;
  remaining_capacity: number;
  status: 'Available' | 'Booked' | 'Full' | 'Disabled';
  created_at: string;
}

export const slotService = {
  getAll: async (): Promise<{ data: Slot[]; stats: any }> => {
    const { data } = await adminApi.get('/slots');
    return { data: data.data, stats: data.stats };
  },

  create: async (payload: { date: string; start_time: string; end_time: string; max_bookings: number }): Promise<Slot> => {
    const { data } = await adminApi.post('/slots', payload);
    return data.data;
  },

  update: async (id: number, payload: { date?: string; start_time?: string; end_time?: string; max_bookings?: number }): Promise<Slot> => {
    const { data } = await adminApi.put(`/slots/${id}`, payload);
    return data.data;
  },

  delete: async (id: number): Promise<void> => {
    await adminApi.delete(`/slots/${id}`);
  },

  enable: async (id: number): Promise<Slot> => {
    const { data } = await adminApi.patch(`/slots/${id}/enable`);
    return data.data;
  },

  disable: async (id: number): Promise<Slot> => {
    const { data } = await adminApi.patch(`/slots/${id}/disable`);
    return data.data;
  },
};
