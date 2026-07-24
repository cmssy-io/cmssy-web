"use client";

import Link from "next/link";
import { createContext, useContext, type ComponentProps } from "react";
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
