import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }
  try {
    const db = await mongoose.connect(
      (process.env.MONGODB_URI as string) || "",
      {}
    );
    console.log(db);
    console.log(db.connections);
    connection.isConnected = db.connections[0].readyState;

    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw new Error("Database connection failed");
  }
}

export default dbConnect;
