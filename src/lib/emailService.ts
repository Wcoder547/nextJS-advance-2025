import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verify connection on startup
transporter.verify(function (error) {
  if (error) {
    console.log("Email service error:", error);
  } else {
    console.log("Email service is ready");
  }
});
