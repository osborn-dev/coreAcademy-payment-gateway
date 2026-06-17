'use client'

import Script from 'next/script'
import TimezoneSelect from 'react-timezone-select'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCode,
  faArrowLeft,
  faCalendarCheck,
  faClock,
  faVideo,
  faLightbulb,
} from '@fortawesome/free-solid-svg-icons'

const sessionBenefits = [
  { icon: faCalendarCheck, text: 'Personalized learning plan for your goals' },
  { icon: faVideo, text: 'Live 1-on-1 with a CoreAcademy mentor' },
  { icon: faClock, text: '30-minute focused session' },
  { icon: faLightbulb, text: 'Answers to your most pressing dev questions' },
];

export default function BookingsPage() {
  const [selectedTimezone, setSelectedTimezone] = useState('')

  useEffect(() => {
    setSelectedTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 relative overflow-hidden transition-colors">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="absolute top-6 left-6 sm:left-8 flex items-center gap-2 z-20">
        <FontAwesomeIcon icon={faCode} className="text-blue-600 dark:text-blue-400 text-xl" />
        <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">CoreAcademy</span>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8">
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          Back to Home
        </Link>

        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Transition Into Tech<br />
            <span className="text-blue-600 dark:text-blue-400">With Confidence</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            Book a free 1-on-1 session with a mentor and get a clear roadmap for your journey into tech.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {sessionBenefits.map((b) => (
            <div key={b.text} className="bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 flex items-center gap-3">
              <FontAwesomeIcon icon={b.icon} className="text-blue-600 dark:text-blue-400 text-sm flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-300 text-xs leading-tight">{b.text}</span>
            </div>
          ))}
        </div>

        {/* Calendar card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-4 flex items-center justify-between">
            <h2 className="text-white font-semibold">Schedule a Session</h2>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg">
              <FontAwesomeIcon icon={faClock} className="text-white text-xs" />
              <span className="text-white text-xs">30 min</span>
            </div>
          </div>
          <div className="p-4 border-b border-gray-100">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Your Timezone
            </label>
            <TimezoneSelect
              value={selectedTimezone}
              onChange={(tz) => setSelectedTimezone(typeof tz === 'string' ? tz : tz.value)}
              className="text-sm"
            />
            <p className="mt-2 text-xs text-gray-400">
              Slots display in: <strong>{selectedTimezone || 'Loading...'}</strong>
            </p>
          </div>

          <Script
            src="https://assets.calendly.com/assets/external/widget.js"
            strategy="afterInteractive"
            async
          />
          <div
            className="calendly-inline-widget w-full"
            data-url={`https://calendly.com/coreacademy-dev?tz=${encodeURIComponent(selectedTimezone)}&hide_gdpr_banner=1`}
            style={{ minWidth: '320px', height: '500px' }}
          />
        </div>
      </div>
    </main>
  )
}
