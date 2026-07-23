// ============================================================
// BuildMySite Admin — Centralized TypeScript Types
// ============================================================

// ─── Auth ──────────────────────────────────────────────────
export interface AdminUser {
  email: string;
  name: string;
  role: string;
  phone?: string;
  avatar?: string;
}

export interface AuthState {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  admin: AdminUser;
}

// ─── Enquiry ───────────────────────────────────────────────
export type EnquiryStatus = 'new' | 'contacted' | 'in_progress' | 'closed' | 'rejected';

export interface Enquiry {
  id: number;
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
  status: EnquiryStatus;
  created_at: string;
  updated_at?: string;
}

export interface EnquiriesResponse {
  success: boolean;
  count: number;
  data: Enquiry[];
}

// ─── Booking ───────────────────────────────────────────────
export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'rescheduled';

export interface Booking {
  id: number;
  name: string;
  company?: string;
  phone: string;
  email: string;
  budget_range?: string;
  preferred_date?: string;
  preferred_time?: string;
  preferred_end_time?: string;
  notes?: string;
  status: BookingStatus;
  created_at: string;
  updated_at?: string;
}

export interface BookingsResponse {
  success: boolean;
  count: number;
  data: Booking[];
}

// ─── Dashboard Stats ───────────────────────────────────────
export interface DashboardStats {
  todaysBookings: number;
  upcomingCalls: number;
  availableTimeMins: number;
  bookedTimeMins: number;
  disabledTimeMins: number;
}

// ─── Chart Data ────────────────────────────────────────────
export interface MonthlyDataPoint {
  month: string;
  enquiries: number;
  bookings: number;
  revenue: number;
}

export interface StatusDistribution {
  name: string;
  value: number;
  color: string;
}

// ─── Project ───────────────────────────────────────────────
export type ProjectStatus = 'discovery' | 'design' | 'development' | 'review' | 'launched';

export interface Project {
  id: number;
  name: string;
  client: string;
  email: string;
  status: ProjectStatus;
  budget: string;
  startDate: string;
  dueDate: string;
  progress: number;
  tech: string[];
  description?: string;
}

// ─── Template ──────────────────────────────────────────────
export interface Template {
  id: number;
  name: string;
  category: string;
  price: string;
  preview: string;
  tags: string[];
  featured: boolean;
  description: string;
}



// ─── Portfolio ─────────────────────────────────────────────
export interface PortfolioItem {
  id: number;
  title: string;
  client: string;
  category: string;
  image: string;
  url?: string;
  tech: string[];
  featured: boolean;
  description: string;
  completedAt: string;
}

// ─── Notification ──────────────────────────────────────────
export type NotificationType = 'enquiry' | 'booking' | 'system';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  link?: string;
}

// ─── Settings ──────────────────────────────────────────────
export interface SiteSettings {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  logoUrl?: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    facebook?: string;
  };
  theme: {
    primaryColor: string;
    accentColor: string;
  };
}

// ─── Customer (derived from Enquiries) ────────────────────
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  totalEnquiries: number;
  lastEnquiry: string;
  status: EnquiryStatus;
  budget?: string;
}

// ─── Pricing Plan ──────────────────────────────────────────
export interface PricingPlan {
  id: number;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
}

// ─── Table Utilities ───────────────────────────────────────
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}

// ─── API Response ──────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
}
