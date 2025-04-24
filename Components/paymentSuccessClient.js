"use client";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import Header from "./Header1";

// prop passing email from payment-success page
export default function PaymentSuccessClient({ email }) {
  return (
    <>
    <Header />
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
            href="https://discord.gg/BAbVZBAn"
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