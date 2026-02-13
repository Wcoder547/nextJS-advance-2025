import { transporter } from "@/lib/emailService";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifycode: string,
): Promise<ApiResponse> {
  try {
    await transporter.sendMail({
      from: `"Mystery Message" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Mystery Message | Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${username}!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Thank you for registering with Mystery Message. Please use the verification code below to complete your registration:
            </p>
            <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center; margin: 30px 0;">
              <h1 style="color: #4F46E5; letter-spacing: 8px; margin: 0; font-size: 32px;">${verifycode}</h1>
            </div>
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              This code will expire in <strong>1 hour</strong>.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
