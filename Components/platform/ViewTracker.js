"use client";
import { useEffect, useRef } from "react";

// Fires a single fire-and-forget POST to record a view when a post page mounts.
// A ref guards against React Strict Mode's double-mount in development so the
// count isn't double-incremented. Section 06 owns this component formally.
export default function ViewTracker({ slug }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    fetch(`/api/posts/${slug}/view`, { method: "POST" }).catch(() => {});
  }, [slug]);

  return null;
}
