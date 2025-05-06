"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faEnvelope, 
  faChalkboardTeacher, 
  faCreditCard, 
  faQuestionCircle,
  faRocket,
  faCode
} from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Lato } from 'next/font/google'

const openfont = Lato({
  subsets:['latin'],
  weight:'400',
})


export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [discordId, setDiscordID] = useState('');
  const [howHeard, setHowHeard] = useState('');
  const [role, setRole] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const astronautVariants = {
    float: {
      y: [-10, 10, -10],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  };

  useEffect(() => {
    toast.info("Important❗Join the server before proceeding with payment if you haven't joined yet!", {
      position: "top-center",
      autoClose: 6000,
      hideProgressBar: true,
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    if (!name || !email || !role || !paymentMethod || !discordId || !howHeard) {
      toast.error("All fields are required");
      setIsSubmitting(false);
      return;
    }

    if (!/^\d{17,19}$/.test(discordId)) {
      toast.error("Invalid Discord ID copy it from Discord settings.");
      setIsSubmitting(false);
      return;
    }
  
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, paymentMethod, discordId, howHeard }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        toast.error(data.message || "Something went wrong", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
        });
        setIsSubmitting(false);
        return;
      }
  
      toast.success("Hold tight, your payment portal is launching...", {
        hideProgressBar: true,
        autoClose: 4000,
      });
      
      setTimeout(() => {
        window.location.href = data.paymentUrl;
      }, 1500);
  
    } catch (error) {
      toast.error("Submission failed—try again", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center p-6 sm:p-4 lg:p-6 relative overflow-hidden">
      {/* Logo */}
      <div className="absolute top-6 left-6 sm:top-6 sm:left-6 lg:top-8 lg:left-8 flex items-center gap-2 z-20">
        <FontAwesomeIcon icon={faCode} className="text-blue-500 text-xl sm:text-xl" />
        <span className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">CoreAcademy</span>
      </div>

      {/* Navigation Links */}
      <div className="absolute top-6 right-6 sm:top-6 sm:right-6 lg:top-8 lg:right-8 flex items-center gap-3 sm:gap-4 z-20">
        <Link
          href="/about"
          className="text-sm sm:text-base lg:text-lg text-white hover:text-blue-300 transition-colors hidden sm:block"
        >
          Why CoreAcademy?
        </Link>
        <a
        href="https://discord.gg/eqQhNkcCm9"
        className="text-sm sm:text-base lg:text-lg text-white bg-blue-500 px-3 py-1 sm:px-4 sm:py-2 rounded-md font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 sm:gap-2"
      >
        <FontAwesomeIcon icon={faDiscord} className="text-white text-lg sm:text-xl" />
        Join The Server
      </a>
      </div>

      {/* Animated Background Element */}
      <motion.div
        className="absolute inset-0 flex justify-center items-center p-4 sm:p-4 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 300"
          className="w-full max-w-[200px] sm:max-w-[400px] lg:max-w-[600px] h-auto"
          variants={astronautVariants}
          animate="float"
        >
          <circle cx="100" cy="80" r="25" fill="#4B5EAA" />
          <rect x="60" y="120" width="80" height="80" rx="10" fill="#FF6F61" />
          <path d="M80 220 L60 260 M120 220 L140 260" stroke="#4B5EAA" strokeWidth="10" />
          <path d="M60 140 Q100 100 140 140" stroke="#FFD700" strokeWidth="20" fill="none" />
        </motion.svg>
      </motion.div>

      {/* Form Section */}
      <motion.div
        className="w-full max-w-[360px] sm:max-w-[450px] md:max-w-[630px] lg:max-w-[700px] p-6 sm:p-4 lg:p-6 relative z-10 mt-16 sm:mt-0"
        // TWEAK HERE: max-w-[90%] for mobile form width (~360px on 400px screens, ~600px on 828px screens)
        // Try: max-w-[85%], max-w-[95%], max-w-[500px], max-w-[600px] to adjust within 440px–630px
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <form
          className="bg-white p-6 sm:p-4 lg:p-8 rounded-xl shadow-lg w-full"
          // TWEAK HERE: p-8 for mobile form padding
          // Try: p-7, p-9, p-10 for more/less internal spacing
          onSubmit={handleSubmit}
        >
          <h1
            className="text-xl sm:text-xl lg:text-2xl font-bold text-gray-800 mb-8 sm:mb-6 text-center"
          >
            Unlock Your Dev Potential: Your Coding Journey Starts Here!
          </h1>
          <div className="space-y-4 sm:space-y-4">
            <div className="flex items-center gap-3 sm:gap-3">
              <FontAwesomeIcon icon={faUser} className="text-gray-500 text-base sm:text-base" />
              <input
                type="text"
                name="name"
                value={name}
                placeholder="Your full name"
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 text-base sm:text-base border border-gray-300 hover:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-3 flex-1">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 text-base sm:text-base" />
              <input
                type="email"
                name="email"
                value={email}
                placeholder="Your Email Address"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 text-base sm:text-base border border-gray-300 hover:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-3 sm:gap-3">
              <FontAwesomeIcon
                icon={faChalkboardTeacher}
                className="text-gray-500 text-base sm:text-base"
              />
              <select
                name="role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 text-base sm:text-base border border-gray-300 rounded-md focus:outline-none hover:border-gray-600 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a Path</option>
                <option value="frontend">Frontend Development</option>
                <option value="backend">Backend Development</option>
                <option value="fullstack">Fullstack Development</option>
              </select>
            </div>

            <div className="flex items-center gap-3 sm:gap-3">
              <FontAwesomeIcon icon={faCreditCard} className="text-gray-500 text-base sm:text-base" />
              <select
                name="paymentMethod"
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
                required
                className="w-full p-3 text-base sm:text-base border border-gray-300 hover:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Payment method</option>
                <option value="Paystack">Paystack</option>
                <option value="Stripe">Stripe</option>
              </select>
            </div>

            <div className="flex items-center gap-3 sm:gap-3">
              <FontAwesomeIcon
                icon={faQuestionCircle}
                className="text-gray-500 text-base sm:text-base"
              />
              <input
                type="text"
                name="howHeard"
                value={howHeard}
                placeholder="How Did You Discover Us?"
                onChange={(e) => setHowHeard(e.target.value)}
                required
                className="w-full p-3 text-base sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 hover:border-gray-600 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-3 sm:gap-3">
              <FontAwesomeIcon icon={faUser} className="text-gray-500 text-base sm:text-base" />
              <input
                type="text"
                name="discordId"
                value={discordId}
                placeholder="Enter your discord ID"
                onChange={(e) => setDiscordID(e.target.value)}
                required
                className="w-full p-3 text-base sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 hover:border-gray-600 focus:ring-blue-500"
              />
            </div>
            <p
              style={{
                fontSize: "0.9em",
                color: "#666",
                textAlign: "center",
              }}
            >
              Get from Discord: Settings → Advanced → Developer Mode → Profile → Copy User ID
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full p-3 sm:p-3 text-base sm:text-base bg-blue-500 text-white rounded-md hover:bg-blue-600 font-semibold shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                "Processing..."
              ) : (
                <>
                  <FontAwesomeIcon icon={faRocket} />
                  <span>Begin Your Journey</span>
                </>
              )}
            </button>
          </div>
        </form>
        <Link
          href="/about"
          className="text-base sm:text-base text-white hover:text-blue-300 transition-colors block sm:hidden text-center mt-6 sm:mt-6"
        >
          Why CoreAcademy?
        </Link>
      </motion.div>

      {/* Toast Notification */}
      <ToastContainer
        className="fixed top-4 w-full max-w-[280px] sm:max-w-[320px] text-sm sm:text-base z-50 toast-container-center"
        toastClassName="bg-white text-gray-800 p-3 sm:p-4 rounded-lg shadow-lg text-center w-full"
/>
    </main>
  );
}