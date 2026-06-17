"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

// Controlled search input. On submit, routes to /search?q=... so the query lives
// in the URL (shareable, back-button friendly). Used large on the /search page
// and can be reused compact elsewhere via the `size` prop.
export default function SearchBar({ initialValue = "", size = "large", placeholder }) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);

  function onSubmit(e) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const large = size === "large";

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="relative">
        <Search
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 ${
            large ? "w-5 h-5" : "w-4 h-4"
          }`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder ?? "What do you want to learn?"}
          className={`w-full bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-black/[0.05] dark:focus:bg-white/[0.07] transition-colors ${
            large ? "pl-12 pr-28 py-4 text-lg" : "pl-10 pr-20 py-2.5 text-sm"
          }`}
        />
        <button
          type="submit"
          className={`absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors ${
            large ? "px-5 py-2.5 text-sm" : "px-3 py-1.5 text-xs"
          }`}
        >
          Search
        </button>
      </div>
    </form>
  );
}
