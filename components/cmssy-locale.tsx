"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, type ComponentProps } from "react";
import { localizeHref } from "@cmssy/core";

export interface LocaleContextValue {
  current: string;
  default: string;
  enabled: string[];
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function CmssyLocaleProvider({
  value,
  children,
}: {
  value: LocaleContextValue;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

/**
 * Keeps `<html lang>` on the language actually being read.
 *
 * The document is rendered by the root layout, which sits above the path and
 * therefore cannot know the locale - it ships the workspace default. A page in
 * another language corrects the attribute here, which screen readers and
 * hyphenation pick up; the hreflang alternates in the metadata are unaffected
 * and remain server-rendered.
 */
export function LocaleSync() {
  const locale = useCmssyLocale();
  const current = locale?.current;
  useEffect(() => {
    if (current) document.documentElement.lang = current;
  }, [current]);
  return null;
}

export function useCmssyLocale(): LocaleContextValue | null {
  return useContext(LocaleContext);
}

export interface CmssyLinkProps extends Omit<
  ComponentProps<typeof Link>,
  "href" | "locale"
> {
  href: string;
  locale?: LocaleContextValue;
}

export function CmssyLink({ href, locale, ...rest }: CmssyLinkProps) {
  const fromContext = useCmssyLocale();
  const active = locale ?? fromContext;
  const resolved = active ? localizeHref(href, active) : href;
  return <Link href={resolved} {...rest} />;
}
