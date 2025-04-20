import connectDB from "@/Config/DataBase";
import Payment from "@/Models/Payment";
import User from "@/Models/User";
import PaymentSuccessClient from "@/Components/paymentSuccessClient";

export default async function PaymentSuccess({ searchParams }) {
  let email = "your@email.com";
  try {
    await connectDB();
    const params = await searchParams; 
    const paymentId = params.paymentId;

    if (paymentId) {
      const payment = await Payment.findById(paymentId);
      if (payment) {
        const user = await User.findById(payment.userId);
        if (user) email = user.email;
      }
    }
  } catch (error) {
    console.error("Payment success fetch error:", error);
  }
  return <PaymentSuccessClient email={email} />;
}