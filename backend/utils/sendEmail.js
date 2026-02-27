import dotenv from "dotenv";
dotenv.config({ path: "./.env" })
import nodemailer from "nodemailer";


export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Hotel Booking" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent:", info.response);
  } catch (error) {
    console.error("Email error:", error);
  }
};
