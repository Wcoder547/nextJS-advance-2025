import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    console.log(username, email, password);
    const existingUserByVerifiedUserName = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserByVerifiedUserName) {
      return Response.json(
        {
          success: false,
          message: "username already taken",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({
      email,
    });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserByEmail) {
      //Todo:back here
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exist with this email",
          },
          {
            status: 400,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.VerifiedExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expirtyDate = new Date();
      expirtyDate.setHours(expirtyDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,

        isVerified: false,
        VerifiedExpiry: expirtyDate,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
      //send verification email
      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      );
      console.log(emailResponse);
      if (!emailResponse) {
        return Response.json(
          {
            success: false,
            message: "Failed to send verification email",
          },
          {
            status: 500,
          }
        );
      }
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully.please verify your email",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
