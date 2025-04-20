import { NextResponse } from "next/server";// Import Next.js response helper
import Payment from "@/Models/Payment"; // Import Payment model for DB access
import User from "@/Models/User"; // Import User model for DB access
import connectDB from "@/Config/DataBase";// Import DB connection function
import Stripe from "stripe"; // Import Stripe SDK
import transporter from '@/Lib/nodemailer'
import path from 'path'


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" }); // Initialize Stripe with secret key and API version

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

    const user = await User.findById(payment.userId); // Fetch User by payment’s userId
    user.discordRoleAssigned = true; // Flip flag to trigger role assignment
    user.roadmapSent = true; // Flip flag to trigger roadmap email
    await user.save(); // Save updated User doc

    // Trigger bot to assign role
    const botResponse = await fetch("http://localhost:3001/assign-role", { // Call bot’s endpoint
      method: "POST", // Use POST method
      headers: { "Content-Type": "application/json" }, // Set JSON content type
      body: JSON.stringify({ userDiscordId: user.discordId, role: user.role }), // Send Discord ID and role
    });

    const botData = await botResponse.json();
    if (!botData.success) {
    console.error("Bot error:", botData.error);
    }

    const roadmapFile = path.join(process.cwd(), "roadmaps", `${user.role.toLowerCase()}-roadmap.pdf`);

    // HTML version of the email for better formatting
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #4a6cf7;">Welcome to CoreAcademy!</h2>
        <p>Hey ${user.name},</p>
        <p>Thanks for joining CoreAcademy! Your <strong>${user.role}</strong> role has been set in our Discord server.</p>
        <p>Join us here: <a href="https://discord.gg/BAbVZBAn" style="color: #4a6cf7; text-decoration: none;">https://discord.gg/BAbVZBAn</a></p>
        <p>We've attached your ${user.role} roadmap—check it out and get started on your learning journey!</p>
        <p>See you in Discord!</p>
        <p><strong>The CoreAcademy Team</strong></p>
      </div>
    `;

    // Sending email with Discord link and PDF roadmap
    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: user.email,
      subject: "Welcome to CoreAcademy",
      text: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #4a6cf7;">Welcome to CoreAcademy!</h2>
        <p>Hey ${user.name},</p>
        <p>Thanks for joining CoreAcademy! Your <strong>${user.role}</strong> role has been set in our Discord server.</p>
        <p>Join us here: <a href="https://discord.gg/BAbVZBAn" style="color: #4a6cf7; text-decoration: none;">https://discord.gg/BAbVZBAn</a></p>
        <p>We've attached your ${user.role} roadmap—check it out and get started on your learning journey!</p>
        <p>See you in Discord!</p>
        <p><strong>The CoreAcademy Team</strong></p>
      </div>
      `,
      html: htmlContent,
      attachments: [
        {
          filename: `${user.role}-roadmap.pdf`, // Name in email
          path: roadmapFile, // Path to PDF
        },
      ],
    };
    await transporter.sendMail(mailOptions);

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/payment-success?paymentId=${paymentId}`); // redirect to success page
  } catch (error) { // Catch any errors
    console.error("Payment success error:", error); // Log error details
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 }); // Return 500 with error info
  }
}
