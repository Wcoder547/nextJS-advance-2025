import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User.model";

export async function POST(request: Request) {
  dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!user && !session?.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 400,
      }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update user status to accept messages",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("failed to update user status to accept messages", error);
    return Response.json(
      {
        success: false,
        message: "failed to update user status to accept messages",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!user && !session?.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 400,
      }
    );
  }

  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to found the user",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error accepting Messages", error);
    return Response.json(
      {
        success: false,
        message: "Internal server Error",
      },
      {
        status: 500,
      }
    );
  }
}
