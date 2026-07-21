export const BUSINESS_START = 9 * 60;
export const BUSINESS_END = 21 * 60;
export const CALL_DURATION = 60;
export const LATEST_START = 20 * 60;

export interface TimeRange {
  start: string;
  end: string;
}

export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function rangesOverlap(
  start: string,
  end: string,
  ranges: TimeRange[]
): boolean {
  const s = timeToMinutes(start);
  const e = timeToMinutes(end);
  return ranges.some((r) => timeToMinutes(r.start) < e && timeToMinutes(r.end) > s);
}

export function formatDisplayTime(time?: string | null): string {
  if (!time) return '—';
  const [hStr, mStr] = time.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export function validateBookingTime(time: string): string | null {
  if (!time) return 'Please select a time.';
  const mins = timeToMinutes(time);
  if (mins < BUSINESS_START || mins > LATEST_START) {
    return 'Please select a time between 09:00 AM and 08:00 PM.';
  }
  if (mins + CALL_DURATION > BUSINESS_END) {
    return 'This time slot extends past business hours.';
  }
  return null;
}
