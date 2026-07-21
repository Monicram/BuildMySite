const pool = require("../config/database").pool;

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

    // To calculate "Available Time", "Booked Time", and "Disabled Time", we can approximate 
    // for a specific period (e.g., next 30 days) or just return the total blocked units we have.
    // The user requested: "Available Time, Booked Time, Disabled Time".
    // Since availability is open, "Available Time" is virtually infinite, 
    // but let's calculate it for the next 30 days.
    // 30 days * 12 hours/day * 60 mins = 21,600 minutes total.

    // 3. Booked Time (in minutes) for the next 30 days
    const bookedTimeRes = await pool.query(
      `SELECT COUNT(*) FROM discovery_bookings 
       WHERE status IN ('pending', 'accepted') 
         AND preferred_date::DATE >= CURRENT_DATE 
         AND preferred_date::DATE <= CURRENT_DATE + INTERVAL '30 days'`
    );
    // Each booking is 60 mins
    const bookedTimeMins = parseInt(bookedTimeRes.rows[0].count, 10) * 60;

    // 4. Disabled Time (in minutes) for the next 30 days
    const overridesRes = await pool.query(
      `SELECT start_time, end_time FROM availability_overrides 
       WHERE date::DATE >= CURRENT_DATE 
         AND date::DATE <= CURRENT_DATE + INTERVAL '30 days'`
    );
    
    let disabledTimeMins = 0;
    overridesRes.rows.forEach(row => {
      if (row.start_time === null) {
        // Whole day disabled = 12 hours = 720 mins
        disabledTimeMins += 720;
      } else {
        const [sh, sm] = row.start_time.split(':').map(Number);
        const [eh, em] = row.end_time.split(':').map(Number);
        const startMins = sh * 60 + sm;
        const endMins = eh * 60 + em;
        disabledTimeMins += (endMins - startMins);
      }
    });

    const totalPeriodMins = 30 * 12 * 60; // 30 days * 12 hours
    const availableTimeMins = totalPeriodMins - bookedTimeMins - disabledTimeMins;

    res.status(200).json({
      success: true,
      data: {
        todaysBookings,
        upcomingCalls,
        bookedTimeMins,
        disabledTimeMins,
        availableTimeMins: Math.max(0, availableTimeMins)
      }
    });
  } catch (err) {
    next(err);
  }
};
