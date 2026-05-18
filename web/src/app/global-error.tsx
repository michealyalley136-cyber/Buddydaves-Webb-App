"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui,sans-serif", background: "#f6f1e7", color: "#1f1f1f" }}>
        <div style={{ maxWidth: 480, margin: "4rem auto", padding: "0 1rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "2rem", color: "#4a2f22" }}>Buddy Dave&apos;s</h1>
          <p style={{ marginTop: "1rem" }}>The app failed to load. Refresh or restart the dev server.</p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 1.5rem",
              borderRadius: 9999,
              border: "none",
              background: "#0f6c74",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <p style={{ marginTop: "1.5rem" }}>
            <a href="/" style={{ color: "#0f6c74", fontWeight: 600 }}>
              Go to homepage
            </a>
          </p>
        </div>
      </body>
    </html>
  );
}
