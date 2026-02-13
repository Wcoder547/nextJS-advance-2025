import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User.model";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || !user._id) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    // First, check if user exists
    const userDoc = await UserModel.findById(userId).lean();
    if (!userDoc) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // If no messages, return early
    if (!userDoc.messages || userDoc.messages.length === 0) {
      return Response.json({ success: true, messages: [] }, { status: 200 });
    }

    // Sort messages by createdAt using aggregation
    const userWithMessages = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if (!userWithMessages || userWithMessages.length === 0) {
      return Response.json(
        { success: true, messages: [] }, // you can also return 404 if required
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: userWithMessages[0]?.messages || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
