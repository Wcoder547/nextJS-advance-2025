import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmails";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifycode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mstry Message | verification code",
      react: VerificationEmail({ username, otp: verifycode }),
    });
    return { success: true, message: "verification email send successfully" };
  } catch (emailError) {
    console.log("Erro sending Verification Email", emailError);
    return { success: false, message: "failed to send verification email" };
  }
}
