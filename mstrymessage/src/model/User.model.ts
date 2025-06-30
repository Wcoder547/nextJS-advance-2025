import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  isVerified: boolean;
  isVerifiedExpiry: Date;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    trim: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    trim: true,
  },
  verifyCode: {
    type: String,
    required: [true, "verifyCode is required"],
    trim: true,
  },
  isVerified: {
    type: Boolean,
    required: [true, "isVerified is required"],
    default: false,
  },
  isVerifiedExpiry: {
    type: Date,
    required: [true, "isVerifiedExpiry is required"],
  },
  isAcceptingMessage: {
    type: Boolean,
    required: [true, "isAcceptingMessage is required"],
    default: true,
  },
  messages: { type: [MessageSchema], required: true },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;

// mongoose.models.User  || mongoose.model("User", UserSchema);
