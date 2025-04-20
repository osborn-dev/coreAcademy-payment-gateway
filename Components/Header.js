import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-800 shadow-md z-20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCode} className="text-blue-500 text-xl" />
          <span className="text-xl font-semibold text-white">CoreAcademy</span>
        </div>
        <nav className="flex items-center gap-11">
          <Link
            href="/about"
            className="text-lg text-white hover:text-blue-300 transition-colors hidden md:block"
          >
            Why CoreAcademy?
          </Link>
          <a
            href="https://discord.gg/BAbVZBAn"
            className="text-white bg-blue-500 px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            Join The Server
            <FontAwesomeIcon icon={faDiscord} className="text-white text-lg" />
          </a>
        </nav>
      </div>
    </header>
  );
}