import { DEFAULT_CMSSY_API_URL } from "@cmssy/core";

/**
 * A 429-aware wrapper around `fetch`, installed for the delivery API only.
 *
 * The API allows 100 requests a minute per IP, and a production build asks it
 * for 90-odd pages across a dozen workers - several queries each - from a
 * single build IP. It answers 429 with `Retry-After: 27`, and nothing on that
 * path waits: `@cmssy/next` hands `fetchPage` no retry policy at all, so the
 * SDK's `fetchWithRetry` short-circuits to one attempt. One 429 anywhere in
 * the export then fails the whole deploy.
 *
 * Even where a policy *is* passed, the SDK's default `maxRetryAfterMs` is 10s
 * and its guard reads `if (asked > maxRetryAfterMs) return response`. An API
 * asking for 27s is therefore refused rather than waited out - so the caller
 * we own raises that ceiling itself, and this wrapper covers the ones we do
 * not.
 *
 * Installed by a side-effect import from `services/gateway.ts` rather than
 * from `instrumentation.ts`. `register()` was tried first and measured: its
 * log never appears in a build whose static-generation workers log freely, so
 * it does not run in them - and those workers are exactly where the 429s come
 * from.
 *
 * The proper home for both fixes is the SDK; this is what the site can do
 * without it.
 */

/** what the API allows, per IP, per minute */
const API_BUDGET_PER_MIN = 100;

/* Deliberately under the ceiling. A dev server, another agent's build and this
   one can share an IP, so taking the whole allowance would just move the 429
   onto somebody else. */
const TARGET_PER_MIN = Math.round(API_BUDGET_PER_MIN * 0.7);

/** small builds should still go straight through; only sustained load queues */
const BURST = 15;

const MAX_ATTEMPTS = 4;

/** the longest we will sit on a `Retry-After` before giving up on it */
const MAX_WAIT_MS = 60_000;

const RETRY_STATUSES = new Set([429, 503]);

declare global {
  var __cmssyFetchGuard: boolean | undefined;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function apiHost(): string | null {
  const raw = process.env.CMSSY_API_URL?.trim() || DEFAULT_CMSSY_API_URL;
  try {
    return new URL(raw).host;
  } catch {
    return null;
  }
}

function urlOf(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

/**
 * A token bucket, plus one shared cooldown.
 *
 * The cooldown is the part that matters: a 429 means *the IP* is over budget,
 * not that one caller was unlucky, so it has to stall everyone in flight. A
 * per-caller backoff would let the rest of the worker keep hammering and keep
 * the window shut.
 */
function createLimiter(perMinute: number, burst: number) {
  let tokens = burst;
  let last = Date.now();
  let pausedUntil = 0;
  const refillPerMs = perMinute / 60_000;

  return {
    async take() {
      for (;;) {
        const now = Date.now();
        if (now < pausedUntil) {
          await sleep(pausedUntil - now);
          continue;
        }
        tokens = Math.min(burst, tokens + (now - last) * refillPerMs);
        last = now;
        if (tokens >= 1) {
          tokens -= 1;
          return;
        }
        await sleep(Math.ceil((1 - tokens) / refillPerMs));
      }
    },
    pause(ms: number) {
      pausedUntil = Math.max(pausedUntil, Date.now() + ms);
    },
  };
}

function askedFor(response: Response): number | null {
  const raw = response.headers?.get("retry-after");
  if (!raw) return null;
  const seconds = Number(raw);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(raw);
  return Number.isFinite(date) ? Math.max(0, date - Date.now()) : null;
}

export function installCmssyFetchGuard(): void {
  if (globalThis.__cmssyFetchGuard) return;
  const host = apiHost();
  if (!host) return;
  globalThis.__cmssyFetchGuard = true;

  /* Rate limiting is a build-time concern: the burst comes from prerendering
     the whole site at once. At runtime a request is one visitor, and queueing
     those behind a bucket would buy latency to solve a problem they do not
     have - so serving keeps only the retry. */
  const building = process.env.NEXT_PHASE === "phase-production-build";
  const limiter = building ? createLimiter(TARGET_PER_MIN, BURST) : null;

  const original = globalThis.fetch;
  let waited = 0;
  let retried = 0;

  globalThis.fetch = async function cmssyGuardedFetch(input, init) {
    let mine = false;
    try {
      mine = new URL(urlOf(input), "http://localhost").host === host;
    } catch {
      mine = false;
    }
    if (!mine) return original(input, init);

    let response: Response | undefined;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      await limiter?.take();
      response = await original(input, init);
      if (!RETRY_STATUSES.has(response.status)) return response;
      if (attempt === MAX_ATTEMPTS) break;

      /* Exponential backoff only covers us when the server says nothing; when
         it does say something, that number is the truth and guessing shorter
         just spends another request on the same closed window. */
      const asked = askedFor(response);
      const wait = Math.min(asked ?? 500 * 2 ** attempt, MAX_WAIT_MS);
      limiter?.pause(wait);
      retried += 1;
      waited += wait;
      await sleep(wait);
    }
    console.warn(
      `[cmssy-web] delivery API still ${response?.status} after ${MAX_ATTEMPTS} attempts`,
    );
    return response as Response;
  } as typeof fetch;

  process.on?.("exit", () => {
    if (retried > 0) {
      console.log(
        `[cmssy-web] fetch guard: ${retried} retries, ${Math.round(waited / 1000)}s waited`,
      );
    }
  });
}
