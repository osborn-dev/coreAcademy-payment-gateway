import { NextResponse } from "next/server";
import Payment from "@/Models/Payment"; // payment schema
import User from "@/Models/User"; // user schema
import connectDB from "@/Config/DataBase"; // database config


export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url); // request to get userId & paymentId 
    const userId = searchParams.get("userId");
    const paymentId = searchParams.get("paymentId");

    if (!userId || !paymentId) { // validation
      return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
    }

    const payment = await Payment.findById(paymentId);
    const user = await User.findById(userId);

    // validation & confirming if the paymentId belongs to the user
    if (!payment || !user || String(payment.userId) !== userId) {
      return NextResponse.json({ message: "Invalid data" }, { status: 403 });
    }

    // paystack hook to initialize payment
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Authenticate request with Paystack secret key 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email, // Set user's email for payment  
        amount: payment.amount, // Set payment amount in smallest currency unit (e.g., kobo for NGN)  
        currency: payment.currency, // Define currency for transaction
        // Redirect after successful payment
        callback_url: `${process.env.NEXT_PUBLIC_URL}/api/payment-success?paymentId=${paymentId}`,
        metadata: { userId }, // metadata for reference (linking payment to user)
      }),
    });

    const data = await response.json();
    if (!data.status) { // Check if the request was successful 
      return NextResponse.json({ message: "Error initializing payment", error: data }, { status: 400 });
    }

    payment.transactionId = data.data.reference; // Save Paystack reference
    await payment.save(); // Update Payment

    return NextResponse.redirect(data.data.authorization_url); // Return the Paystack payment authorization URL 

    // Handle unexpected errors 
  } catch (error) {
    return NextResponse.json({ message: "Error processing payment", error: error.message }, { status: 500 });
  }
}