import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Axios instance with base config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ─── TypeScript Interfaces ─────────────────────────────────────────────────────

export interface WebsiteEnquiry {
  name: string;
  email: string;
  phone?: string;
  pages?: string;
  features?: string[];
  support_needs?: {
    hosting?: string;
    maintenance?: string;
    seo?: string;
  };
  budget?: string;
  notes?: string;
}

export interface DiscoveryBooking {
  name: string;
  company?: string;
  phone: string;
  email: string;
  budget_range?: string;
  preferred_date?: string;
  preferred_time?: string;
  notes?: string;
}

export interface TimeRange {
  start: string;
  end: string;
}

export interface AvailabilityResponse {
  dayDisabled: boolean;
  disabledRanges: TimeRange[];
  bookedRanges: TimeRange[];
}

export interface AvailableSlot {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  max_bookings: number;
  booked_count: number;
  remaining_capacity: number;
}

// ─── API Calls ─────────────────────────────────────────────────────────────────

/**
 * Submit a "Plan My Website" enquiry
 * POST /api/enquiries
 */
export const submitEnquiry = async (payload: WebsiteEnquiry): Promise<void> => {
  const response = await api.post('/enquiries', payload);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to submit enquiry.');
  }
};

/**
 * Submit a "Book a Discovery Call" booking
 * POST /api/bookings
 */
export const submitBooking = async (payload: DiscoveryBooking): Promise<void> => {
  const response = await api.post('/bookings', payload);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to submit booking.');
  }
};

/**
 * Fetch availability for a specific date (Legacy)
 * GET /api/availability/check?date=YYYY-MM-DD
 */
export const fetchAvailability = async (date: string): Promise<AvailabilityResponse> => {
  const response = await api.get(`/availability/check?date=${date}`);
  return response.data;
};

/**
 * Fetch available slots for a specific date
 * GET /api/slots/available?date=YYYY-MM-DD
 */
export const fetchAvailableSlots = async (date: string): Promise<AvailableSlot[]> => {
  const response = await api.get(`/slots/available?date=${date}`);
  return response.data.data;
};

export default api;
