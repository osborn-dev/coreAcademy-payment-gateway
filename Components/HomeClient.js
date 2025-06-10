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
  faCode,faCalendar,faCalendarDays,
  faCalendarDay
} from "@fortawesome/free-solid-svg-icons";
import { faDiscord, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [discordId, setDiscordID] = useState('');
  const [howHeard, setHowHeard] = useState('');
  const [role, setRole] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  {/* Help Button for Wide Screens */}
  <button
    className="hidden lg:flex items-center justify-center p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
    onClick={() => alert("Help clicked! Replace with your help action.")} // Replace with your help action
    title="Get Help"
  >
    <FontAwesomeIcon icon={faQuestionCircle} className="text-white text-lg" />
  </button>
</div>

      {/* Animated Background Element */}
      <motion.div
        className="absolute inset-0 flex justify-center items-center p-4 sm:p-4 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
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
          className="bg-white p-6 sm:p-8 lg:p-8 rounded-xl shadow-lg border w-full max-w-3xl mx-1"
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
            <p
                style={{
                  fontSize: "0.9em",
                  color: "#666",
                  textAlign: "center",
                  marginTop: "1rem",
                }}
              >
                By proceeding, you acknowledge that you have read and understood, and agree to CoreAcademy&apos;s{" "}
                <Link
                  href="/terms"
                  className="text-blue-500 hover:text-blue-600 underline transition-colors"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-blue-500 hover:text-blue-600 underline transition-colors"
                >
                  Privacy Policy
                </Link>
              </p>
          </div>
        </form>
      {/* New Buttons Container */}
      <div className="mt-4 flex flex-row lg:hidden  gap-2 sm:gap-4 justify-center">
  {/* Instagram Button */}
  <a
    href="https://instagram.com/core.academy.ng"
    className="p-2 sm:p-4 bg-gray-600 text-white rounded-full hover:bg-blue-500 font-semibold flex items-center justify-center"
    title="Follow on Instagram"
  >
    <FontAwesomeIcon icon={faInstagram} className="text-base sm:text-xl" />
  </a>
  {/* Book a Session Button */}
  <button
    className="p-2 sm:p-4 bg-gray-600 text-white rounded-full hover:bg-blue-500 font-semibold flex items-center justify-center"
    onClick={() => alert("Book a Session clicked!")}
    title="Book a Session"
  >
    <FontAwesomeIcon icon={faCalendarDays} className="text-base sm:text-xl" />
  </button>
  {/* Help Button */}
  <button
    className="p-2 sm:p-4 bg-gray-600 text-white rounded-full hover:bg-blue-500 font-semibold flex items-center justify-center"
    onClick={() => alert("Help clicked!")}
    title="Get Help"
  >
    <FontAwesomeIcon icon={faQuestionCircle} className="text-base sm:text-xl" />
  </button>
</div>
<Link
  href="/about"
  className="text-base sm:text-base text-white hover:text-blue-300 transition-colors block sm:hidden text-center mt-4 sm:mt-6 underline"
>
  Why CoreAcademy?
</Link>
      {/* Instagram Button for Wide Screens (Bottom-Left) */}
      <a
        href="https://instagram.core.academy.ng" // Replace with your Instagram URL
        className="hidden lg:flex fixed bottom-4 left-10 p-3 bg-gray-600 text-white rounded-full hover:bg-gray-400 transition-colors items-center justify-center gap-2 z-50"
      >
        <FontAwesomeIcon icon={faInstagram} className="text-lg" />
      </a>
      </motion.div>

      {/* Toast Notification */}
      <ToastContainer
        className="fixed top-4 w-full max-w-[280px] sm:max-w-[320px] text-sm sm:text-base z-50 toast-container-center"
        toastClassName="bg-white text-gray-800 p-3 sm:p-4 rounded-lg shadow-lg text-center w-full"
/>
    </main>
  );
}