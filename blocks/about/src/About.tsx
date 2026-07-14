import type { BlockProps } from "@cmssy/react";
import { Container } from "../../../components/container";
import type { aboutProps } from "../block";

// Icon components
function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

function RocketIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
      />
    </svg>
  );
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  sparkles: SparklesIcon,
  heart: HeartIcon,
  users: UsersIcon,
  zap: ZapIcon,
  globe: GlobeIcon,
  code: CodeIcon,
  shield: ShieldIcon,
  rocket: RocketIcon,
};

interface Value {
  icon: string;
  title: string;
  description: string;
}

interface TechItem {
  name: string;
  category: string;
}

export default function About({ content }: BlockProps<typeof aboutProps>) {
  const {
    badgeText,
    heading,
    headingHighlight,
    subtitle,
    missionHeading,
    missionText,
    valuesHeading,
    values = [],
    techStackHeading,
    showTechStack = true,
    techStack = [],
  } = content;

  return (
    <section className="relative min-h-screen py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-violet-50 via-background to-purple-50" />
      <div className="absolute top-0 right-0 w-125 h-125 bg-violet-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-purple-400/20 rounded-full blur-3xl" />

      <Container className="relative">
        {/* Header */}
        <div className="text-center mb-16">
          {badgeText && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-6">
              {badgeText}
            </span>
          )}
          {(heading || headingHighlight) && (
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {heading}{" "}
              {headingHighlight && (
                <span className="bg-linear-to-r from-violet-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                  {headingHighlight}
                </span>
              )}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Mission Section */}
        {missionText && (
          <div className="max-w-3xl mx-auto mb-20">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border shadow-xl shadow-violet-500/5 p-8 sm:p-12 text-center">
              <GlobeIcon className="w-12 h-12 mx-auto mb-6 text-violet-600" />
              {missionHeading && (
                <h2 className="text-2xl font-bold mb-4">{missionHeading}</h2>
              )}
              <p className="text-lg text-muted-foreground leading-relaxed">
                {missionText}
              </p>
            </div>
          </div>
        )}

        {/* Values Grid */}
        {(values as Value[]).length > 0 && (
          <div className="mb-20">
            {valuesHeading && (
              <h2 className="text-2xl font-bold text-center mb-10">
                {valuesHeading}
              </h2>
            )}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {(values as Value[]).map((value, index) => {
                const IconComponent = iconMap[value.icon] || SparklesIcon;
                return (
                  <div
                    key={index}
                    className="bg-card/50 backdrop-blur-sm rounded-2xl border shadow-lg shadow-violet-500/5 p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          {value.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        {showTechStack && (techStack as TechItem[]).length > 0 && (
          <div className="max-w-3xl mx-auto">
            {techStackHeading && (
              <h2 className="text-2xl font-bold text-center mb-10">
                <CodeIcon className="inline-block w-6 h-6 mr-2 text-violet-600" />
                {techStackHeading}
              </h2>
            )}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border shadow-xl shadow-violet-500/5 p-6 sm:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(techStack as TechItem[]).map((tech, index) => (
                  <div
                    key={index}
                    className="text-center p-4 rounded-xl bg-violet-50 border border-violet-100"
                  >
                    <p className="font-semibold text-sm">{tech.name}</p>
                    {tech.category && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {tech.category}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
