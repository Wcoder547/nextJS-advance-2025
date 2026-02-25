// helpers/sendVerificationEmail.ts
import { apiInstance } from "@/lib/emailService";
import * as SibApiV3Sdk from "@getbrevo/brevo";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifycode: string,
): Promise<ApiResponse> {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = "Mystery Message | Verification Code";
    sendSmtpEmail.to = [{ email, name: username }];
    sendSmtpEmail.sender = {
      name: "Mystery Message",
      email: process.env.BREVO_SENDER_EMAIL!, // your Gmail or any email
    };
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7;">
        <div style="background-color: white; padding: 30px; border-radius: 10px;">
          <h2 style="color: #333;">Hello ${username}!</h2>
          <p style="color: #666; font-size: 16px;">Use the code below to verify your account:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 30px 0; border-radius: 5px;">
            <h1 style="color: #4F46E5; letter-spacing: 8px; margin: 0; font-size: 32px;">${verifycode}</h1>
          </div>
          <p style="color: #666; font-size: 14px;">This code expires in <strong>1 hour</strong>.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this, ignore this email.</p>
        </div>
      </div>
    `;

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Failed to send verification email" };
  }
}
