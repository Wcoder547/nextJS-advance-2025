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
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hello ${username}!</h2>
          <p>Thank you for registering. Your verification code is:</p>
          <h1 style="color: #4F46E5; letter-spacing: 5px;">${verifycode}</h1>
          <p>This code will expire in 1 hour.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });

    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.log("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
