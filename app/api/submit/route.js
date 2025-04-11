import { NextResponse } from "next/server"; // Import NextResponse
import User from "@/Models/User";
import Payment from "@/Models/Payment";
import connectDB from "@/Config/DataBase";

export async function POST(req) {
  try {
    // Destructure directly from req.json()
    const { name, email, role, paymentMethod, howHeard, discordId } = await req.json();

    if (!name || !email || !role || !paymentMethod || !howHeard || !discordId) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // checks for proper discordId
    if (!/^\d{17,19}$/.test(discordId)) {
      return NextResponse.json({ message: "Invalid Discord ID—must be 17-19 digits" }, { status: 400 });
    }

    // Connect to DB
    await connectDB();

    const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'A user with this email already exists' }, { status: 400 });
        }

        // checking user discordId in the server
        const botRes = await fetch(`http://localhost:3001/check-member?discordId=${discordId}`);
        const botData = await botRes.json();
        if (!botRes.ok || !botData.inServer) { // Evaluates bot’s response
          return NextResponse.json(
            { message: "Your Discord ID isn’t in our server—join via the button!" },
            { status: 403 }
          );
        }

    // Create and save user
    const user = await User.create({ name, email, role, paymentMethod, howHeard, discordId });

    // Define payment config for cleaner amount/currency logic
    const paymentConfig = {
      Paystack: { amount: 3000000, currency: "NGN" },
      Stripe: { amount: 6000, currency: "USD" },
    };

    // Create and save payment
    const payment = await Payment.create({
      userId: user._id,
      paymentMethod,
      transactionId: `pending_${Date.now()}`,
      ...paymentConfig[paymentMethod],
    });

    const paymentUrl = paymentMethod === "Paystack" // Generates payment redirect URL
      ? `${process.env.NEXT_PUBLIC_URL}/api/paystack?userId=${user._id}&paymentId=${payment._id}`
      : `${process.env.NEXT_PUBLIC_URL}/api/stripe?userId=${user._id}&paymentId=${payment._id}`;

    return NextResponse.json({ paymentUrl }); // Returns payment URL if all checks pass
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Failed to process request", error: error.message },
      { status: 500 }
    );
  }
}