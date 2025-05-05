// /api/paystack-webhook/route.js
import { NextResponse } from "next/server"; // Import Next.js response helper
import Payment from "@/Models/Payment"; // Import Payment model for DB access
import User from "@/Models/User"; // Import User model for DB access
import connectDB from "@/Config/DataBase"; // Import DB connection function
import crypto from "crypto"; // Import crypto for Paystack signature verification
import transporter from "@/Lib/nodemailer"; // Import nodemailer for sending emails
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


export async function POST(req) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse the webhook payload
    const body = await req.json();

    // Verify Paystack signature to ensure the request is from Paystack
    const signature = req.headers.get("x-paystack-signature");
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY) // Use Live Secret Key
      .update(JSON.stringify(body))
      .digest("hex");

    // Check if the signature matches
    if (hash !== signature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 403 }); // Reject if signature is invalid
    }

    // Handle successful payment event
    if (body.event === "charge.success") {
      const { reference, metadata } = body.data; // Extract reference and metadata from webhook payload

      // Find the payment by transactionId (reference) and userId
      const payment = await Payment.findOne({
        transactionId: reference,
        userId: metadata.userId,
      });

      // Check if payment exists and is not already processed
      if (!payment) {
        return NextResponse.json({ message: "Payment not found" }, { status: 404 }); // Return 404 if payment not found
      }
      if (payment.status === "completed") {
        return NextResponse.json({ message: "Payment already processed" }, { status: 200 }); // Skip if already completed
      }

      // Update payment status to completed
      payment.status = "completed";
      await payment.save();

      // Update user with Discord role and roadmap flags
      const user = await User.findById(payment.userId);
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 }); // Return 404 if user not found
      }
      // ? include a validation check for discord id and roadmap
      user.discordRoleAssigned = true; // Flag to indicate Discord role assignment
      user.roadmapSent = true; // Flag to indicate roadmap email sent
      await user.save();

      // Trigger Discord bot to assign role
      const botResponse = await fetch(`${process.env.BOT_URL}/assign-role`, { // Replace with your production bot URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userDiscordId: user.discordId, role: user.role }),
      });

      const botData = await botResponse.json();
      if (!botData.success) {
        console.error("Bot error:", botData.error); // Log bot errors but don’t fail webhook
      }

       // Generate signed URL for roadmap PDF
       const command = new GetObjectCommand({
        Bucket: "coreacademy-roadmaps",
        Key: `${user.role.toLowerCase()}-roadmap.pdf`,
      });
      const roadmapUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })


      // HTML email content
      const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <h2 style="color: #4a6cf7;">Welcome to CoreAcademy!</h2>
            <p>Hey ${user.name},</p>
            <p>Thanks for joining CoreAcademy! Your <strong>${user.role}</strong> role has been set in our Discord server.</p>
            <p>Join us here: <a href="https://discord.gg/BAbVZBAn" style="color: #4a6cf7; text-decoration: none;">https://discord.gg/BAbVZBAn</a></p>
            <p>We've attached your ${user.role} roadmap—check it out and get started on your learning journey!</p>
            <p>Your roadmap is ready: <a href="${roadmapUrl}">Download Roadmap</a></p>
            <p>See you in Discord!</p>
            <p><strong>The CoreAcademy Team</strong></p>
          </div>
        `; 

      // Send email with Discord link and PDF roadmap
      await transporter.sendMail({
        from: process.env.EMAIL_USER, // Sender email from env
        to: user.email, // User’s email
        subject: "Welcome to CoreAcademy", // Email subject
        html: htmlContent, // HTML email body
      });

      // Return success response to Paystack (required to avoid retries)
      return NextResponse.json({ message: "Webhook processed" }, { status: 200 });
    }

        // Add charge.failed handling here
    if (body.event === "charge.failed") {
        // Find payment by transactionId (reference)
        const payment = await Payment.findOne({ transactionId: body.data.reference });
        if (payment) {
        // Update payment status to failed
        payment.status = "failed";
        await payment.save();
        }
    // Acknowledge webhook to prevent retries
    return NextResponse.json({ message: "Webhook processed" }, { status: 200 });
  }

    // Handle other events (e.g., charge.failed) if needed
    return NextResponse.json({ message: "Event not handled" }, { status: 200 }); // Acknowledge unhandled events

  } catch (error) {
    // Log errors for debugging
    console.error("Webhook error:", error);
    // Return 500 error but don’t trigger Paystack retries
    return NextResponse.json({ message: "Webhook failed" }, { status: 500 });
  }
}