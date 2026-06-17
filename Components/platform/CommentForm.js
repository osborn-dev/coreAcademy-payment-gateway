"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

// Client comment composer for a lesson. Logged-out users see a sign-in prompt;
// logged-in users get a textarea that POSTs to the comment API and refreshes the
// server-rendered list on success.
const MAX_BODY = 2000;

export default function CommentForm({ lessonId, callbackUrl }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (status === "loading") {
    return <div className="h-24 rounded-2xl bg-black/[0.03] dark:bg-white/5 animate-pulse" />;
  }

  if (!session?.user) {
    return (
      <div className="bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 text-center">
        <p className="text-gray-700 dark:text-gray-200 font-medium mb-3">
          Log in to join the discussion
        </p>
        <Link
          href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="inline-block px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Log in
        </Link>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const trimmed = body.trim();
    if (!trimmed) {
      setError("Comment cannot be empty.");
      return;
    }
    if (trimmed.length > MAX_BODY) {
      setError(`Comment must be ${MAX_BODY} characters or fewer.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: trimmed }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Could not post comment.");
      }
      setBody("");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        maxLength={MAX_BODY}
        placeholder="Share your thoughts or ask a question…"
        className="w-full rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y"
      />
      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {body.length}/{MAX_BODY}
        </span>
        <button
          type="submit"
          disabled={loading || !body.trim()}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors"
        >
          {loading ? "Posting…" : "Post comment"}
        </button>
      </div>
    </form>
  );
}
