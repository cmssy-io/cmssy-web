"use client";

import { Github, Linkedin, Twitter } from "lucide-react";
import { CmssyLink } from "@cmssy/next/client";
import { Container } from "../../../components/container";
import { LanguageSwitcher } from "../../../components/language-switcher";
import { BlockContent } from "./block";

interface PlatformContext {
  locale?: {
    current: string;
    default: string;
    enabled: string[];
    localizeHref?: (href: string) => string;
  };
}

export default function Footer({
  content,
  context,
}: {
  content: BlockContent;
  context?: PlatformContext;
}) {
  const {
    logo,
    logoText = "cmssy",
    tagline = "The modern CMS that makes website creation effortless.",
    linkColumns = [],
    showSocial = true,
    twitterUrl,
    githubUrl,
    linkedinUrl,
    copyrightText = "cmssy. All rights reserved.",
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

  return (
    <footer className="border-t bg-slate-50/50">
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 md:col-span-1 lg:col-span-2">
            <CmssyLink href="/" className="flex items-center gap-2 mb-4">
              {logo ? (
                <img src={logo} alt={logoText} className="h-8 w-auto" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {logoText.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="font-bold text-xl">{logoText}</span>
            </CmssyLink>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              {tagline}
            </p>

            {/* Social links */}
            {showSocial && (twitterUrl || githubUrl || linkedinUrl) && (
              <div className="flex gap-4">
                {twitterUrl && (
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (Twitter)"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Twitter className="size-5" />
                  </a>
                )}
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="size-5" />
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Linkedin className="size-5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Link columns */}
          {linkColumns.map((column, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-3">
                {(column.links || []).map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <CmssyLink
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </CmssyLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className={`mt-12 pt-8 border-t ${hasLanguageSwitcher ? "flex items-center justify-between" : ""}`}
        >
          <p
            className={`text-sm text-muted-foreground ${hasLanguageSwitcher ? "" : "text-center"}`}
          >
            © {currentYear} {copyrightText}
          </p>
          {hasLanguageSwitcher && (
            <LanguageSwitcher
              enabledLanguages={i18n.enabledLanguages}
              defaultLanguage={i18n.defaultLanguage}
              currentLanguage={i18n.currentLanguage}
              variant="full"
            />
          )}
        </div>
      </Container>
    </footer>
  );
}
