const pool = require("../config/database").pool;
const {
  BUSINESS_START,
  BUSINESS_END,
  timeToMinutes,
} = require("../utils/availabilityConstants");

// ─── Check Availability ─────────────────────────────────────────────────────
exports.checkAvailability = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: "Date is required." });
    }

    const parsedDate = new Date(date);
    const dayOfWeek = parsedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res.status(200).json({
        success: true,
        dayDisabled: true,
        disabledRanges: [],
        bookedRanges: [],
      });
    }

    const overrideRes = await pool.query(
      "SELECT start_time, end_time FROM availability_overrides WHERE date = $1",
      [date]
    );

    let dayDisabled = false;
    const disabledRanges = [];

    overrideRes.rows.forEach((row) => {
      if (row.start_time === null) {
        dayDisabled = true;
      } else {
        disabledRanges.push({
          start: row.start_time.substring(0, 5),
          end: row.end_time.substring(0, 5),
        });
      }
    });

    if (dayDisabled) {
      return res.status(200).json({
        success: true,
        dayDisabled: true,
        disabledRanges: [],
        bookedRanges: [],
      });
    }

    const bookingRes = await pool.query(
      `SELECT preferred_time,
              COALESCE(
                preferred_end_time,
                to_char((preferred_time::time + interval '60 minutes')::time, 'HH24:MI')
              ) AS preferred_end_time
       FROM discovery_bookings
       WHERE preferred_date = $1
         AND status IN ('pending', 'accepted')
         AND preferred_time IS NOT NULL`,
      [date]
    );

    const bookedRanges = bookingRes.rows.map((row) => ({
      start: row.preferred_time.substring(0, 5),
      end: row.preferred_end_time.substring(0, 5),
    }));

    res.status(200).json({
      success: true,
      dayDisabled: false,
      disabledRanges,
      bookedRanges,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Disable Date or Time Range ─────────────────────────────────────────────
exports.disableTime = async (req, res, next) => {
  const client = await pool.connect();
  let inTransaction = false;
  try {
    const { date, start_time, end_time, reason } = req.body;
    if (!date) {
      return res.status(400).json({ success: false, message: "Date is required." });
    }

    if (start_time && end_time) {
      const startMins = timeToMinutes(start_time);
      const endMins = timeToMinutes(end_time);

      if (startMins >= endMins) {
        return res.status(400).json({
          success: false,
          message: "End time must be after start time.",
        });
      }

      if (startMins < BUSINESS_START || endMins > BUSINESS_END) {
        return res.status(400).json({
          success: false,
          message: "Time must be within business hours (09:00 AM - 09:00 PM).",
        });
      }
    }

    await client.query("BEGIN");
    inTransaction = true;

    if (start_time && end_time) {
      const overlapRes = await client.query(
        `SELECT id FROM availability_overrides
         WHERE date = $1
           AND start_time IS NOT NULL
           AND end_time IS NOT NULL
           AND start_time < $3 AND end_time > $2
         FOR UPDATE`,
        [date, start_time, end_time]
      );
      if (overlapRes.rows.length > 0) {
        await client.query("ROLLBACK");
        inTransaction = false;
        return res.status(400).json({
          success: false,
          message: "This range overlaps with an existing disabled time range.",
        });
      }
    } else {
      const wholeDayRes = await client.query(
        `SELECT id FROM availability_overrides
         WHERE date = $1 AND start_time IS NULL
         FOR UPDATE`,
        [date]
      );
      if (wholeDayRes.rows.length > 0) {
        await client.query("ROLLBACK");
        inTransaction = false;
        return res.status(400).json({
          success: false,
          message: "This date is already completely disabled.",
        });
      }
    }

    const result = await client.query(
      `INSERT INTO availability_overrides (date, start_time, end_time, reason)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [date, start_time || null, end_time || null, reason || null]
    );

    await client.query("COMMIT");
    inTransaction = false;

    res.status(201).json({
      success: true,
      message: start_time ? "Time disabled." : "Date disabled.",
      data: result.rows[0],
    });
  } catch (err) {
    if (inTransaction) {
      await client.query("ROLLBACK");
    }
    if (err.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "This date is already completely disabled.",
      });
    }
    next(err);
  } finally {
    client.release();
  }
};

// ─── Update Override ──────────────────────────────────────────────────────────
exports.updateOverride = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, start_time, end_time, reason } = req.body;

    const existing = await pool.query(
      "SELECT * FROM availability_overrides WHERE id = $1",
      [id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Override not found." });
    }

    const newDate = date ?? existing.rows[0].date;
    const newStart = start_time !== undefined ? start_time : existing.rows[0].start_time;
    const newEnd = end_time !== undefined ? end_time : existing.rows[0].end_time;
    const newReason = reason !== undefined ? reason : existing.rows[0].reason;

    if (newStart && newEnd) {
      const startMins = timeToMinutes(newStart);
      const endMins = timeToMinutes(newEnd);

      if (startMins >= endMins) {
        return res.status(400).json({
          success: false,
          message: "End time must be after start time.",
        });
      }

      if (startMins < BUSINESS_START || endMins > BUSINESS_END) {
        return res.status(400).json({
          success: false,
          message: "Time must be within business hours (09:00 AM - 09:00 PM).",
        });
      }

      const overlapRes = await pool.query(
        `SELECT id FROM availability_overrides
         WHERE date = $1
           AND id != $4
           AND start_time IS NOT NULL
           AND end_time IS NOT NULL
           AND start_time < $3 AND end_time > $2`,
        [newDate, newStart, newEnd, id]
      );
      if (overlapRes.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "This range overlaps with an existing disabled time range.",
        });
      }
    }

    const result = await pool.query(
      `UPDATE availability_overrides
       SET date = $1, start_time = $2, end_time = $3, reason = $4
       WHERE id = $5 RETURNING *`,
      [newDate, newStart || null, newEnd || null, newReason || null, id]
    );

    res.status(200).json({
      success: true,
      message: "Override updated.",
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// ─── Enable Date or Time (Delete Override) ──────────────────────────────────
exports.enableTime = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM availability_overrides WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Override not found." });
    }

    res.status(200).json({
      success: true,
      message: "Availability restored.",
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get All Overrides (Admin) ──────────────────────────────────────────────
exports.getAllOverrides = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM availability_overrides ORDER BY date DESC, start_time ASC NULLS FIRST"
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};
