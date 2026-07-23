const pool = require("../config/database").pool;
const {
  timeToMinutes,
  minutesToTime,
  BUSINESS_START,
  LATEST_START,
  SLOT_INTERVAL,
  CALL_DURATION,
} = require("../utils/availabilityConstants");

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
exports.getDashboardStats = async (req, res, next) => {
  try {
    // 1. Today's Bookings
    const todayRes = await pool.query(
      `SELECT COUNT(*) FROM discovery_bookings
       WHERE preferred_date::DATE = CURRENT_DATE
         AND status IN ('pending', 'accepted')`
    );
    const todaysBookings = parseInt(todayRes.rows[0].count, 10);

    // 2. Upcoming Discovery Calls (pending or accepted in the future)
    const upcomingRes = await pool.query(
      `SELECT COUNT(*) FROM discovery_bookings 
       WHERE status IN ('pending', 'accepted') 
         AND preferred_date::DATE >= CURRENT_DATE`
    );
    const upcomingCalls = parseInt(upcomingRes.rows[0].count, 10);

    // 3. Generate 30 days slots and sum up stats
    const today = new Date();
    today.setHours(0,0,0,0);
    const dates = [];
    for (let i = 0; i <= 29; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(d.toISOString().split('T')[0]);
      }
    }

    if (dates.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          todaysBookings,
          upcomingCalls,
          totalSlots: 0,
          availableSlots: 0,
          bookedSlots: 0,
          disabledSlots: 0,
        }
      });
    }

    const minDateStr = dates[0];
    const maxDateStr = dates[dates.length - 1];

    const overridesRes = await pool.query(
      `SELECT * FROM availability_overrides WHERE date >= $1 AND date <= $2`,
      [minDateStr, maxDateStr]
    );
    const overrides = overridesRes.rows;

    const bookingsRes = await pool.query(
      `SELECT preferred_date, preferred_time
       FROM discovery_bookings
       WHERE preferred_date >= $1 AND preferred_date <= $2
         AND status IN ('pending', 'accepted', 'rescheduled')
         AND preferred_time IS NOT NULL`,
      [minDateStr, maxDateStr]
    );
    const bookings = bookingsRes.rows;

    let totalSlots = 0, availableSlots = 0, bookedSlots = 0, disabledSlots = 0;

    dates.forEach(dateStr => {
      const dayOverrides = overrides.filter(o => {
        const d = new Date(o.date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().split('T')[0] === dateStr;
      });
      const wholeDayDisabled = dayOverrides.some(o => !o.start_time);
      const partialDisabled = dayOverrides.filter(o => o.start_time && o.end_time).map(o => ({
        start: o.start_time.substring(0,5), end: o.end_time.substring(0,5)
      }));

      const dayBookings = bookings.filter(b => {
        const d = new Date(b.preferred_date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().split('T')[0] === dateStr;
      }).map(b => ({
        start: b.preferred_time.substring(0,5)
      }));

      for (let mins = BUSINESS_START; mins <= LATEST_START; mins += SLOT_INTERVAL) {
        const startTimeStr = minutesToTime(mins);
        const endTimeStr = minutesToTime(mins + CALL_DURATION);

        let isDisabled = wholeDayDisabled;
        if (!isDisabled) {
          isDisabled = partialDisabled.some(o => o.start === startTimeStr && o.end === endTimeStr);
        }

        let isBooked = false;
        dayBookings.forEach(b => {
          const bStartMins = timeToMinutes(b.start);
          const bAssignedMins = Math.floor(bStartMins / SLOT_INTERVAL) * SLOT_INTERVAL;
          if (bAssignedMins === mins) {
            isBooked = true;
          }
        });

        totalSlots++;
        if (isDisabled) {
          disabledSlots++;
        } else if (isBooked) {
          bookedSlots++;
        } else {
          availableSlots++;
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        todaysBookings,
        upcomingCalls,
        totalSlots,
        availableSlots,
        bookedSlots,
        disabledSlots
      }
    });
  } catch (err) {
    next(err);
  }
};
