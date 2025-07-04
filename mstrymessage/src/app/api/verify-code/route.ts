import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    // console.log("Raw username from client:", username);
    const decodeUsername = decodeURIComponent(username).toLowerCase();
    // console.log("Decoded username:", decodeUsername);

    const user = await UserModel.findOne({
      username: new RegExp(`^${decodeUsername}$`, "i"),
    });
    // console.log(user)

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 500,
        }
      );
    }
    const isCodevalid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.VerifiedExpiry) > new Date();

    if (isCodevalid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account verified successfully!!",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "verification code has expired,please signup again to get a new code",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "incorrect verification code",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      {
        status: 500,
      }
    );
  }
}
