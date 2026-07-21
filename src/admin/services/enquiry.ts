// ============================================================
// BuildMySite Admin — Enquiry Service
// ============================================================
import adminApi from './api';
import type { EnquiriesResponse, Enquiry, ApiResponse, EnquiryStatus } from '../types';

export const enquiryService = {
  /**
   * GET /api/enquiries — fetch all
   */
  getAll: async (): Promise<EnquiriesResponse> => {
    const { data } = await adminApi.get<EnquiriesResponse>('/enquiries');
    return data;
  },

  /**
   * GET /api/enquiries/:id
   */
  getById: async (id: number): Promise<Enquiry> => {
    const { data } = await adminApi.get<ApiResponse<Enquiry>>(`/enquiries/${id}`);
    return data.data;
  },

  /**
   * PUT /api/enquiries/:id — update status only
   */
  updateStatus: async (id: number, status: EnquiryStatus): Promise<Enquiry> => {
    const existing = await enquiryService.getById(id);
    const { data } = await adminApi.put<ApiResponse<Enquiry>>(`/enquiries/${id}`, {
      ...existing,
      status,
    });
    return data.data;
  },

  /**
   * PUT /api/enquiries/:id — full update
   */
  update: async (id: number, payload: Partial<Enquiry>): Promise<Enquiry> => {
    const { data } = await adminApi.put<ApiResponse<Enquiry>>(`/enquiries/${id}`, payload);
    return data.data;
  },

  /**
   * DELETE /api/enquiries/:id
   */
  delete: async (id: number): Promise<void> => {
    await adminApi.delete(`/enquiries/${id}`);
  },
};
