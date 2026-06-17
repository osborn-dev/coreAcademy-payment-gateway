"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faQuestionCircle,
  faRocket,
  faCode,
  faCalendarDays,
  faCheck,
  faChevronRight,
  faChevronLeft,
  faUsers,
  faBolt,
  faShield,
  faLayerGroup,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { faDiscord, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const features = [
  {
    icon: faLayerGroup,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    title: "Structured Learning Paths",
    desc: "Frontend, Backend, and Fullstack tracks built for real progress.",
  },
  {
    icon: faBolt,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    title: "Weekly Live Sessions",
    desc: "Guided sessions every week — not passive video courses.",
  },
  {
    icon: faUsers,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    title: "Active Community",
    desc: "A Discord community of devs grinding alongside you.",
  },
  {
    icon: faShield,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    title: "Built With Purpose",
    desc: "A portion of every payment funds CoreFoundation's outreach.",
  },
];

const testimonials = [
  {
    name: "Chidi O.",
    path: "Frontend",
    text: "The structure CoreAcademy gives is exactly what I was missing. The community keeps me accountable.",
    avatar: "CO",
  },
  {
    name: "Amara S.",
    path: "Fullstack",
    text: "I went from total beginner to building real projects in 3 months. The live sessions are incredible.",
    avatar: "AS",
  },
];

const stats = [
  { value: "500+", label: "Students" },
  { value: "3", label: "Tracks" },
  { value: "Weekly", label: "Live Sessions" },
  { value: "₦0", label: "Hidden Fees" },
];




export default function Home() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [discordId, setDiscordID] = useState('');
  const [howHeard, setHowHeard] = useState('');
  const [role, setRole] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDiscordHelp, setShowDiscordHelp] = useState(false);

  useEffect(() => {
    toast.info("Join the Discord server before proceeding with payment!", {
      position: "top-center",
      autoClose: 6000,
      hideProgressBar: true,
    });
  }, []);

  const handleNextStep = () => {
    if (!name || !email || !discordId || !howHeard) {
      toast.error("Please fill in all fields to continue");
      return;
    }
    if (!/^\d{17,19}$/.test(discordId)) {
      toast.error("Invalid Discord ID — copy it from Discord Settings → Advanced → Copy User ID.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!role || !paymentMethod) {
      toast.error("Please select a learning path and payment method");
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

      toast.success("Launching your payment portal...", {
        hideProgressBar: true,
        autoClose: 4000,
      });

      setTimeout(() => {
        window.location.href = data.paymentUrl;
      }, 1500);

    } catch (error) {
      toast.error("Submission failed — please try again", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
      });
      setIsSubmitting(false);
    }
  };

  const pathCards = [
    { value: "frontend", label: "Frontend", desc: "HTML, CSS, JS, React", icon: "🎨" },
    { value: "backend", label: "Backend", desc: "Node.js, APIs, DBs", icon: "⚙️" },
    { value: "fullstack", label: "Fullstack", desc: "Everything", icon: "🚀" },
  ];

  const paymentCards = [
    { value: "Paystack", label: "Paystack", desc: "Pay in Naira (NGN)", icon: "🇳🇬" },
    { value: "Stripe", label: "Stripe", desc: "Pay via USD / Card", icon: "💳" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <ToastContainer
        className="fixed top-4 w-full max-w-xs sm:max-w-sm text-sm z-50 toast-container-center"
        toastClassName="bg-white text-gray-800 p-3 rounded-lg shadow-lg text-center w-full"
      />

      {/* Background orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="absolute top-6 left-6 sm:left-8 flex items-center gap-2 z-20">
        <FontAwesomeIcon icon={faCode} className="text-blue-400 text-xl" />
        <span className="text-xl font-bold text-white tracking-tight">CoreAcademy</span>
      </div>
      <div className="absolute top-5 right-6 sm:right-8 flex items-center gap-3 z-20">
        <Link href="/about" className="text-sm text-gray-300 hover:text-white transition-colors hidden sm:block">
          Why CoreAcademy?
        </Link>
        <a
          href="https://discord.gg/eqQhNkcCm9"
          className="text-sm text-white bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/30"
        >
          <FontAwesomeIcon icon={faDiscord} />
          <span className="hidden sm:inline">Join The Server</span>
          <span className="sm:hidden">Discord</span>
        </a>
      </div>

      {/* Main layout */}
      <div className="w-full max-w-screen-xl mx-auto lg:grid lg:grid-cols-2 lg:gap-14 lg:items-center mt-16 lg:mt-0">

        {/* Left: Form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg mx-auto lg:mx-0"
        >
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-5">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step >= s ? "bg-blue-500 text-white" : "bg-white/10 text-gray-400"
                }`}>
                  {step > s ? <FontAwesomeIcon icon={faCheck} className="text-xs" /> : s}
                </div>
                <span className={`text-sm font-medium transition-colors ${step >= s ? "text-white" : "text-gray-500"}`}>
                  {s === 1 ? "Your Info" : "Choose Path"}
                </span>
                {s < 2 && <div className={`h-px w-8 transition-colors ${step > s ? "bg-blue-500" : "bg-white/20"}`} />}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-5">
              <h1 className="text-xl font-bold text-white">
                {step === 1 ? "Start Your Dev Journey" : "Pick Your Path"}
              </h1>
              <p className="text-blue-100 text-sm mt-1">
                {step === 1 ? "Fill in your details to get started" : "Choose your learning track and payment method"}
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">

                {/* Step 1 */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        type="text"
                        value={name}
                        placeholder="Your full name"
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition hover:border-gray-400"
                      />
                    </div>
                    <div className="relative">
                      <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        type="email"
                        value={email}
                        placeholder="Your email address"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition hover:border-gray-400"
                      />
                    </div>
                    <div className="relative">
                      <FontAwesomeIcon icon={faDiscord} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        type="text"
                        value={discordId}
                        placeholder="Your Discord User ID"
                        onChange={(e) => setDiscordID(e.target.value)}
                        className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition hover:border-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowDiscordHelp(!showDiscordHelp)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                        aria-label="Discord ID help"
                      >
                        <FontAwesomeIcon icon={faCircleInfo} className="text-sm" />
                      </button>
                    </div>
                    <AnimatePresence>
                      {showDiscordHelp && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 leading-relaxed"
                        >
                          <strong>How to find your Discord ID:</strong><br />
                          Settings → Advanced → Enable Developer Mode → Right-click your profile → Copy User ID
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="relative">
                      <FontAwesomeIcon icon={faQuestionCircle} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        type="text"
                        value={howHeard}
                        placeholder="How did you discover us?"
                        onChange={(e) => setHowHeard(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition hover:border-gray-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      Continue
                      <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                    </button>
                  </motion.div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <motion.form
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Learning Path
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {pathCards.map((p) => (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => setRole(p.value)}
                            className={`p-3 rounded-xl border-2 text-center transition-all ${
                              role === p.value
                                ? "border-blue-500 bg-blue-50 shadow-sm"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="text-2xl mb-1">{p.icon}</div>
                            <div className="text-xs font-semibold text-gray-800">{p.label}</div>
                            <div className="text-xs text-gray-400 mt-0.5 leading-tight hidden sm:block">{p.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Payment Method
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {paymentCards.map((p) => (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => setPaymentMethod(p.value)}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${
                              paymentMethod === p.value
                                ? "border-blue-500 bg-blue-50 shadow-sm"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="text-2xl mb-1">{p.icon}</div>
                            <div className="text-xs font-semibold text-gray-800">{p.label}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{p.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white rounded-lg font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Launching payment portal...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faRocket} />
                          Begin Your Journey
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 transition-colors"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                      Back
                    </button>
                    <p className="text-xs text-gray-400 text-center leading-relaxed">
                      By proceeding, you agree to CoreAcademy&apos;s{" "}
                      <Link href="/terms" className="text-blue-500 hover:underline">Terms</Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>.
                    </p>
                  </motion.form>
                )}

              </AnimatePresence>
            </div>
          </div>

          {/* Mobile quick links */}
          <div className="mt-5 grid grid-cols-3 gap-2 lg:hidden">
            <a
              href="https://instagram.com/core.academy.ng"
              className="flex flex-col items-center gap-1.5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition"
              title="Follow on Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} className="text-base" />
              <span className="text-xs text-gray-400">Instagram</span>
            </a>
            <Link
              href="/bookings"
              className="flex flex-col items-center gap-1.5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition"
            >
              <FontAwesomeIcon icon={faCalendarDays} className="text-base" />
              <span className="text-xs text-gray-400">Book Session</span>
            </Link>
            <Link
              href="/about"
              className="flex flex-col items-center gap-1.5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition"
            >
              <FontAwesomeIcon icon={faCircleInfo} className="text-base" />
              <span className="text-xs text-gray-400">About Us</span>
            </Link>
          </div>
        </motion.div>

        {/* Right: Social Proof (desktop only) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="hidden lg:block space-y-6"
        >
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Stop learning alone.<br />
              <span className="text-blue-400">Join the community.</span>
            </h2>
            <p className="text-gray-400 mt-3 text-base leading-relaxed max-w-md">
              CoreAcademy gives self-taught developers the structure, mentorship, and community
              they need to actually ship projects and get hired.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3">
            {features.map((f) => (
              <div key={f.title} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.08] transition-colors">
                <div className={`w-9 h-9 ${f.bg} rounded-lg flex items-center justify-center mb-3`}>
                  <FontAwesomeIcon icon={f.icon} className={`${f.color} text-sm`} />
                </div>
                <h3 className="text-white text-sm font-semibold mb-1">{f.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="space-y-3">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-gray-300 text-sm leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white text-xs font-semibold">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.path} track</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </main>
  );
}
