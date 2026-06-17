"use client";
import { useState } from "react";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";

// Client wrapper for /search: holds the optional "about you" context and the
// committed context used for the actual query. The query itself comes from the
// URL (?q=) via initialQuery; SearchResults fires the API when query changes.
export default function SearchPanel({ initialQuery = "" }) {
  const [userContext, setUserContext] = useState("");

  return (
    <div>
      <SearchBar initialValue={initialQuery} size="large" />

      <details className="mt-3 group">
        <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors select-none">
          + Tell us about yourself for a better roadmap (optional)
        </summary>
        <textarea
          value={userContext}
          onChange={(e) => setUserContext(e.target.value)}
          rows={3}
          placeholder="e.g. I'm a beginner who knows a little HTML/CSS and wants to become a frontend developer."
          className="mt-3 w-full bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 text-sm p-4 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
        />
      </details>

      <SearchResults query={initialQuery} userContext={userContext} />
    </div>
  );
}
