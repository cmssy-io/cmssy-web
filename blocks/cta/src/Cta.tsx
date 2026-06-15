import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { localizeHref, type CmssyBlockContext } from "@cmssy/react";
import { Container } from "../../../components/container";
import { BlockContent } from "./block";

export default function Cta({
  content,
  context,
}: {
  content: BlockContent;
  context?: CmssyBlockContext;
}) {
  const {
    badgeText = "Start building today",
    heading = "Ready to create something",
    headingLine2 = "amazing?",
    description = "Join thousands of creators who trust cmssy to build their online presence. Start free, no credit card required.",
    primaryButtonText = "Get Started Free",
    primaryButtonUrl = "/signup",
    secondaryButtonText = "Talk to Sales",
    secondaryButtonUrl = "/contact",
  } = content;

  return (
    <section className="py-24">
      <Container>
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-violet-600 via-purple-600 to-violet-700" />

          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-2xl rotate-12" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-xl -rotate-12" />

          <div className="relative px-8 py-20 sm:px-16 sm:py-24 text-center">
            {badgeText && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>{badgeText}</span>
              </div>
            )}

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              {heading}
              {headingLine2 && (
                <>
                  <br />
                  {headingLine2}
                </>
              )}
            </h2>

            <p className="text-lg text-violet-100 max-w-2xl mx-auto mb-10">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {primaryButtonText && (
                <Button
                  size="lg"
                  asChild
                  className="bg-white text-violet-600 hover:bg-violet-50 text-lg px-8 h-14 shadow-lg"
                >
                  <a
                    href={
                      context?.locale
                        ? localizeHref(primaryButtonUrl, context.locale)
                        : primaryButtonUrl
                    }
                    className="flex items-center gap-2"
                  >
                    {primaryButtonText}
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </Button>
              )}
              {secondaryButtonText && (
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 text-lg px-8 h-14"
                >
                  <a
                    href={
                      context?.locale
                        ? localizeHref(secondaryButtonUrl, context.locale)
                        : secondaryButtonUrl
                    }
                  >
                    {secondaryButtonText}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
