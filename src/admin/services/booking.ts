// ============================================================
// BuildMySite Admin — Booking Service
// ============================================================
import adminApi from './api';
import type { BookingsResponse, Booking, ApiResponse, BookingStatus } from '../types';

export const bookingService = {
  /**
   * GET /api/bookings — fetch all
   */
  getAll: async (): Promise<BookingsResponse> => {
    const { data } = await adminApi.get<BookingsResponse>('/bookings');
    return data;
  },

  /**
   * GET /api/bookings/:id
   */
  getById: async (id: number): Promise<Booking> => {
    const { data } = await adminApi.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return data.data;
  },

  /**
   * PUT /api/bookings/:id — update status (accept/reject/reschedule)
   */
  updateStatus: async (
    id: number,
    status: BookingStatus,
    extra?: Partial<Booking>
  ): Promise<Booking> => {
    const existing = await bookingService.getById(id);
    const { data } = await adminApi.put<ApiResponse<Booking>>(`/bookings/${id}`, {
      ...existing,
      ...extra,
      status,
    });
    return data.data;
  },

  /**
   * PUT /api/bookings/:id — full update
   */
  update: async (id: number, payload: Partial<Booking>): Promise<Booking> => {
    const { data } = await adminApi.put<ApiResponse<Booking>>(`/bookings/${id}`, payload);
    return data.data;
  },

  /**
   * DELETE /api/bookings/:id
   */
  delete: async (id: number): Promise<void> => {
    await adminApi.delete(`/bookings/${id}`);
  },
};
