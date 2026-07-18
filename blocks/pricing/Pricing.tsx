"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { CmssyLink } from "@cmssy/next/client";
import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import type { pricingProps } from "./block";

export default function Pricing({ content }: BlockProps<typeof pricingProps>) {
  const {
    fig = "FIG 6.0",
    eyebrow = "",
    heading = "",
    description = "",
    trialNotice = "",
    popularBadgeText = "MOST POPULAR",
    annualDiscountLabel = "Annual −20%",
    plans = [],
  } = content;
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="bg-wash py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <FigEyebrow fig={fig} label={eyebrow} />
          <h2 className="font-heading mt-5 text-4xl font-semibold tracking-tight text-ink text-balance">
            {heading}
          </h2>
          {description && (
            <p className="mt-4 text-lg text-ink/60">{description}</p>
          )}
          <div className="mt-8 inline-flex rounded-full border border-ink/15 bg-white p-1">
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
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl items-stretch gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const price =
              !annual && plan.priceMonthly ? plan.priceMonthly : plan.price;
            const period =
              !annual && plan.periodMonthly ? plan.periodMonthly : plan.period;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-7 ${
                  plan.popular
                    ? "border-elektryk/40 bg-ink text-paper shadow-xl shadow-elektryk/15 lg:scale-[1.03]"
                    : "border-ink/10 bg-white text-ink"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-elektryk px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] text-ink uppercase">
                    {popularBadgeText}
                  </span>
                )}
                <h3 className="font-heading text-xl font-semibold">
                  {plan.name}
                </h3>
                <p
                  className={`mt-2 text-sm ${
                    plan.popular ? "text-paper/60" : "text-ink/60"
                  }`}
                >
                  {plan.description}
                </p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-heading text-4xl font-semibold">
                    {price}
                  </span>
                  {period && (
                    <span
                      className={`font-mono text-[12px] ${
                        plan.popular ? "text-paper/50" : "text-ink/50"
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
                          plan.popular ? "text-elektryk" : "text-elektryk-700"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          plan.popular ? "text-paper/80" : "text-ink/75"
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
                      : "border border-ink/15 text-ink hover:border-ink/35"
                  }`}
                >
                  {plan.cta}
                </CmssyLink>
              </div>
            );
          })}
        </div>
        {trialNotice && (
          <p className="mt-8 text-center font-mono text-[12px] text-ink/45">
            {trialNotice}
          </p>
        )}
      </Container>
    </section>
  );
}
