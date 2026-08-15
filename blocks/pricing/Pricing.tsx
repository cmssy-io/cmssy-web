"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { CmssyLink } from "@/components/cmssy-locale";
import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import type { pricingProps } from "./block";
import { findPlan, formatUsd, type Plan } from "@/lib/plans";

export default function Pricing({
  content,
  data,
}: BlockProps<typeof pricingProps, { plans?: Plan[] | null }>) {
  const {
    fig = "",
    eyebrow = "",
    heading = "",
    description = "",
    trialNotice = "",
    popularBadgeText = "",
    annualDiscountLabel = "",
    plans = [],
  } = content;
  const [annual, setAnnual] = useState(true);
  const served = data?.plans ?? null;

  function priceOf(planId: string): string | null {
    const plan = findPlan(served, planId);
    if (!plan) return null;
    if (plan.price) {
      return annual
        ? formatUsd(Math.round(plan.price.annual.amount / 12))
        : formatUsd(plan.price.monthly.amount);
    }
    if (plan.startingPriceUsdMonth !== null) {
      return `$${plan.startingPriceUsdMonth}+`;
    }
    return plan.id === "free" ? "$0" : null;
  }

  return (
    <section id="pricing" className="bg-muted py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <FigEyebrow fig={fig} label={eyebrow} />
          <h2 className="font-heading mt-5 text-4xl font-semibold tracking-tight text-foreground text-balance">
            {heading}
          </h2>
          {description && (
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          )}
          {annualDiscountLabel && (
            <div className="mt-8 inline-flex rounded-full border border-border bg-card p-1">
              {[
                { label: "Monthly", value: false },
                { label: annualDiscountLabel, value: true },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setAnnual(opt.value)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    annual === opt.value
                      ? "bg-ink text-paper"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl items-stretch gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = priceOf(plan.planId ?? "");
            const period =
              !annual && plan.periodMonthly ? plan.periodMonthly : plan.period;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-7 ${
                  plan.popular
                    ? "border-elektryk/40 bg-ink text-paper shadow-xl shadow-elektryk/15 lg:scale-[1.03]"
                    : "border-border bg-card text-foreground"
                }`}
              >
                {plan.popular && popularBadgeText && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-elektryk px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] text-ink uppercase">
                    {popularBadgeText}
                  </span>
                )}
                <h3 className="font-heading text-xl font-semibold">
                  {plan.name}
                </h3>
                <p
                  className={`mt-2 text-sm ${
                    plan.popular ? "text-paper/60" : "text-muted-foreground"
                  }`}
                >
                  {plan.description}
                </p>
                <div className="mt-6 flex items-baseline gap-2">
                  {price && (
                    <span className="font-heading text-4xl font-semibold">
                      {price}
                    </span>
                  )}
                  {price && period && (
                    <span
                      className={`font-mono text-[12px] ${
                        plan.popular ? "text-paper/50" : "text-muted-foreground"
                      }`}
                    >
                      {period}
                    </span>
                  )}
                </div>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {(plan.features ?? []).map((f) => (
                    <li key={f.feature} className="flex items-start gap-2.5">
                      <Check
                        className={`mt-0.5 size-4 shrink-0 ${
                          plan.popular ? "text-elektryk" : "text-primary"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          plan.popular ? "text-paper/80" : "text-foreground/75"
                        }`}
                      >
                        {f.feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <CmssyLink
                  href={plan.href || "#"}
                  className={`mt-7 block rounded-lg px-5 py-2.5 text-center text-sm font-medium transition-colors ${
                    plan.popular
                      ? "bg-elektryk font-semibold text-ink hover:bg-elektryk/85"
                      : "border border-border text-foreground hover:border-border"
                  }`}
                >
                  {plan.cta}
                </CmssyLink>
              </div>
            );
          })}
        </div>
        {trialNotice && (
          <p className="mt-8 text-center font-mono text-[12px] text-muted-foreground">
            {trialNotice}
          </p>
        )}
      </Container>
    </section>
  );
}
