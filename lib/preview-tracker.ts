// src/lib/preview-tracker.ts
//
// Drop this into the preview page component to auto-track views
// Tracks: page load, page navigation, session duration, tab visibility
//
// Usage in your preview page:
//   import { usePreviewTracking } from '@/lib/preview-tracker'
//   
//   export default function PreviewPage({ slug }) {
//     usePreviewTracking(slug)
//     return <PreviewEngine ... />
//   }

"use client";

import { useEffect, useRef, useCallback } from "react";

// Generate a random session ID
function generateSessionId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Get or create session ID (persists for this tab only)
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  const key = "clinictech_session";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = generateSessionId();
    sessionStorage.setItem(key, id);
  }
  return id;
}

// Send tracking event
async function trackEvent(
  slug: string,
  pagePath: string,
  sessionId: string
): Promise<void> {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        page_path: pagePath,
        session_id: sessionId,
        referrer: document.referrer || null,
      }),
      // Don't block the page on tracking
      keepalive: true,
    });
  } catch {
    // Silently fail - tracking should never break the preview
  }
}

// ─── React Hook ───

export function usePreviewTracking(slug: string) {
  const sessionId = useRef<string>("");
  const startTime = useRef<number>(Date.now());
  const lastPage = useRef<string>("");
  const hasTracked = useRef<boolean>(false);

  // Track initial page load
  useEffect(() => {
    if (!slug || hasTracked.current) return;
    sessionId.current = getSessionId();
    hasTracked.current = true;

    trackEvent(slug, "/", sessionId.current);
    startTime.current = Date.now();
    lastPage.current = "/";
  }, [slug]);

  // Track page navigation within the preview
  const trackPageChange = useCallback(
    (pagePath: string) => {
      if (!slug || pagePath === lastPage.current) return;
      lastPage.current = pagePath;
      trackEvent(slug, pagePath, sessionId.current);
    },
    [slug]
  );

  // Track when they leave (session duration)
  useEffect(() => {
    if (!slug) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // They switched tabs or closed - log duration
        const duration = Math.round((Date.now() - startTime.current) / 1000);
        // Use sendBeacon for reliability on page close
        navigator.sendBeacon(
          "/api/track",
          JSON.stringify({
            slug,
            page_path: `__duration:${duration}s`,
            session_id: sessionId.current,
          })
        );
      }
    };

    const handleBeforeUnload = () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      navigator.sendBeacon(
        "/api/track",
        JSON.stringify({
          slug,
          page_path: `__duration:${duration}s`,
          session_id: sessionId.current,
        })
      );
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [slug]);

  return { trackPageChange };
}

// ─── Non-React version (for plain HTML/JS) ───

export function initPreviewTracking(slug: string) {
  const sessionId = getSessionId();
  trackEvent(slug, "/", sessionId);

  // Track duration on page leave
  const startTime = Date.now();
  window.addEventListener("beforeunload", () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    navigator.sendBeacon(
      "/api/track",
      JSON.stringify({
        slug,
        page_path: `__duration:${duration}s`,
        session_id: sessionId,
      })
    );
  });

  // Return a function to track page changes
  return (pagePath: string) => trackEvent(slug, pagePath, sessionId);
}
