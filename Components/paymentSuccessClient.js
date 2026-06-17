"use client";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCode, faEnvelope, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

const nextSteps = [
  {
    icon: faEnvelope,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    title: "Check your email",
    desc: "Your welcome email with your roadmap and access details is on its way.",
  },
  {
    icon: faDiscord,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    title: "Join the Discord",
    desc: "Connect with the community and get your learning role assigned.",
  },
  {
    icon: faCalendarDays,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    title: "Book your first session",
    desc: "Schedule a 1-on-1 onboarding call to map out your learning goals.",
  },
];

// prop passing email from payment-success page
export default function PaymentSuccessClient({ email }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="absolute top-6 left-6 sm:left-8 flex items-center gap-2 z-20">
        <FontAwesomeIcon icon={faCode} className="text-blue-400 text-xl" />
        <span className="text-xl font-bold text-white tracking-tight">CoreAcademy</span>
      </div>
      <div className="absolute top-5 right-6 sm:right-8 z-20">
        <Link
          href="/"
          className="text-sm text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg font-medium transition"
        >
          ← Back to Home
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg mt-16"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Success banner */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.3 }}
            >
              <FontAwesomeIcon icon={faCheckCircle} className="text-white text-6xl" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mt-4">Welcome to CoreAcademy!</h1>
            <p className="text-blue-100 text-sm mt-2">Payment confirmed. Confirmation sent to:</p>
            <span className="inline-block mt-2 bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full">
              {email}
            </span>
          </div>

          {/* Next steps */}
          <div className="p-6 sm:p-8">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">What&apos;s next</h2>
            <div className="space-y-4 mb-6">
              {nextSteps.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <FontAwesomeIcon icon={s.icon} className={`${s.color} text-sm`} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{s.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{s.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <a
              href="https://discord.gg/eqQhNkcCm9"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faDiscord} className="text-lg" />
              Join Discord Now
            </a>
            <Link
              href="/bookings"
              className="mt-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faCalendarDays} />
              Book Your First Session
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}