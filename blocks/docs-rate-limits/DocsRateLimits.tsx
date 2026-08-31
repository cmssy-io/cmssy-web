import type { BlockProps } from "@cmssy/react";
import { Container } from "../../components/container";
import type { DeliveryLimits } from "@/lib/limits";
import type { docsRateLimitsProps } from "./block";

export default function DocsRateLimits({
  content,
  data,
}: BlockProps<
  typeof docsRateLimitsProps,
  { delivery?: DeliveryLimits | null }
>) {
  const {
    title,
    description,
    perWorkspaceLabel = "",
    perIpLabel = "",
    unitLabel = "",
    scopeHeader = "",
    limitHeader = "",
    caveat,
  } = content;

  const delivery = data?.delivery ?? null;
  if (!delivery) return null;

  const rows = [
    { label: perWorkspaceLabel, value: delivery.perWorkspacePerMinute },
    { label: perIpLabel, value: delivery.perIpPerMinute },
  ];

  return (
    <Container as="section" className="py-6">
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold font-mono">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="text-left font-semibold px-4 py-3">{scopeHeader}</th>
              <th className="text-left font-semibold px-4 py-3">{limitHeader}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.label}
                className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 align-top">{row.label}</td>
                <td className="px-4 py-3 align-top">
                  <code className="text-[13px] font-mono font-semibold text-primary">
                    {row.value.toLocaleString("en-US")}
                  </code>{" "}
                  <span className="text-muted-foreground">{unitLabel}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {caveat && <p className="text-sm text-muted-foreground mt-3">{caveat}</p>}
    </Container>
  );
}
