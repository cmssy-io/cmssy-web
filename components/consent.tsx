"use client";

import { useSyncExternalStore } from "react";
import {
  type ConsentChoice,
  type ConsentState,
  analyticsCookieExpiries,
  consentUpdate,
  isAnalyticsCookie,
  parseConsent,
  serializeConsent,
} from "@/lib/consent";

type ConsentSnapshot = ConsentState | "pending";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function readConsent(): ConsentSnapshot {
  return parseConsent(document.cookie);
}

function pendingConsent(): ConsentSnapshot {
  return "pending";
}

declare global {
  interface Window {
    gtag?: (...command: [string, string, Record<string, string>]) => void;
  }
}

export function useConsent(): ConsentSnapshot {
  return useSyncExternalStore(subscribe, readConsent, pendingConsent);
}

export function setConsent(choice: ConsentChoice) {
  document.cookie = serializeConsent(choice, location.protocol === "https:");
  if (choice === "denied") {
    for (const expiry of analyticsCookieExpiries(
      document.cookie,
      location.hostname,
    )) {
      document.cookie = expiry;
    }
    for (const key of Object.keys(localStorage).filter(isAnalyticsCookie)) {
      localStorage.removeItem(key);
    }
  }
  window.gtag?.("consent", "update", consentUpdate(choice));
  for (const listener of listeners) listener();
}
