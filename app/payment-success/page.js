import { CheckCircleIcon } from "lucide-react";

export default function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md">
        <CheckCircleIcon className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">Payment Successful!</h1>
        <p className="text-gray-600 mt-2">
          Your payment has been processed. Your role is assigned, and your roadmap is on its way.
        </p>
      </div>
    </div>
  );
}
