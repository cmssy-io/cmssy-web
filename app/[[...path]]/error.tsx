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
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-sky-600">
        Something went wrong
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        We hit an unexpected error
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page failed to load. You can try again, or head back to the
        homepage.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="inline-flex h-11 items-center rounded-xl bg-sky-600 px-5 text-sm font-medium text-white transition-colors hover:bg-sky-700"
        >
          Try again
        </button>
        <a
          href="/"
          className="inline-flex h-11 items-center rounded-xl border px-5 text-sm font-medium transition-colors hover:bg-muted"
        >
          Go home
        </a>
      </div>
    </main>
  );
}
