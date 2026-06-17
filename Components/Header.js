"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-900/90 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCode} className="text-blue-400 text-xl" />
          <span className="text-xl font-bold text-white tracking-tight">CoreAcademy</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/about"
            className="text-sm text-gray-300 hover:text-white transition-colors hidden md:block"
          >
            Why CoreAcademy?
          </Link>
          <Link
            href="/bookings"
            className="text-sm text-gray-300 hover:text-white transition-colors hidden md:block"
          >
            Book a Session
          </Link>
          <a
            href="https://discord.gg/BAbVZBAn"
            className="text-sm text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/30"
          >
            <FontAwesomeIcon icon={faDiscord} className="text-lg" />
            <span className="hidden sm:inline">Join The Server</span>
          </a>
        </nav>
      </div>
    </header>
  );
}