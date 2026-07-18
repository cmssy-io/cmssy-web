"use client";

import Image from "next/image";
import { Github, Linkedin, Twitter } from "lucide-react";
import { CmssyLink } from "@cmssy/next/client";
import type { BlockProps } from "@cmssy/react";
import { CmssyMark } from "@/components/cmssy-mark";
import { Container } from "@/components/container";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { footerProps } from "./block";

export default function Footer({
  content,
  context,
}: BlockProps<typeof footerProps>) {
  const {
    logo,
    logoText,
    tagline,
    linkColumns = [],
    showSocial = true,
    twitterUrl,
    githubUrl,
    linkedinUrl,
    metaLine,
    builtOnText,
    copyrightText,
    showLanguageSwitcher = false,
  } = content;

  const i18n = context?.locale
    ? {
        enabledLanguages: context.locale.enabled,
        defaultLanguage: context.locale.default,
        currentLanguage: context.locale.current,
      }
    : undefined;
  const hasLanguageSwitcher =
    showLanguageSwitcher && i18n && i18n.enabledLanguages.length > 1;

  const currentYear = new Date().getFullYear();
  const socials = [
    { url: twitterUrl, Icon: Twitter, label: "Twitter" },
    { url: githubUrl, Icon: Github, label: "GitHub" },
    { url: linkedinUrl, Icon: Linkedin, label: "LinkedIn" },
  ].filter((s) => s.url);

  return (
    <footer className="border-t border-white/8 bg-ink-deep text-[#9aa1ad]">
      <Container className="pt-16 pb-10">
        <div className="mb-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <CmssyLink href="/" className="mb-3.5 flex items-center gap-2.5 text-paper">
              {logo ? (
                <Image
                  src={logo}
                  alt={logoText || ""}
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              ) : (
                <CmssyMark className="h-[22px] w-auto" />
              )}
              {logoText && (
                <span className="font-heading text-xl font-bold tracking-tight">
                  {logoText}
                </span>
              )}
            </CmssyLink>
            {tagline && (
              <p className="mb-4 max-w-[280px] text-sm leading-relaxed">
                {tagline}
              </p>
            )}
            {metaLine && (
              <p className="font-mono text-[12px] text-[#5a606b]">{metaLine}</p>
            )}
            {showSocial && socials.length > 0 && (
              <div className="mt-5 flex gap-4">
                {socials.map(({ url, Icon, label }) => (
                  <a
                    key={label}
                    href={url}
                    aria-label={label}
                    className="transition-colors hover:text-paper"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {linkColumns.map((column) => (
            <div key={column.title}>
              <h4 className="font-heading mb-3.5 text-sm font-semibold text-paper">
                {column.title}
              </h4>
              <ul className="flex flex-col gap-2.5 text-sm">
                {(column.links ?? []).map((link) => (
                  <li key={link.name}>
                    <CmssyLink
                      href={link.href}
                      className="transition-colors hover:text-paper"
                    >
                      {link.name}
                    </CmssyLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-6 text-[13px] text-[#5a606b]">
          {copyrightText && (
            <span>
              © {currentYear} {copyrightText}
            </span>
          )}
          <div className="flex items-center gap-5">
            {hasLanguageSwitcher && i18n && <LanguageSwitcher i18n={i18n} />}
            {builtOnText && <span className="font-mono">{builtOnText}</span>}
          </div>
        </div>
      </Container>
    </footer>
  );
}
