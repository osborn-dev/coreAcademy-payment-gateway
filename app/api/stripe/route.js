import { NextResponse } from "next/server";
import Stripe from "stripe";
import Payment from "@/Models/Payment";
import User from "@/Models/User";
import connectDB from "@/Config/DataBase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

export async function GET(req) {
  try {
    await connectDB(); // connecting DataBase
    const { searchParams } = new URL(req.url); // request for getting payment & userId
    const userId = searchParams.get("userId");
    const paymentId = searchParams.get("paymentId");

    if (!userId || !paymentId) { // validation
      return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
    }

    // checking the database for the userId & paymentId gotten from the request
    const payment = await Payment.findById(paymentId).lean();
    const user = await User.findById(userId).lean();

    // validation & confirming if the paymentId belongs to the user
    if (!payment || !user || String(payment.userId) !== userId) {
      return NextResponse.json({ message: "Invalid data" }, { status: 403 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // allowed payment methods 
      line_items: [ // Specifying items the user is paying for 
        {
          price_data: {
            currency: payment.currency, // Setting currency from payment object
            product_data: { name: "coreAcademy payment" }, // product name
            unit_amount: payment.amount,
          },
          quantity: 1, // quantity of the item 
        },
      ],
      mode: "payment", // One-time payment mode 
      // Redirect user on successful payment 
      success_url: `${process.env.NEXT_PUBLIC_URL}/api/payment-success?paymentId=${paymentId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment-failed`, // Redirect user on payment failure  
      metadata: { userId }, // metadata for reference (linking payment to user)
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ message: "Error creating payment", error: error.message }, { status: 500 });
  }
}