import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { localizeHref, type CmssyBlockContext } from "@cmssy/react";
import { Container } from "../../../components/container";
import { BlockContent } from "./block";

export default function Pricing({
  content,
  context,
}: {
  content: BlockContent;
  context?: CmssyBlockContext;
}) {
  const {
    heading,
    headingHighlight,
    description,
    popularBadgeText,
    plans = [],
  } = content;

  return (
    <section id="pricing" className="py-24">
      <Container>
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {(heading || headingHighlight) && (
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {heading}{" "}
              {headingHighlight && (
                <span className="bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  {headingHighlight}
                </span>
              )}
            </h2>
          )}
          {description && (
            <p className="text-lg text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? "bg-linear-to-b from-violet-500 to-purple-600 text-white shadow-xl shadow-violet-500/25 scale-105"
                  : "bg-background border"
              }`}
            >
              {/* Popular badge */}
              {plan.popular && popularBadgeText && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-max">
                  <span className="bg-linear-to-r from-amber-400 to-orange-400 text-black text-xs font-bold px-4 py-1 rounded-full">
                    {popularBadgeText}
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p
                  className={`text-sm ${
                    plan.popular ? "text-violet-100" : "text-muted-foreground"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span
                  className={`text-sm ml-2 ${
                    plan.popular ? "text-violet-100" : "text-muted-foreground"
                  }`}
                >
                  {plan.period}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {(Array.isArray(plan?.features) ? plan.features : []).map(
                  (feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check
                        className={`w-5 h-5 shrink-0 mt-0.5 ${
                          plan.popular ? "text-violet-200" : "text-violet-500"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          plan.popular
                            ? "text-violet-50"
                            : "text-muted-foreground"
                        }`}
                      >
                        {feature.feature}
                      </span>
                    </li>
                  ),
                )}
              </ul>

              {/* CTA */}
              <Button
                asChild
                className={`w-full ${
                  plan.popular
                    ? "bg-white text-violet-600 hover:bg-violet-50"
                    : "bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                }`}
              >
                <a
                  href={
                    context?.locale
                      ? localizeHref(plan.href, context.locale)
                      : plan.href
                  }
                >
                  {plan.cta}
                </a>
              </Button>
            </div>
          ))}
        </div>

        {/* Money back guarantee */}
        {content.trialNotice && (
          <p className="text-center text-sm text-muted-foreground mt-12">
            {content.trialNotice}
          </p>
        )}
      </Container>
    </section>
  );
}
