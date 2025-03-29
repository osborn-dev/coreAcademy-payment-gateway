import User from "@/Models/User";
import Payment from "@/Models/Payment";
import connectDB from "@/Config/DataBase";

export async function POST(req) {
  const { name, email, role, paymentMethod, howHeard, discordId } = await req.json();

  await connectDB()
  
  const user = await new User({
     name, 
     email, 
     role, 
     paymentMethod, 
     howHeard, 
     discordId 
    }).save();
  
  const paymentDetails = {
    userId: user._id,
    paymentMethod,
    transactionId: "pending_" + Date.now(), // Temp ID until webhook updates
    amount: paymentMethod === "Paystack" ? 3000000 : 6000, // NGN in kobo, USD in cents
    currency: paymentMethod === "Paystack" ? "NGN" : "USD"
  };
  
  const payment = await new Payment(paymentDetails).save();
  
  return Response.json({ id: user._id, paymentId: payment._id });
}