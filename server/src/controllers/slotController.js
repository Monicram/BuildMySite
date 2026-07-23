const pool = require("../config/database").pool;
const {
  timeToMinutes,
  minutesToTime,
  BUSINESS_START,
  BUSINESS_END,
  LATEST_START,
  SLOT_INTERVAL,
  CALL_DURATION,
  rangesOverlap,
  rangeListOverlap,
} = require("../utils/availabilityConstants");

// ─── Get All Slots with Stats (Virtually Generated) ──────────────────────────
exports.getAllSlots = async (req, res, next) => {
  try {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayOfWeek = d.getDay();
      // Skip Saturday (6) and Sunday (0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(d.toISOString().split('T')[0]);
      }
    }

    if (dates.length === 0) {
      return res.status(200).json({ success: true, count: 0, data: [], stats: { total: 0, available: 0, booked: 0, full: 0, disabled: 0 } });
    }

    const minDate = dates[0];
    const maxDate = dates[dates.length - 1];

    // Fetch relevant overrides
    const overridesRes = await pool.query(
      `SELECT * FROM availability_overrides WHERE date >= $1 AND date <= $2`,
      [minDate, maxDate]
    );
    const overrides = overridesRes.rows;

    // Fetch relevant bookings
    const bookingsRes = await pool.query(
      `SELECT preferred_date, preferred_time, 
              COALESCE(
                preferred_end_time,
                to_char((preferred_time::time + interval '60 minutes')::time, 'HH24:MI')
              ) AS preferred_end_time
       FROM discovery_bookings
       WHERE preferred_date >= $1 AND preferred_date <= $2
         AND status IN ('pending', 'accepted')
         AND preferred_time IS NOT NULL`,
      [minDate, maxDate]
    );
    const bookings = bookingsRes.rows;

    const allSlots = [];
    const stats = { total: 0, available: 0, booked: 0, full: 0, disabled: 0 };
    const max_bookings = 1;

    dates.forEach(dateStr => {
      // Find overrides for this date
      const dayOverrides = overrides.filter(o => {
        // o.date is a Date object from node-postgres
        const d = new Date(o.date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().split('T')[0] === dateStr;
      });
      const wholeDayDisabled = dayOverrides.some(o => !o.start_time);
      const partialDisabled = dayOverrides.filter(o => o.start_time && o.end_time).map(o => ({
        start: o.start_time.substring(0,5), end: o.end_time.substring(0,5)
      }));

      // Find bookings for this date
      const dayBookings = bookings.filter(b => b.preferred_date === dateStr).map(b => ({
        start: b.preferred_time.substring(0,5), end: b.preferred_end_time.substring(0,5)
      }));

      // Generate slots
      for (let mins = BUSINESS_START; mins <= LATEST_START; mins += SLOT_INTERVAL) {
        const startTimeStr = minutesToTime(mins);
        const endTimeStr = minutesToTime(mins + CALL_DURATION);

        // Check if disabled
        let isDisabled = wholeDayDisabled;
        if (!isDisabled && rangeListOverlap(startTimeStr, endTimeStr, partialDisabled)) {
          isDisabled = true;
        }

        // Calculate bookings overlapping this slot
        let booked_count = 0;
        dayBookings.forEach(b => {
          if (rangesOverlap(timeToMinutes(startTimeStr), timeToMinutes(endTimeStr), timeToMinutes(b.start), timeToMinutes(b.end))) {
            booked_count++;
          }
        });

        const remaining_capacity = Math.max(0, max_bookings - booked_count);
        let status = 'Available';

        if (isDisabled) {
          status = 'Disabled';
          stats.disabled++;
        } else if (remaining_capacity === 0) {
          status = 'Full';
          stats.full++;
        } else if (booked_count > 0) {
          status = 'Booked';
          stats.booked++;
        } else {
          stats.available++;
        }

        stats.total++;

        // Use a composite ID since it's virtual
        const idStr = `${dateStr}_${startTimeStr}`;

        allSlots.push({
          id: idStr,
          date: dateStr,
          start_time: startTimeStr,
          end_time: endTimeStr,
          max_bookings,
          booked_count,
          remaining_capacity,
          status,
          is_disabled: isDisabled,
        });
      }
    });

    res.status(200).json({
      success: true,
      count: allSlots.length,
      data: allSlots,
      stats
    });
  } catch (err) {
    next(err);
  }
};

// ─── Enable Slot ─────────────────────────────────────────────────────────────
exports.enableSlot = async (req, res, next) => {
  try {
    const { date, start_time, end_time } = req.body;
    
    if (!date || !start_time || !end_time) {
      return res.status(400).json({ success: false, message: "Date, start time, and end time are required." });
    }

    // Enabling a slot means deleting the corresponding availability_override
    const result = await pool.query(
      `DELETE FROM availability_overrides 
       WHERE date = $1 
         AND start_time = $2 
         AND end_time = $3
       RETURNING *`,
      [date, start_time, end_time]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "No exact disable override found for this slot." });
    }

    res.status(200).json({
      success: true,
      message: "Slot enabled.",
    });
  } catch (err) {
    next(err);
  }
};

// ─── Disable Slot ────────────────────────────────────────────────────────────
exports.disableSlot = async (req, res, next) => {
  try {
    const { date, start_time, end_time } = req.body;
    
    if (!date || !start_time || !end_time) {
      return res.status(400).json({ success: false, message: "Date, start time, and end time are required." });
    }

    // Check if it's already disabled by overlapping override
    const overlapRes = await pool.query(
      `SELECT id FROM availability_overrides
       WHERE date = $1
         AND (start_time IS NULL OR (start_time <= $3 AND end_time >= $2))`,
      [date, start_time, end_time]
    );

    if (overlapRes.rows.length > 0) {
      return res.status(400).json({ success: false, message: "This slot is already disabled." });
    }

    const result = await pool.query(
      `INSERT INTO availability_overrides (date, start_time, end_time, reason)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [date, start_time, end_time, "Admin manually disabled slot"]
    );

    res.status(200).json({
      success: true,
      message: "Slot disabled.",
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};
