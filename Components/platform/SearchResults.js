"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PostCard from "./PostCard";
import MarkdownRenderer from "./MarkdownRenderer";

// Client side of /search. Given a query (from the URL) and optional user context,
// calls /api/ai/recommend and renders: skeleton while loading -> roadmap card +
// recommended posts grid + "coming soon" gap pills. Handles empty + error states.
export default function SearchResults({ query, userContext }) {
  const [state, setState] = useState("idle"); // idle | loading | done | error | needs-auth
  const [data, setData] = useState({ posts: [], roadmap: "", gaps: [] });

  useEffect(() => {
    if (!query || !query.trim()) {
      setState("idle");
      return;
    }
    let cancelled = false;
    setState("loading");

    fetch("/api/ai/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, userContext }),
    })
      .then(async (res) => {
        if (res.status === 401) {
          if (!cancelled) setState("needs-auth");
          return;
        }
        if (!res.ok) throw new Error("request failed");
        return res.json();
      })
      .then((json) => {
        if (cancelled || !json) return; // 401 path returned undefined — already handled
        setData({
          posts: json.posts ?? [],
          roadmap: json.roadmap ?? "",
          gaps: json.gaps ?? [],
        });
        setState("done");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [query, userContext]);

  if (state === "idle") {
    return (
      <p className="text-gray-500 dark:text-gray-500 text-center mt-12">
        Search above to get recommendations and a personalized roadmap.
      </p>
    );
  }

  if (state === "loading") {
    return (
      <div className="mt-10 space-y-6">
        <div className="bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 animate-pulse">
          <div className="h-4 w-40 bg-black/5 dark:bg-white/10 rounded mb-4" />
          <div className="h-3 w-full bg-black/5 dark:bg-white/10 rounded mb-2" />
          <div className="h-3 w-5/6 bg-black/5 dark:bg-white/10 rounded mb-2" />
          <div className="h-3 w-2/3 bg-black/5 dark:bg-white/10 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl h-64 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (state === "needs-auth") {
    return (
      <div className="mt-10 bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
        <p className="text-gray-700 dark:text-gray-200 font-medium mb-3">
          Sign in to get personalized recommendations
        </p>
        <Link
          href={`/login?callbackUrl=${encodeURIComponent(`/search?q=${query}`)}`}
          className="inline-block px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="mt-10 bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
        <p className="text-red-600 dark:text-red-300 font-medium mb-3">Something went wrong with that search.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  // done
  const noResults = data.posts.length === 0 && !data.roadmap;

  return (
    <div className="mt-10 space-y-10">
      {data.roadmap ? (
        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Your personalized roadmap</h2>
          <MarkdownRenderer content={data.roadmap} />
        </div>
      ) : null}

      {data.posts.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recommended for you</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      ) : null}

      {data.gaps.length > 0 ? (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Coming soon
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.gaps.map((gap) => (
              <span
                key={gap}
                className="px-3 py-1.5 rounded-full text-sm bg-black/[0.03] dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10"
              >
                {gap}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {noResults ? (
        <p className="text-gray-500 dark:text-gray-500 text-center">
          No matches yet — try different words, or browse{" "}
          <a href="/explore" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            everything
          </a>
          .
        </p>
      ) : null}
    </div>
  );
}
