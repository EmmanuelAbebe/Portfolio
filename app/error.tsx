// app/error.tsx
"use client";

import { useEffect } from "react";

export default function Error({
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
    <main style={{ padding: 24 }}>
      <h1>Something broke</h1>
      <p>Try again.</p>
      <button onClick={reset}>Retry</button>
    </main>
  );
}
