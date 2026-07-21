const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    console.warn("⚠️ SMTP credentials not found. Mocking email send to:", to, "| Subject:", subject);
    return;
  }
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"BuildMySite" <no-reply@buildmysite.com>',
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✉️ Email sent successfully to ${to}`);
  } catch (err) {
    console.error("❌ Email failed to send:", err.message);
  }
};

const getBaseHtml = (title, content) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Inter', sans-serif; background-color: #0d1117; color: #c9d1d9; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background-color: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 30px; }
  h1 { color: #f2cc8f; font-size: 24px; margin-bottom: 20px; text-align: center; }
  .content { font-size: 16px; line-height: 1.6; }
  .footer { margin-top: 30px; font-size: 12px; color: #8b949e; text-align: center; border-top: 1px solid #30363d; padding-top: 20px; }
  .highlight { color: #58a6ff; font-weight: bold; }
  table { width: 100%; border-collapse: collapse; margin-top: 15px; }
  td { padding: 8px; border-bottom: 1px solid #30363d; }
  td:first-child { font-weight: bold; width: 35%; color: #8b949e; }
</style>
</head>
<body>
  <div class="container">
    <h1>${title}</h1>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      Thank you for choosing BuildMySite.<br/>
      BuildMySite Team
    </div>
  </div>
</body>
</html>
`;

exports.sendCustomerConfirmation = async (booking) => {
  const subject = "Booking Request Received – BuildMySite";
  const content = `
    <p>Hello ${booking.name},</p>
    <p>Thank you for booking a Discovery Call with BuildMySite.</p>
    <p>We have successfully received your request.</p>
    
    <h3>Booking Details</h3>
    <table>
      <tr><td>Date:</td><td><span class="highlight">${booking.preferred_date}</span></td></tr>
      <tr><td>Time:</td><td><span class="highlight">${booking.preferred_time || 'TBC'}</span></td></tr>
      <tr><td>Name:</td><td>${booking.name}</td></tr>
      <tr><td>Company:</td><td>${booking.company || 'N/A'}</td></tr>
      <tr><td>Email:</td><td>${booking.email}</td></tr>
      <tr><td>Phone:</td><td>${booking.phone || 'N/A'}</td></tr>
      <tr><td>Reference ID:</td><td>#${booking.id}</td></tr>
      <tr><td>Status:</td><td>Pending</td></tr>
    </table>
    
    <p>Our team will review your booking and confirm it shortly.</p>
    <p>You will receive another email once your booking has been approved. If any changes are required, we will contact you.</p>
  `;
  await sendMail({ to: booking.email, subject, html: getBaseHtml(subject, content) });
};

exports.sendAdminNotification = async (booking) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const subject = "New Booking Request Received";
  const content = `
    <p>A new discovery call has been requested.</p>
    
    <h3>Booking Details</h3>
    <table>
      <tr><td>Customer Name:</td><td>${booking.name}</td></tr>
      <tr><td>Company:</td><td>${booking.company || 'N/A'}</td></tr>
      <tr><td>Phone:</td><td>${booking.phone || 'N/A'}</td></tr>
      <tr><td>Email:</td><td>${booking.email}</td></tr>
      <tr><td>Preferred Date:</td><td><span class="highlight">${booking.preferred_date}</span></td></tr>
      <tr><td>Preferred Time:</td><td><span class="highlight">${booking.preferred_time || 'TBC'}</span></td></tr>
      <tr><td>Message:</td><td>${booking.message || 'None'}</td></tr>
      <tr><td>Booking ID:</td><td>#${booking.id}</td></tr>
      <tr><td>Status:</td><td>${booking.status}</td></tr>
    </table>
  `;
  await sendMail({ to: adminEmail, subject, html: getBaseHtml(subject, content) });
};

exports.sendBookingStatusEmail = async (booking, oldStatus) => {
  if (booking.status === 'accepted') {
    const subject = "Your Discovery Call is Confirmed – BuildMySite";
    const content = `
      <p>Hello ${booking.name},</p>
      <p>Your Discovery Call has been successfully confirmed!</p>
      
      <h3>Meeting Details</h3>
      <table>
        <tr><td>Date:</td><td><span class="highlight">${booking.preferred_date}</span></td></tr>
        <tr><td>Time:</td><td><span class="highlight">${booking.preferred_time}</span></td></tr>
        <tr><td>Link:</td><td><a href="https://meet.google.com/buildmysite">Google Meet Link</a></td></tr>
      </table>
      
      <p>We look forward to speaking with you and discussing how we can help elevate your online presence.</p>
    `;
    await sendMail({ to: booking.email, subject, html: getBaseHtml(subject, content) });
  } 
  else if (booking.status === 'rejected') {
    const subject = "Booking Update – BuildMySite";
    const content = `
      <p>Hello ${booking.name},</p>
      <p>Thank you for requesting a Discovery Call with us.</p>
      <p>Unfortunately, the requested slot on <span class="highlight">${booking.preferred_date}</span> at <span class="highlight">${booking.preferred_time || 'the requested time'}</span> is no longer available.</p>
      <p>We kindly ask you to visit our website and book another available time.</p>
      <p>We apologize for any inconvenience and look forward to speaking with you soon.</p>
    `;
    await sendMail({ to: booking.email, subject, html: getBaseHtml(subject, content) });
  }
  else if (booking.status === 'rescheduled') {
    const subject = "Booking Rescheduled – BuildMySite";
    const content = `
      <p>Hello ${booking.name},</p>
      <p>Your Discovery Call has been rescheduled.</p>
      
      <h3>New Meeting Details</h3>
      <table>
        <tr><td>Date:</td><td><span class="highlight">${booking.preferred_date}</span></td></tr>
        <tr><td>Time:</td><td><span class="highlight">${booking.preferred_time}</span></td></tr>
        <tr><td>Link:</td><td><a href="https://meet.google.com/buildmysite">Google Meet Link</a></td></tr>
      </table>
      
      <p>We look forward to speaking with you.</p>
    `;
    await sendMail({ to: booking.email, subject, html: getBaseHtml(subject, content) });
  }
};
