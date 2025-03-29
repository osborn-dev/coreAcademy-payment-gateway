import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

// Initialize global mongoose cache
global.mongoose = global.mongoose || { conn: null, promise: null };
let cached = global.mongoose;

async function connectDB() {
  if (cached.conn) return cached.conn; // Return existing connection

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false, // Avoid unnecessary queuing
        serverSelectionTimeoutMS: 5000, // Prevent long hangs
        // autoIndex: false // Skip index creation in production
      })
      .then((mongoose) => {
        console.log("MongoDB connected successfully! State:", mongoose.connection.readyState);
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        cached.promise = null; // Reset for retry on next call
        throw err;
      });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached; // Persist across hot reloads
  return cached.conn;
}

export default connectDB;