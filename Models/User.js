import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Unique for login/lookup
    role: { type: String, enum: ["frontend", "backend", "fullstack"], required: true },
    paymentMethod: { type: String, enum: ["Paystack", "Stripe"], required: true },
    discordId: { type: String, required: true },
    howHeard: { type: String },
    discordRoleAssigned: { type: Boolean, default: false },
    roadmapSent: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  });

  export default mongoose.models.User || mongoose.model('User', userSchema)