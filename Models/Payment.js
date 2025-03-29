import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true }, // 3000000 kobo for NGN, 6000 cents for USD
    currency: { type: String, required: true }, // "NGN" or "USD"
    paymentMethod: { type: String, enum: ["Paystack", "Stripe"], required: true },
    transactionId: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["pending", "completed", "failed", "refunded"], 
      default: "pending" 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
  });

  export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema)