import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

transporter.verify(function (error) {
  if (error) {
    console.log("Email service error:", error);
  } else {
    console.log("Email service is ready to send messages");
  }
});
