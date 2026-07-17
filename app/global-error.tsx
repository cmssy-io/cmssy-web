"use client";

import { useEffect } from "react";

// Replaces the root layout when an error is thrown above it, so it must
// render its own <html>/<body> and cannot rely on Tailwind/global CSS.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          textAlign: "center",
          padding: "1rem",
          color: "#0f172a",
        }}
      >
        <h1 style={{ fontSize: "1.875rem", fontWeight: 700, margin: 0 }}>
          Something went wrong
        </h1>
        <p style={{ marginTop: "1rem", color: "#64748b", maxWidth: "28rem" }}>
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "2rem",
            height: "2.75rem",
            padding: "0 1.25rem",
            borderRadius: "0.75rem",
            border: "none",
            background: "#00A8F0",
            color: "#fff",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
