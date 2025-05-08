import { NextResponse } from "next/server";//  Next.js response helper
import Payment from "@/Models/Payment"; // Import Payment model for DB access
import User from "@/Models/User"; // User model for DB access
import connectDB from "@/Config/DataBase";//  DB connection function
import Stripe from "stripe"; // Import Stripe SDK
import transporter from '@/Lib/nodemailer'
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" }); // Initialize Stripe with secret key and API version

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function GET(req) { // Define GET handler for /api/payment-success
  try {
    await connectDB(); // Connect to MongoDB

    const { searchParams } = new URL(req.url); // Parse URL query params
    const paymentId = searchParams.get("paymentId"); // Get paymentId from query (e.g., ?paymentId=xxx)

    if (!paymentId) { // Check if paymentId is missing
      return NextResponse.json({ message: "Missing paymentId" }, { status: 400 }); // Return 400 error if no paymentId
    }

    const payment = await Payment.findById(paymentId); // Fetch Payment doc by ID
    if (!payment) { // Check if payment exists
      return NextResponse.json({ message: "Payment not found" }, { status: 404 }); // Return 404 if not found
    }

    // Check if payment is already completed (by webhook)
    if (payment.status === "completed") {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/payment-success?paymentId=${paymentId}`); // Redirect to success page
    }

    // Verify payment status
    let isPaid = false; // Flag to track if payment is successful

    if (payment.paymentMethod === "Paystack") { // If Paystack was used

      const response = await fetch(`https://api.paystack.co/transaction/verify/${payment.transactionId}`, { // Call Paystack verify API
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }, // Authenticate with secret key
      });

      const data = await response.json(); // Parse Paystack response

      isPaid = data.status && data.data.status === "success"; // Set true if verified and successful

    } else { // If Stripe was used

      const session = await stripe.checkout.sessions.retrieve(searchParams.get("session_id") || payment.transactionId); // Get Stripe session by ID (from query)
      isPaid = session.payment_status === "paid"; // Set true if payment is complete
    }

    if (!isPaid) { // redirect to payment-failure page on payment failure
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/payment-error?paymentId=${paymentId}`);
    }

    // Update DB
    payment.status = "completed"; // Mark payment as done
    await payment.save(); // Save updated Payment doc

    // Update user flags
    const user = await User.findById(payment.userId);
    if (!user.discordRoleAssigned || !user.roadmapSent) { // Only update if not already done by webhook
      user.discordRoleAssigned = true;
      user.roadmapSent = true;
      await user.save();

      // Trigger Discord bot
      const botResponse = await fetch(`${process.env.BOT_URL}/assign-role`, { //
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userDiscordId: user.discordId, role: user.role }),
      });

      const botData = await botResponse.json();
      if (!botData.success) {
        console.error("Bot error:", botData.error); // Log bot errors
      }

      const command = new GetObjectCommand({
        Bucket: "coreacademy-roadmaps", // Your S3 bucket name
        Key: `${user.role.toLowerCase()}-roadmap.pdf`, // e.g., frontend-roadmap.pdf
      });
      const roadmapUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour

      // Send email with roadmap
      const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <h2 style="color: #4a6cf7;">Welcome to CoreAcademy!</h2>
            <p>Hey ${user.name},</p>
            <p>Thanks for joining CoreAcademy! Your <strong>${user.role}</strong> role has been set in our Discord server.</p>
            <p>Join us here: <a href="https://discord.gg/eqQhNkcCm9" style="color: #4a6cf7; text-decoration: none;">https://discord.gg/BAbVZBAn</a></p>
            <p>We've attached your ${user.role} roadmap—check it out and get started on your learning journey!</p>
            <p>Your roadmap is ready: <a href="${roadmapUrl}">Download Roadmap</a></p>
            <p>See you in Discord!</p>
            <p><strong>The CoreAcademy Team</strong></p>
          </div>
        `; // 
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Welcome to CoreAcademy",
        html: htmlContent,
      });
    }
    // Redirect to frontend success page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/payment-success?paymentId=${paymentId}`);
    
  } catch (error) {
    // Log errors for debugging
    console.error("Payment success error:", error);
  }
}