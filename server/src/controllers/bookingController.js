const pool = require("../config/database").pool;
const {
  CALL_DURATION,
  timeToMinutes,
  minutesToTime,
  validateBookingTime,
} = require("../utils/availabilityConstants");
const emailService = require("../utils/emailService");

// ─── Create Booking ────────────────────────────────────────────────────────────
exports.createBooking = async (req, res, next) => {
  const client = await pool.connect();
  let inTransaction = false;
  try {
    const {
      name,
      email,
      phone,
      company,
      budget_range,
      preferred_date,
      preferred_time,
      notes,
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and phone are required fields.",
      });
    }

    if (!preferred_date || !preferred_time) {
      return res.status(400).json({
        success: false,
        message: "Preferred date and time are required.",
      });
    }

    const timeError = validateBookingTime(preferred_time);
    if (timeError) {
      return res.status(400).json({ success: false, message: timeError });
    }

    const parsedDate = new Date(preferred_date);
    const dayOfWeek = parsedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res.status(400).json({
        success: false,
        message: "Bookings are available only from Monday to Friday.",
      });
    }

    await client.query("BEGIN");
    inTransaction = true;

    // Check if slot exists and is not disabled
    const slotRes = await client.query(
      `SELECT id, max_bookings, end_time FROM admin_slots 
       WHERE date = $1 AND start_time = $2 AND is_disabled = false
       FOR UPDATE`,
      [preferred_date, preferred_time]
    );

    if (slotRes.rows.length === 0) {
      await client.query("ROLLBACK");
      inTransaction = false;
      return res.status(400).json({
        success: false,
        message: "The selected slot is unavailable or does not exist.",
      });
    }

    const slot = slotRes.rows[0];
    const preferred_end_time = slot.end_time;

    // Check booked capacity
    const existingRes = await client.query(
      `SELECT count(id) as count FROM discovery_bookings
       WHERE preferred_date = $1 
         AND preferred_time = $2 
         AND status IN ('pending', 'accepted')`,
      [preferred_date, preferred_time]
    );

    if (parseInt(existingRes.rows[0].count, 10) >= slot.max_bookings) {
      await client.query("ROLLBACK");
      inTransaction = false;
      return res.status(409).json({
        success: false,
        message: "This slot is fully booked. Please choose another time.",
      });
    }

    const result = await client.query(
      `INSERT INTO discovery_bookings
       (name, company, phone, email, budget_range, preferred_date, preferred_time, preferred_end_time, notes, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [
        name,
        company || null,
        phone,
        email,
        budget_range || null,
        preferred_date,
        preferred_time,
        preferred_end_time,
        notes || null,
        "pending",
      ]
    );

    await client.query("COMMIT");
    inTransaction = false;

    res.status(201).json({
      success: true,
      message: "Discovery call booking submitted successfully.",
      data: result.rows[0],
    });

    // Send emails asynchronously
    try {
      await emailService.sendCustomerConfirmation(result.rows[0]);
      await emailService.sendAdminNotification(result.rows[0]);
    } catch (emailErr) {
      console.error("Failed to send booking emails:", emailErr.message);
    }
  } catch (err) {
    if (inTransaction) {
      await client.query("ROLLBACK");
    }
    next(err);
  } finally {
    client.release();
  }
};

// ─── Get All Bookings ──────────────────────────────────────────────────────────
exports.getAllBookings = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM discovery_bookings ORDER BY created_at DESC`
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

// ─── Get Single Booking ────────────────────────────────────────────────────────
exports.getBookingById = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM discovery_bookings WHERE id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// ─── Update Booking ────────────────────────────────────────────────────────────
exports.updateBooking = async (req, res, next) => {
  const client = await pool.connect();
  let inTransaction = false;
  try {
    const {
      name,
      company,
      phone,
      email,
      budget_range,
      preferred_date,
      preferred_time,
      notes,
      status,
    } = req.body;

    const currentBookingRes = await client.query(
      "SELECT * FROM discovery_bookings WHERE id=$1",
      [req.params.id]
    );

    if (currentBookingRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const currentBooking = currentBookingRes.rows[0];
    const newDate = preferred_date ?? currentBooking.preferred_date;
    const newTime = preferred_time ?? currentBooking.preferred_time;
    const newStatus = status ?? currentBooking.status;
    
    if (newDate) {
      const parsedDate = new Date(newDate);
      const dayOfWeek = parsedDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return res.status(400).json({
          success: false,
          message: "Bookings are available only from Monday to Friday.",
        });
      }
    }

    let newEndTime = currentBooking.preferred_end_time;
    const timeChanged =
      (preferred_date && preferred_date !== currentBooking.preferred_date) ||
      (preferred_time && preferred_time !== currentBooking.preferred_time);

    const needsConflictCheck =
      timeChanged && ["pending", "accepted"].includes(newStatus);

    if (needsConflictCheck) {
      await client.query("BEGIN");
      inTransaction = true;

      const slotRes = await client.query(
        `SELECT id, max_bookings, end_time FROM admin_slots 
         WHERE date = $1 AND start_time = $2 AND is_disabled = false
         FOR UPDATE`,
        [newDate, newTime]
      );

      if (slotRes.rows.length === 0) {
        await client.query("ROLLBACK");
        inTransaction = false;
        return res.status(400).json({
          success: false,
          message: "The selected slot is unavailable or does not exist.",
        });
      }

      const slot = slotRes.rows[0];
      newEndTime = slot.end_time;

      const existingRes = await client.query(
        `SELECT count(id) as count FROM discovery_bookings
         WHERE preferred_date = $1 
           AND preferred_time = $2 
           AND id != $3
           AND status IN ('pending', 'accepted')`,
        [newDate, newTime, req.params.id]
      );

      if (parseInt(existingRes.rows[0].count, 10) >= slot.max_bookings) {
        await client.query("ROLLBACK");
        inTransaction = false;
        return res.status(409).json({
          success: false,
          message: "This slot is fully booked. Please choose another time.",
        });
      }
    }

    const result = await client.query(
      `UPDATE discovery_bookings
       SET
         name               = $1,
         company            = $2,
         phone              = $3,
         email              = $4,
         budget_range       = $5,
         preferred_date     = $6,
         preferred_time     = $7,
         preferred_end_time = $8,
         notes              = $9,
         status             = $10,
         updated_at         = NOW()
       WHERE id             = $11
       RETURNING *`,
      [
        name ?? currentBooking.name,
        company ?? currentBooking.company,
        phone ?? currentBooking.phone,
        email ?? currentBooking.email,
        budget_range ?? currentBooking.budget_range,
        newDate,
        newTime,
        newEndTime,
        notes ?? currentBooking.notes,
        newStatus,
        req.params.id,
      ]
    );

    if (inTransaction) {
      await client.query("COMMIT");
    }

    res.status(200).json({
      success: true,
      message: "Booking updated.",
      data: result.rows[0],
    });

    // If status changed or it was rescheduled, send email
    try {
      const isStatusChanged = currentBooking.status !== newStatus;
      if (isStatusChanged && ['accepted', 'rejected', 'rescheduled'].includes(newStatus)) {
        await emailService.sendBookingStatusEmail(result.rows[0], currentBooking.status);
      }
    } catch (emailErr) {
      console.error("Failed to send booking status email:", emailErr.message);
    }
  } catch (err) {
    if (inTransaction) {
      await client.query("ROLLBACK");
    }
    next(err);
  } finally {
    client.release();
  }
};

// ─── Delete Booking ────────────────────────────────────────────────────────────
exports.deleteBooking = async (req, res, next) => {
  try {
    const result = await pool.query(
      "DELETE FROM discovery_bookings WHERE id=$1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
};
