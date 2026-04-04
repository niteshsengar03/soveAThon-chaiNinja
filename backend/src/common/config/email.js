import nodemailer from "nodemailer";

// SMTP transporter — works with Mailtrap, Gmail, SendGrid, or any SMTP provider
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.MAIL_USER || process.env.SMTP_USER,
    pass: process.env.MAIL_PASSWORD || process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
};

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
  await sendEmail(
    email,
    "Verify your email",
    `<h2>Welcome!</h2><p>Click <a href="${url}">here</a> to verify your email.</p>`,
  );
};

const sendResetPasswordEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await sendEmail(
    email,
    "Reset your password",
    `<h2>Password Reset</h2><p>Click <a href="${url}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
  );
};

const sendOrderConfirmationEmail = async (email, order) => {
  const items = order.items
    .map((i) => `<li>${i.title} x${i.quantity} — ₹${i.price}</li>`)
    .join("");

  await sendEmail(
    email,
    `Order Confirmed — ${order.orderNumber}`,
    `<h2>Order Confirmed!</h2>
     <p>Order: ${order.orderNumber}</p>
     <ul>${items}</ul>
     <p><strong>Total: ₹${order.totalAmount}</strong></p>`,
  );
};

const sendComplaintNotification = async (email, subject, message) => {
  await sendEmail(
    email,
    subject,
    `<h2>Complaint Notification</h2>
     <p>${message}</p>`,
  );
};

export {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendOrderConfirmationEmail,
  sendComplaintNotification,
};
