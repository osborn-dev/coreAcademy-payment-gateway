import connectDB from "@/Config/DataBase";
import Payment from "@/Models/Payment";
import User from "@/Models/User";
import PaymentSuccessClient from "@/Components/paymentSuccessClient";

// searchParams used for paymentId collection
export default async function PaymentSuccess({ searchParams }) {
  let email = "your@email.com";
  try {
    await connectDB();
    // new nextjs updates ensures that searchParams has to be awaited
    const params = await searchParams; 
    const paymentId = params.paymentId; // paymentId from params

    if (paymentId) { // validation check for paymentId
      const payment = await Payment.findById(paymentId);
      if (payment) {
        const user = await User.findById(payment.userId); // finding the user associated with the paymentId
        if (user) email = user.email; // getting users email & passing down to 'paymentSuccessClient via PROP'
      }
    }
  } catch (error) {
    console.error("Payment success fetch error:", error);
  }
  return <PaymentSuccessClient email={email} />; // email prop pass
}