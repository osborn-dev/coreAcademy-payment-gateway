"use client";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

// prop passing email from payment-success page
export default function PaymentSuccessClient({ email }) {
  return (
    <>
    <div className="nav">
            <div className="absolute top-6 left-6 sm:top-6 sm:left-6 lg:top-8 lg:left-8 flex items-center gap-2 z-20">
                    <FontAwesomeIcon icon={faCode} className="text-blue-500 text-xl sm:text-xl" />
                    <span className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">CoreAcademy</span>
                  </div>
            
                  {/* Navigation Links */}
                  <div className="absolute top-6 right-6 sm:top-6 sm:right-6 lg:top-8 lg:right-8 flex items-center gap-3 sm:gap-4 z-20">
                    
                    <Link
                    href="/"
                    className="text-sm sm:text-base lg:text-lg text-white bg-blue-500 px-3 py-1 sm:px-4 sm:py-2 rounded-md font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 sm:gap-2"
                  >
                    Home
                  </Link>
                  </div>
          </div>
    <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4 pt-20">
      <motion.div
        className="w-full max-w-lg p-8 bg-gray-50 rounded-xl shadow-lg border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        >
        <div className="text-center">
          <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 text-5xl mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to CoreAcademy!</h1>
          <p className="text-gray-600 mb-6">
          Your payment has been processed, your role’s assigned, and your roadmap’s on its way to <span className="text-blue-500">{email}</span>.
          </p>
          <p className="text-gray-600 mb-6">Join us on Discord to get started:</p>
          <a
            href="https://discord.gg/eqQhNkcCm9"
            className=" bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 font-semibold transition-colors flex items-center justify-center gap-2"
            >
            Join Discord
            <FontAwesomeIcon icon={faDiscord} className="text-white text-lg" />
          </a>
        </div>
      </motion.div>
    </main>
    </>
  );
}