import {
  ArrowRight,
  ChartColumn,
  Blocks,
  BookOpen,
  Box,
  BrainCircuit,
  Cloud,
  Code,
  Cpu,
  Database,
  FileText,
  Gauge,
  Globe,
  Headphones,
  Heart,
  CircleHelp,
  Image as ImageIcon,
  Key,
  Layers,
  LayoutGrid,
  Lock,
  Mail,
  MessageSquare,
  Monitor,
  Paintbrush,
  Palette,
  Puzzle,
  Rocket,
  Search,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Terminal,
  Users,
  WandSparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "../../../components/container";
import { LanguageSwitcher } from "../../../components/language-switcher";
import { BlockContent } from "./block";

const iconMap: Record<string, LucideIcon> = {
  ArrowRight,
  ChartColumn,
  Blocks,
  BookOpen,
  Box,
  BrainCircuit,
  Cloud,
  Code,
  Cpu,
  Database,
  FileText,
  Gauge,
  Globe,
  Headphones,
  Heart,
  CircleHelp,
  Image: ImageIcon,
  Key,
  Layers,
  LayoutGrid,
  Lock,
  Mail,
  MessageSquare,
  Monitor,
  Paintbrush,
  Palette,
  Puzzle,
  Rocket,
  Search,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Terminal,
  Users,
  WandSparkles,
  Zap,
};

function IconRenderer({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  if (!name || !iconMap[name]) return null;
  const Icon = iconMap[name];
  return <Icon className={className} />;
}

interface NavChild {
  label: string;
  description?: string;
  url: string;
  icon?: string;
  openInNewTab?: boolean;
}

interface NavItem {
  label: string;
  url?: string;
  openInNewTab?: boolean;
  columns?: "none" | "1" | "2" | "3";
  children?: NavChild[];
}

interface PlatformContext {
  auth?: {
    isAuthenticated: boolean;
    customer: {
      id: string;
      email: string;
      profile: {
        firstName?: string | null;
        lastName?: string | null;
        displayName?: string | null;
        avatarUrl?: string | null;
      };
    } | null;
    logout: () => Promise<void>;
  };
  locale?: {
    current: string;
    default: string;
    enabled: string[];
    localizeHref?: (href: string) => string;
  };
  language: string;
  isPreview?: boolean;
}

interface HeaderProps {
  content: BlockContent;
  context?: PlatformContext;
}

function MegaMenuItem({ child }: { child: NavChild }) {
  return (
    <Link
      href={child.url ?? "#"}
      target={child.openInNewTab ? "_blank" : undefined}
      rel={child.openInNewTab ? "noopener noreferrer" : undefined}
      className="group flex items-start gap-3 rounded-lg p-3 hover:bg-accent transition-colors"
    >
      {child.icon && iconMap[child.icon] && (
        <div className="mt-0.5 shrink-0 rounded-lg bg-violet-100 p-2 text-violet-600 transition-colors group-hover:bg-violet-500 group-hover:text-white dark:bg-violet-900/30 dark:text-violet-400">
          <IconRenderer name={child.icon} className="h-4 w-4" />
        </div>
      )}
      <div>
        <div className="text-sm font-medium">{child.label}</div>
        {child.description && (
          <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
            {child.description}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function Header({ content, context }: HeaderProps) {
  const {
    logo,
    logoText = "Brand",
    logoSize = "md",
    navigation = [],
    showCta = true,
    ctaLabel = "Get Started",
    ctaUrl = "/signup",
    showSecondaryCta = false,
    secondaryCtaLabel = "Log in",
    secondaryCtaUrl = "/login",
    showAnnouncement = false,
    announcementText = "",
    announcementLink = "",
    announcementBg = "#7c3aed",
    announcementTextColor = "#ffffff",
    announcementDismissible = true,
    logoutButtonText = "Log out",
    showLanguageSwitcher = false,
  } = content;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  const isAuthenticated = context?.auth?.isAuthenticated ?? false;
  const customer = context?.auth?.customer;
  const navItems = navigation as NavItem[];
  const i18n = context?.locale
    ? {
        enabledLanguages: context.locale.enabled,
        defaultLanguage: context.locale.default,
        currentLanguage: context.locale.current,
      }
    : undefined;
  const hasLanguageSwitcher =
    showLanguageSwitcher && i18n && i18n.enabledLanguages.length > 1;
  const homeHref =
    i18n && i18n.currentLanguage !== i18n.defaultLanguage
      ? `/${i18n.currentLanguage}`
      : "/";

  const hasDropdown = (item: NavItem) =>
    item.columns && item.columns !== "none" && item.children?.length;

  const closeDropdown = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    if (openDropdown === null) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isMobileMenuOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const logoSizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const logoTextSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const showAnnouncementBar =
    showAnnouncement && announcementText && !announcementDismissed;

  const getUserInitial = () => {
    if (customer?.profile?.displayName) {
      return customer.profile.displayName[0].toUpperCase();
    }
    if (customer?.profile?.firstName) {
      return customer.profile.firstName[0].toUpperCase();
    }
    if (customer?.email) {
      return customer.email[0].toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = () => {
    if (customer?.profile?.displayName) {
      return customer.profile.displayName;
    }
    if (customer?.profile?.firstName && customer?.profile?.lastName) {
      return `${customer.profile.firstName} ${customer.profile.lastName}`;
    }
    if (customer?.profile?.firstName) {
      return customer.profile.firstName;
    }
    return customer?.email ?? "";
  };

  const handleLogout = async () => {
    if (context?.auth?.logout) {
      await context.auth.logout();
    }
  };

  const getColumnClass = (columns?: string) => {
    switch (columns) {
      case "3":
        return "grid-cols-3 min-w-[680px]";
      case "2":
        return "grid-cols-2 min-w-[520px]";
      default:
        return "grid-cols-1 min-w-[280px]";
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      {showAnnouncementBar && (
        <div
          className="relative w-full text-center text-sm py-2 px-4"
          style={{
            backgroundColor: announcementBg,
            color: announcementTextColor,
          }}
        >
          {announcementLink ? (
            <Link href={announcementLink} className="hover:underline">
              {announcementText}
            </Link>
          ) : (
            <span>{announcementText}</span>
          )}
          {announcementDismissible && (
            <button
              onClick={() => setAnnouncementDismissed(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70"
              aria-label="Dismiss announcement"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Main Header */}
      <header
        ref={headerRef}
        className={`relative z-50 w-full transition-all duration-300 ${isScrolled || isMobileMenuOpen ? "bg-background/95 backdrop-blur-lg border-b shadow-sm" : "bg-background border-b"}`}
      >
        <Container as="nav">
          <div className="relative flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={homeHref} className="flex items-center gap-2">
              {logo ? (
                <Image
                  src={logo}
                  alt={logoText}
                  className={`${logoSizeClasses[logoSize]} object-contain`}
                  width={120}
                  height={40}
                />
              ) : (
                <div
                  className={`${logoSizeClasses[logoSize]} rounded-lg bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center`}
                >
                  <span className="text-white font-bold text-sm">
                    {logoText.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className={`font-bold ${logoTextSizeClasses[logoSize]}`}>
                {logoText}
              </span>
            </Link>

            {/* Desktop navigation - centered */}
            <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {navItems.map((item, index) =>
                hasDropdown(item) ? (
                  <div
                    key={index}
                    className="relative"
                    onMouseEnter={() => {
                      cancelClose();
                      setOpenDropdown(index);
                    }}
                    onMouseLeave={closeDropdown}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown(openDropdown === index ? null : index)
                      }
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md"
                      aria-expanded={openDropdown === index}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <svg
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === index ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Mega dropdown panel */}
                    {openDropdown === index && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50">
                        <div className="rounded-xl border bg-background/95 p-5 shadow-lg backdrop-blur-lg min-w-130">
                          <div
                            className={`grid gap-1 ${getColumnClass(item.columns)}`}
                          >
                            {item.children?.map((child, childIndex) => (
                              <MegaMenuItem key={childIndex} child={child} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={index}
                    href={item.url ?? "#"}
                    target={item.openInNewTab ? "_blank" : undefined}
                    rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md"
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-4">
              {hasLanguageSwitcher && (
                <LanguageSwitcher
                  enabledLanguages={i18n.enabledLanguages}
                  defaultLanguage={i18n.defaultLanguage}
                  currentLanguage={i18n.currentLanguage}
                  variant="compact"
                />
              )}
              {isAuthenticated && customer ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {customer.profile?.avatarUrl ? (
                      <Image
                        src={customer.profile.avatarUrl}
                        alt={getUserDisplayName()}
                        className="w-8 h-8 rounded-full object-cover"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {getUserInitial()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {logoutButtonText}
                  </button>
                </div>
              ) : (
                <>
                  {showSecondaryCta && (
                    <Link
                      href={secondaryCtaUrl}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {secondaryCtaLabel}
                    </Link>
                  )}
                  {showCta && (
                    <Link
                      href={ctaUrl}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white transition-colors"
                    >
                      {ctaLabel}
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 -mr-2 rounded-md hover:bg-muted/50 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile fullscreen overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="flex h-full flex-col bg-background">
            {/* Mobile header with logo + close */}
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <Link
                href={homeHref}
                className="flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {logo ? (
                  <Image
                    src={logo}
                    alt={logoText}
                    className={`${logoSizeClasses[logoSize]} object-contain`}
                    width={120}
                    height={40}
                  />
                ) : (
                  <div
                    className={`${logoSizeClasses[logoSize]} rounded-lg bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center`}
                  >
                    <span className="text-white font-bold text-sm">
                      {logoText.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className={`font-bold ${logoTextSizeClasses[logoSize]}`}>
                  {logoText}
                </span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 rounded-md hover:bg-muted/50 transition-colors"
                aria-label="Close menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="flex flex-col gap-6">
                {navItems.map((item, index) =>
                  hasDropdown(item) ? (
                    <div key={index}>
                      <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </div>
                      <div className="flex flex-col gap-1">
                        {item.children?.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            href={child.url ?? "#"}
                            target={child.openInNewTab ? "_blank" : undefined}
                            rel={
                              child.openInNewTab
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="flex items-start gap-3 rounded-lg p-3 hover:bg-accent transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {child.icon && iconMap[child.icon] && (
                              <div className="mt-0.5 shrink-0 rounded-lg bg-violet-100 p-2 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                                <IconRenderer
                                  name={child.icon}
                                  className="h-4 w-4"
                                />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium">
                                {child.label}
                              </div>
                              {child.description && (
                                <div className="mt-0.5 text-xs text-muted-foreground">
                                  {child.description}
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={index}
                      href={item.url ?? "#"}
                      target={item.openInNewTab ? "_blank" : undefined}
                      rel={
                        item.openInNewTab ? "noopener noreferrer" : undefined
                      }
                      className="text-lg font-semibold hover:text-foreground transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ),
                )}
              </div>
            </div>

            {/* Mobile Language Switcher */}
            {hasLanguageSwitcher && (
              <div className="border-t px-4 py-3">
                <LanguageSwitcher
                  enabledLanguages={i18n.enabledLanguages}
                  defaultLanguage={i18n.defaultLanguage}
                  currentLanguage={i18n.currentLanguage}
                  variant="full"
                />
              </div>
            )}

            {/* Mobile CTAs */}
            <div className="border-t px-4 py-4">
              {isAuthenticated && customer ? (
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {customer.profile?.avatarUrl ? (
                        <Image
                          src={customer.profile.avatarUrl}
                          alt={getUserDisplayName()}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {getUserInitial()}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium truncate max-w-45">
                      {getUserDisplayName()}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {logoutButtonText}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {showSecondaryCta && (
                    <Link
                      href={secondaryCtaUrl}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {secondaryCtaLabel}
                    </Link>
                  )}
                  {showCta && (
                    <Link
                      href={ctaUrl}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 w-full bg-linear-to-r from-violet-600 to-purple-600 text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {ctaLabel}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
