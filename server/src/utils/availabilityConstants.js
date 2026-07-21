// Shared business-hours and booking duration constants
const BUSINESS_START = 9 * 60;   // 09:00 AM
const BUSINESS_END   = 21 * 60;  // 09:00 PM
const CALL_DURATION  = 60;       // minutes
const LATEST_START   = 20 * 60;  // 08:00 PM — latest start so call ends at 09:00 PM
const SLOT_INTERVAL  = 30;       // minutes between selectable start times

function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

function minutesToTime(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

function rangeListOverlap(start, end, ranges) {
  const s = timeToMinutes(start);
  const e = timeToMinutes(end);
  return ranges.some((r) => {
    const rs = timeToMinutes(r.start);
    const re = timeToMinutes(r.end);
    return rangesOverlap(s, e, rs, re);
  });
}

function validateBookingTime(preferred_time) {
  const startMins = timeToMinutes(preferred_time);
  if (startMins < BUSINESS_START || startMins > LATEST_START) {
    return "Start time must be between 09:00 AM and 08:00 PM.";
  }
  if (startMins + CALL_DURATION > BUSINESS_END) {
    return "This time slot extends past business hours.";
  }
  return null;
}

/**
 * Generate all bookable start times for a date given blocked ranges.
 * Returns HH:MM strings for slots that fit a full call within business hours.
 */
function generateAvailableTimes(dayDisabled, disabledRanges, bookedRanges) {
  if (dayDisabled) return [];

  const blocked = [...disabledRanges, ...bookedRanges];
  const available = [];

  for (let mins = BUSINESS_START; mins <= LATEST_START; mins += SLOT_INTERVAL) {
    const start = minutesToTime(mins);
    const end = minutesToTime(mins + CALL_DURATION);

    if (mins + CALL_DURATION > BUSINESS_END) continue;
    if (!rangeListOverlap(start, end, blocked)) {
      available.push(start);
    }
  }

  return available;
}

module.exports = {
  BUSINESS_START,
  BUSINESS_END,
  CALL_DURATION,
  LATEST_START,
  SLOT_INTERVAL,
  timeToMinutes,
  minutesToTime,
  rangesOverlap,
  rangeListOverlap,
  validateBookingTime,
  generateAvailableTimes,
};
