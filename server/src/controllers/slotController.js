const pool = require("../config/database").pool;
const { timeToMinutes, BUSINESS_START, BUSINESS_END } = require("../utils/availabilityConstants");

// ─── Get Available Slots (Customer Facing) ───────────────────────────────────
exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: "Date is required." });
    }

    const query = `
      SELECT 
        s.id,
        s.date,
        s.start_time,
        s.end_time,
        s.max_bookings,
        COUNT(b.id) AS booked_count
      FROM admin_slots s
      LEFT JOIN discovery_bookings b 
        ON s.date::text = b.preferred_date 
        AND b.status IN ('pending', 'accepted')
        AND b.preferred_time < s.end_time 
        AND COALESCE(b.preferred_end_time, to_char((b.preferred_time::time + interval '60 minutes')::time, 'HH24:MI')) > s.start_time
      WHERE s.date = $1
        AND s.is_disabled = false
      GROUP BY s.id
      ORDER BY s.start_time ASC
    `;
    const result = await pool.query(query, [date]);

    const now = new Date();
    const currentDateString = now.toISOString().split('T')[0];
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const data = result.rows.map(row => {
      const bookedCount = parseInt(row.booked_count, 10);
      const remainingCapacity = Math.max(0, row.max_bookings - bookedCount);
      return {
        id: row.id,
        date: row.date,
        start_time: row.start_time,
        end_time: row.end_time,
        max_bookings: row.max_bookings,
        booked_count: bookedCount,
        remaining_capacity: remainingCapacity,
      };
    }).filter(slot => {
      // 1. Hide full slots
      if (slot.remaining_capacity <= 0) return false;
      // 2. Hide past slots (expired) if today
      if (slot.date.toISOString().split('T')[0] === currentDateString) {
        const slotStartMins = timeToMinutes(slot.start_time);
        if (slotStartMins <= currentMins) return false;
      }
      return true;
    });

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get All Slots with Stats ──────────────────────────────────────────────────
exports.getAllSlots = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        s.*,
        COUNT(b.id) AS booked_count
      FROM admin_slots s
      LEFT JOIN discovery_bookings b 
        ON s.date::text = b.preferred_date 
        AND b.status IN ('pending', 'accepted')
        AND b.preferred_time < s.end_time 
        AND COALESCE(b.preferred_end_time, to_char((b.preferred_time::time + interval '60 minutes')::time, 'HH24:MI')) > s.start_time
      GROUP BY s.id
      ORDER BY s.date DESC, s.start_time ASC
    `;
    const result = await pool.query(query);

    const data = result.rows.map(row => {
      const bookedCount = parseInt(row.booked_count, 10);
      const remainingCapacity = Math.max(0, row.max_bookings - bookedCount);
      let status = "Available";
      
      if (row.is_disabled) {
        status = "Disabled";
      } else if (remainingCapacity === 0) {
        status = "Full";
      } else if (bookedCount > 0) {
        status = "Booked";
      }

      return {
        ...row,
        booked_count: bookedCount,
        remaining_capacity: remainingCapacity,
        status
      };
    });

    const stats = {
      total: data.length,
      available: data.filter(s => s.status === 'Available').length,
      booked: data.filter(s => s.status === 'Booked').length,
      full: data.filter(s => s.status === 'Full').length,
      disabled: data.filter(s => s.status === 'Disabled').length,
    };

    res.status(200).json({
      success: true,
      count: data.length,
      data,
      stats
    });
  } catch (err) {
    next(err);
  }
};

// ─── Create Slot ─────────────────────────────────────────────────────────────
exports.createSlot = async (req, res, next) => {
  try {
    const { date, start_time, end_time, max_bookings } = req.body;

    if (!date || !start_time || !end_time) {
      return res.status(400).json({ success: false, message: "Date, start time, and end time are required." });
    }

    const startMins = timeToMinutes(start_time);
    const endMins = timeToMinutes(end_time);

    if (startMins >= endMins) {
      return res.status(400).json({ success: false, message: "End time must be after start time." });
    }

    if (startMins < BUSINESS_START || endMins > BUSINESS_END) {
      return res.status(400).json({ success: false, message: "Time must be within business hours (09:00 AM - 09:00 PM)." });
    }

    // Check overlap with existing slots
    const overlapRes = await pool.query(
      `SELECT id FROM admin_slots
       WHERE date = $1
         AND start_time < $3 AND end_time > $2`,
      [date, start_time, end_time]
    );

    if (overlapRes.rows.length > 0) {
      return res.status(400).json({ success: false, message: "This slot overlaps with an existing slot on the same date." });
    }

    const result = await pool.query(
      `INSERT INTO admin_slots (date, start_time, end_time, max_bookings)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [date, start_time, end_time, max_bookings || 1]
    );

    res.status(201).json({
      success: true,
      message: "Slot created successfully.",
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// ─── Update Slot ─────────────────────────────────────────────────────────────
exports.updateSlot = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, start_time, end_time, max_bookings } = req.body;

    const existing = await pool.query("SELECT * FROM admin_slots WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Slot not found." });
    }

    const newDate = date ?? existing.rows[0].date;
    const newStart = start_time ?? existing.rows[0].start_time;
    const newEnd = end_time ?? existing.rows[0].end_time;
    const newMax = max_bookings ?? existing.rows[0].max_bookings;

    const startMins = timeToMinutes(newStart);
    const endMins = timeToMinutes(newEnd);

    if (startMins >= endMins) {
      return res.status(400).json({ success: false, message: "End time must be after start time." });
    }

    const overlapRes = await pool.query(
      `SELECT id FROM admin_slots
       WHERE date = $1
         AND id != $4
         AND start_time < $3 AND end_time > $2`,
      [newDate, newStart, newEnd, id]
    );

    if (overlapRes.rows.length > 0) {
      return res.status(400).json({ success: false, message: "This time range overlaps with another existing slot." });
    }

    const result = await pool.query(
      `UPDATE admin_slots
       SET date = $1, start_time = $2, end_time = $3, max_bookings = $4
       WHERE id = $5 RETURNING *`,
      [newDate, newStart, newEnd, newMax, id]
    );

    res.status(200).json({
      success: true,
      message: "Slot updated.",
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// ─── Enable Slot ─────────────────────────────────────────────────────────────
exports.enableSlot = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE admin_slots SET is_disabled = false WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Slot not found." });
    }

    res.status(200).json({
      success: true,
      message: "Slot enabled.",
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// ─── Disable Slot ────────────────────────────────────────────────────────────
exports.disableSlot = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE admin_slots SET is_disabled = true WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Slot not found." });
    }

    res.status(200).json({
      success: true,
      message: "Slot disabled.",
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// ─── Delete Slot ─────────────────────────────────────────────────────────────
exports.deleteSlot = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check for active bookings before deleting
    const slotRes = await pool.query("SELECT * FROM admin_slots WHERE id = $1", [id]);
    if (slotRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Slot not found." });
    }
    const slot = slotRes.rows[0];

    const bookingsRes = await pool.query(
      `SELECT id FROM discovery_bookings
       WHERE preferred_date = $1::text
         AND status IN ('pending', 'accepted')
         AND preferred_time < $3 
         AND COALESCE(preferred_end_time, to_char((preferred_time::time + interval '60 minutes')::time, 'HH24:MI')) > $2`,
      [slot.date, slot.start_time, slot.end_time]
    );

    if (bookingsRes.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Cannot delete a slot with existing bookings." });
    }

    await pool.query("DELETE FROM admin_slots WHERE id = $1", [id]);

    res.status(200).json({
      success: true,
      message: "Slot deleted successfully."
    });
  } catch (err) {
    next(err);
  }
};
