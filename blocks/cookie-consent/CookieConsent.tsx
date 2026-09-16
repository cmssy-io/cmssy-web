"use client";

import { useEffect, useState } from "react";
import type { BlockProps } from "@cmssy/react";
import { CmssyLink } from "@/components/cmssy-locale";
import { setConsent, useConsent } from "@/components/consent";
import { Button } from "@/components/ui/button";
import { OPEN_CONSENT_HASH, type ConsentChoice } from "@/lib/consent";
import { cn } from "@/lib/utils";
import type { cookieConsentProps } from "./block";

export default function CookieConsent({
  content,
  context,
}: BlockProps<typeof cookieConsentProps>) {
  const { title, body, acceptLabel, rejectLabel, policyLabel, policyUrl } =
    content;
  const consent = useConsent();
  const [reopened, setReopened] = useState(false);
  const inEditor = Boolean(context?.isPreview);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      if (!event.target.closest(`a[href$="${OPEN_CONSENT_HASH}"]`)) return;
      event.preventDefault();
      setReopened(true);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const open = inEditor || reopened || consent === "unset";
  if (!open || !body || !acceptLabel || !rejectLabel) return null;

  function choose(choice: ConsentChoice) {
    if (inEditor) return;
    setConsent(choice);
    setReopened(false);
  }

  return (
    <section
      role="region"
      aria-label={title || acceptLabel}
      className={cn(
        "z-[90] rounded-lg border border-white/10 bg-ink-deep p-5 text-paper shadow-lg",
        inEditor
          ? "relative mx-auto my-6 max-w-md"
          : "fixed inset-x-4 bottom-4 sm:left-auto sm:max-w-md",
      )}
    >
      {title ? (
        <h2 className="mb-2 font-heading text-base font-semibold">{title}</h2>
      ) : null}
      <p className="text-sm leading-relaxed text-paper/70">
        {body}
        {policyLabel && policyUrl ? (
          <>
            {" "}
            <CmssyLink
              href={policyUrl}
              className="text-elektryk underline-offset-4 hover:underline"
            >
              {policyLabel}
            </CmssyLink>
          </>
        ) : null}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button
          type="button"
          className="bg-paper text-ink hover:bg-paper/90"
          onClick={() => choose("denied")}
        >
          {rejectLabel}
        </Button>
        <Button
          type="button"
          className="bg-paper text-ink hover:bg-paper/90"
          onClick={() => choose("granted")}
        >
          {acceptLabel}
        </Button>
      </div>
    </section>
  );
}
