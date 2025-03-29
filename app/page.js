"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faUser, faEnvelope, faChalkboardTeacher, faCreditCard } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [discordId, setDiscordID] = useState('');
  const [howHeard, setHowHeard] = useState('');
  const [role, setRole] = useState(''); // Added state for role
  const [paymentMethod, setPaymentMethod] = useState(''); // Added state for paymentMethod
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Added for success feedback



  const astronautVariants = {
    float: {
      y: [-10, 10, -10],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !email || !role || !paymentMethod || !discordId || !howHeard) {
      setError('All fields are required')
      setSuccess('');
      return
  }
  try {
    const response = await fetch('api/submit',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, role, paymentMethod, discordId, howHeard })
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.message || 'Submission failed');
      setSuccess('');
      return
    }

  // Reset form on success
  setName('');
  setEmail('');
  setDiscordID('');
  setHowHeard('');
  setRole(''); // Reset role
  setPaymentMethod(''); // Reset payment method
  setError('');
  setSuccess('Submission successful!'); // Notify user of success

  setTimeout(() => {
    setSuccess('');
  }, 3000);

  } catch (error) {
    setError('Something went wrong')
    setSuccess('');
    console.log('Error submitting user information', error)
  }
}
  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Logo Top Left */}
      <div className="absolute top-8 left-8 flex items-center gap-2 z-20">
        <FontAwesomeIcon icon={faCode} className="text-orange-500 text-xl" />
        <span className="text-xl font-semibold text-white">{"CoreAcademy"}</span>
      </div>
      <div className="absolute top-8 right-8 flex items-center gap-2 z-20">
        <p className="text-xl font-semibold text-white">Why CoreAcademy?</p>
      </div>

      {/* Animated Astronaut - Always Background */}
      <motion.div
        className="absolute inset-0 flex justify-center items-center p-4 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 300"
          className="w-full max-w-xl h-auto lg:max-w-2xl"
          variants={astronautVariants}
          animate="float"
        >
          {/* Placeholder - Replace with your SVG */}
          <circle cx="100" cy="80" r="40" fill="#4B5EAA" />
          <rect x="60" y="120" width="80" height="100" rx="10" fill="#FF6F61" />
          <path d="M80 220 L60 260 M120 220 L140 260" stroke="#4B5EAA" strokeWidth="10" />
          <path d="M60 140 Q100 100 140 140" stroke="#FFD700" strokeWidth="5" fill="none" />
        </motion.svg>
      </motion.div>

      {/* Form Section - Foreground */}
      <motion.div
        className="w-full max-w-lg p-4 lg:max-w-2xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <form className="bg-white p-8 rounded-xl shadow-lg w-full" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            You are one click away from embarking on a journey that would change your life!
          </h1>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faUser} className="text-gray-500" />
              <input type="text" name="name" value={name} placeholder="Enter your name" onChange={e => setName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-500" />
              <input type="email" name="email" value={email} placeholder="Enter email" onChange={e => setEmail(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faChalkboardTeacher} className="text-gray-500" />
              <select name="role" required value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">Select a Role</option>
                <option value="frontend">Frontend Development</option>
                <option value="backend">Backend Development</option>
                <option value="fullstack">Fullstack Development</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faCreditCard} className="text-gray-500" />
              <select name="paymentMethod" onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod} required className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">Select a Payment method</option>
                <option value="Paystack">Paystack</option>
                <option value="Stripe">Stripe</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faUser} className="text-gray-500" />
              <input type="text" name="discordId" value={discordId} placeholder="Enter your discord ID" onChange={e => setDiscordID(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faUser} className="text-gray-500" />
              <input type="text" name="howHeard" value={howHeard} placeholder="How did you hear about us?" onChange={e => setHowHeard(e.target.value)}  required className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <button type="submit" className="w-full p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 font-semibold shadow-md">
              Pay now
            </button>
            {error && (<div className="bg-red-500 text-white w-fit text-sm py-1 rounded-md mt-2">{error}</div>)}
            {success && (<div className="bg-green-500 text-white w-fit text-sm py-1 rounded-md mt-2">{success}</div>)}
          </div>
        </form>
      </motion.div>
    </main>
  );
}