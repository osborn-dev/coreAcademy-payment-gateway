import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import { faDiscord, faInstagram } from "@fortawesome/free-brands-svg-icons";

export default function PlatformFooter() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-white/10 mt-20 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Top grid: brand + columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand block */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faCode} className="text-blue-600 dark:text-blue-400 text-xl" />
              <span className="text-gray-900 dark:text-white font-bold">CoreAcademy</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Your launchpad into tech.</p>
          </div>

          {/* Explore column */}
          <div>
            <p className="text-gray-900 dark:text-white font-semibold text-sm mb-3">Explore</p>
            <Link href="/explore" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors block py-1">Explore</Link>
            <Link href="/topics/frontend" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors block py-1">Frontend</Link>
            <Link href="/bookings" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors block py-1">Book a Session</Link>
            <Link href="/search" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors block py-1">Search</Link>
          </div>

          {/* Company column */}
          <div>
            <p className="text-gray-900 dark:text-white font-semibold text-sm mb-3">Company</p>
            <Link href="/about" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors block py-1">About</Link>
            <Link href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors block py-1">Terms</Link>
            <Link href="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors block py-1">Privacy</Link>
          </div>

          {/* Community column */}
          <div>
            <p className="text-gray-900 dark:text-white font-semibold text-sm mb-3">Community</p>
            <a
              href="https://discord.gg/BAbVZBAn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors flex items-center gap-2 py-1"
            >
              <FontAwesomeIcon icon={faDiscord} />
              Discord
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors flex items-center gap-2 py-1"
            >
              <FontAwesomeIcon icon={faInstagram} />
              Instagram
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-gray-200 dark:border-white/10 mt-10 pt-6">
          <p className="text-gray-500 dark:text-gray-500 text-sm">© 2026 CoreAcademy</p>
        </div>
      </div>
    </footer>
  );
}
