import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";
import { DEFAULT_CMSSY_API_URL, graphqlRequest } from "@cmssy/core";
import { cmssy } from "@/cmssy/config";
import { installCmssyFetchGuard } from "@/lib/cmssy-fetch-guard";

/* Every server path that talks to the CMS - the catch-all page, its metadata,
   its static params, the draft route - imports this module, and module init
   runs before any of them execute. That makes it the earliest point the site
   owns in each static-generation worker, which is where the build's 429s are
   raised and where `instrumentation.ts` was measured never to run. */
installCmssyFetchGuard();

/* The SDK refuses a `Retry-After` longer than its 10s default and returns the
   429 as if it were an answer. The delivery API asks for 27s when a build goes
   over its per-IP minute, so the ceiling has to clear that with room. */
const RETRY = { maxRetries: 4, maxRetryAfterMs: 45_000 };

export function publicRequest<Result, Variables>(
  document: TypedDocumentNode<Result, Variables>,
  variables: Variables,
  label?: string,
): Promise<Result> {
  return graphqlRequest<Result>(
    cmssy,
    print(document),
    variables as Record<string, unknown>,
    { public: true, retry: RETRY },
    label,
  );
}

export function resolveApiUrl(): string {
  const explicit = cmssy.apiUrl?.trim();
  if (explicit) return explicit;
  const fromEnv = process.env.CMSSY_API_URL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_CMSSY_API_URL;
}
