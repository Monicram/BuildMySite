import adminApi from './api';

export interface Override {
  id: number;
  date: string;
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
  created_at: string;
}

export const availabilityService = {
  getAll: async (): Promise<Override[]> => {
    const { data } = await adminApi.get('/availability');
    return data.data;
  },

  check: async (date: string): Promise<{
    dayDisabled: boolean;
    disabledRanges: { start: string; end: string }[];
    bookedRanges: { start: string; end: string }[];
  }> => {
    const { data } = await adminApi.get(`/availability/check?date=${date}`);
    return data;
  },

  disable: async (payload: { date: string; start_time?: string; end_time?: string; reason?: string }): Promise<Override> => {
    const { data } = await adminApi.post('/availability/disable', payload);
    return data.data;
  },

  enable: async (id: number): Promise<void> => {
    await adminApi.delete(`/availability/disable/${id}`);
  },

  update: async (id: number, payload: { date?: string; start_time?: string | null; end_time?: string | null; reason?: string | null }): Promise<Override> => {
    const { data } = await adminApi.put(`/availability/disable/${id}`, payload);
    return data.data;
  },
};
