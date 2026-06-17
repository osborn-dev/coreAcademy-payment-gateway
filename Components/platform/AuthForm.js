"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";

export default function AuthForm({ mode, callbackUrl = "/" }) {
  const router = useRouter();
  const isSignup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (isSignup) {
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirm) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    try {
      if (isSignup) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        if (res.status === 201) {
          await signIn("credentials", { redirect: false, email, password, callbackUrl });
          router.push(callbackUrl);
        } else if (res.status === 409) {
          setError("Email already in use.");
        } else {
          setError("Please check your details.");
        }
      } else {
        const res = await signIn("credentials", { redirect: false, email, password, callbackUrl });
        if (res?.error) {
          setError("Invalid email or password.");
        } else {
          router.push(callbackUrl);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  const toggleHref = isSignup
    ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <div className="bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-8 w-full max-w-md mx-auto">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {isSignup ? "Create an account" : "Sign in"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isSignup && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
        />
        {isSignup && (
          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
          />
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-2.5 font-semibold transition-colors disabled:opacity-60"
        >
          {loading ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <hr className="flex-1 border-gray-200 dark:border-white/10" />
        <span className="text-gray-400 text-xs">or</span>
        <hr className="flex-1 border-gray-200 dark:border-white/10" />
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full border border-gray-200 dark:border-white/10 rounded-xl py-2.5 flex items-center justify-center gap-2 hover:bg-black/[0.03] dark:hover:bg-white/5 text-gray-900 dark:text-white transition-colors"
        >
          <FontAwesomeIcon icon={faGoogle} />
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => signIn("github", { callbackUrl })}
          className="w-full border border-gray-200 dark:border-white/10 rounded-xl py-2.5 flex items-center justify-center gap-2 hover:bg-black/[0.03] dark:hover:bg-white/5 text-gray-900 dark:text-white transition-colors"
        >
          <FontAwesomeIcon icon={faGithub} />
          Continue with GitHub
        </button>
      </div>

      <p className="text-center text-sm text-gray-400 mt-6">
        {isSignup ? "Already have an account? " : "Don't have an account? "}
        <Link href={toggleHref} className="text-blue-400 hover:text-blue-300 transition-colors">
          {isSignup ? "Sign in" : "Sign up"}
        </Link>
      </p>
    </div>
  );
}
