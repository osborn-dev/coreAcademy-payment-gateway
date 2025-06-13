'use client'

import Script from 'next/script'
import TimezoneSelect from 'react-timezone-select'
import { useState, useEffect } from 'react'

export default function BookingsPage() {
  const [selectedTimezone, setSelectedTimezone] = useState('')

  useEffect(() => {
    setSelectedTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Schedule Your Free Session</h1>
      <p className="text-gray-600 mb-6">
        Get personalized guidance on your tech career path
      </p>
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <label className="block text-sm font-medium mb-2">
          Your Timezone
        </label>
        <TimezoneSelect
          value={selectedTimezone}
          onChange={(tz) => setSelectedTimezone(tz.value)}
          className="text-sm"
        />
        <p className="mt-2 text-xs text-gray-500">
          Slots will display in: <strong>{selectedTimezone || 'Loading...'}</strong>
        </p>
      </div>

      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        async
      />
      <div
        className="calendly-inline-widget w-full min-h-[700px]"
        data-url="https://calendly.com/coreacademy-dev"
        style={{ minWidth: '320px', height: '700px' }}
      />
    </div>
  )
}