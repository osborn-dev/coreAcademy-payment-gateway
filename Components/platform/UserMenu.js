"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function UserMenu({ user }) {
  const [open, setOpen] = useState(false);

  const initial = (user.name || user.email || "?").charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold overflow-hidden focus:outline-none"
        aria-label="User menu"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt={user.name ?? "avatar"} className="w-full h-full object-cover" />
        ) : (
          initial
        )}
      </button>

      {open && (
        <>
          {/* Backdrop to close on outside click */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-lg p-3 z-50">
            {user.name && (
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
            )}
            {user.email && (
              <p className="text-gray-500 text-xs truncate mt-0.5">{user.email}</p>
            )}
            <hr className="my-2 border-gray-200 dark:border-white/10" />
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full text-left text-sm text-red-500 hover:text-red-400 transition-colors py-1 px-1 rounded"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
