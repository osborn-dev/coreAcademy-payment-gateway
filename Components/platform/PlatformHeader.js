"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

export default function PlatformHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 shadow-lg shadow-black/5 dark:bg-gray-900/90 dark:shadow-black/20 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCode} className="text-blue-500 dark:text-blue-400 text-xl" />
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">CoreAcademy</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/explore"
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors hidden md:block"
          >
            Explore
          </Link>
          <Link
            href="/courses"
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors hidden md:block"
          >
            Courses
          </Link>
          <Link
            href="/bookings"
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors hidden md:block"
          >
            Book a Session
          </Link>
          <Link
            href="/search"
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors flex items-center gap-1.5"
            aria-label="Search"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-base" />
            <span className="hidden md:inline">Search</span>
          </Link>
          <ThemeToggle />
          <a
            href="https://discord.gg/BAbVZBAn"
            className="text-sm text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/30"
          >
            <FontAwesomeIcon icon={faDiscord} className="text-lg" />
            <span className="hidden sm:inline">Join The Server</span>
          </a>
          {status === "loading" ? (
            <span className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 animate-pulse" />
          ) : session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
