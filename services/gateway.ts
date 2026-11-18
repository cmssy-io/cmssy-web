import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";
import { DEFAULT_CMSSY_API_URL, graphqlRequest } from "@cmssy/core";
import { NEXT_BUILD_PHASE, nextRetryMode } from "@cmssy/next";
import { cmssy } from "@/cmssy/config";

export function publicRequest<Result, Variables>(
  document: TypedDocumentNode<Result, Variables>,
  variables: Variables,
  label?: string,
): Promise<Result> {
  return graphqlRequest<Result>(
    cmssy,
    print(document),
    variables as Record<string, unknown>,
    { public: true, retry: nextRetryMode() },
    label,
  );
}

export function resolveApiUrl(): string {
  const explicit = cmssy.apiUrl?.trim();
  if (explicit) return explicit;
  const fromEnv = process.env.CMSSY_API_URL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_CMSSY_API_URL;
}

export function degradeOutsideBuild<T>(
  error: unknown,
  fallback: T,
  what: string,
): T {
  if (process.env.NEXT_PHASE === NEXT_BUILD_PHASE) throw error;
  console.error(`[cmssy-web] ${what} could not be fetched`, error);
  return fallback;
}
