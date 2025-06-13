'use client'  

// Importing necessary dependencies
import Script from 'next/script'  // Next.js optimized script component
import TimezoneSelect from 'react-timezone-select'  // Timezone selector component
import { useState, useEffect } from 'react'  // React hooks

// Main component for the bookings page
export default function BookingsPage() {
  // State to store the selected timezone
  const [selectedTimezone, setSelectedTimezone] = useState('')

  // Effect hook to set the initial timezone to the user's browser timezone
  useEffect(() => {
    setSelectedTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])  // Empty dependency array means this runs only once on mount

  return (
    <div className="max-w-3xl mx-auto p-6">  {/* Main container with max width and padding */}
      {/* Page heading */}
      <h1 className="text-3xl font-bold mb-2">Schedule Your Free Session</h1>
      {/* Subheading */}
      <p className="text-gray-600 mb-6">
        Get personalized guidance on your tech career path
      </p>
      
      {/* Timezone selection section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <label className="block text-sm font-medium mb-2">
          Your Timezone
        </label>
        {/* Timezone select dropdown */}
        <TimezoneSelect
          value={selectedTimezone}
          onChange={(tz) => setSelectedTimezone(typeof tz === 'string' ? tz : tz.value)}
          className="text-sm"
        />
        {/* Display of currently selected timezone */}
        <p className="mt-2 text-xs text-gray-500">
          Slots will display in: <strong>{selectedTimezone || 'Loading...'}</strong>
        </p>
      </div>

      {/* Calendly script for embedding the scheduling widget */}
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"  // Loads after the page becomes interactive
        async  // Loads asynchronously
      /> 
      
      {/* Calendly inline widget container */}
      <div
        className="calendly-inline-widget w-full min-h-[700px]"
        data-url={`https://calendly.com/coreacademy-dev?tz=${encodeURIComponent(selectedTimezone)}`}
        style={{ minWidth: '320px', height: '700px' }}
      />
    </div>
  )
}