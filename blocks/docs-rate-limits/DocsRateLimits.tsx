import type { BlockProps } from "@cmssy/react";
import { Container } from "../../components/container";
import { limitGroups, wordFor, type PublishedLimits } from "@/lib/limits";
import type { docsRateLimitsProps } from "./block";

export default function DocsRateLimits({
  content,
  context,
  data,
}: BlockProps<
  typeof docsRateLimitsProps,
  { published?: PublishedLimits | null }
>) {
  const {
    title,
    description,
    resourceHeader = "",
    scopeHeader = "",
    limitHeader = "",
    groups,
    vocabulary,
    adjustableLabel,
    caveat,
  } = content;

  const published = data?.published ?? null;
  const families = limitGroups(published, groups);
  if (families.length === 0) return null;

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

      <div className="space-y-6">
        {families.map((family) => (
          <div key={family.key}>
            <h4 className="text-sm font-semibold mb-1">{family.label}</h4>
            {family.description && (
              <p className="text-sm text-muted-foreground mb-2">
                {family.description}
              </p>
            )}
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="text-left font-semibold px-4 py-3">
                      {resourceHeader}
                    </th>
                    <th className="text-left font-semibold px-4 py-3">
                      {scopeHeader}
                    </th>
                    <th className="text-left font-semibold px-4 py-3">
                      {limitHeader}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {family.limits.map((limit) => (
                    <tr
                      key={limit.name}
                      className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 align-top">
                        {wordFor(vocabulary, limit.resource)}
                      </td>
                      <td className="px-4 py-3 align-top text-muted-foreground">
                        {wordFor(vocabulary, limit.scope)}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <code className="text-[13px] font-mono font-semibold text-primary">
                          {limit.value.toLocaleString(context?.locale.current)}
                        </code>{" "}
                        <span className="text-muted-foreground">
                          {wordFor(vocabulary, limit.unit)} /{" "}
                          {wordFor(vocabulary, limit.window)}
                        </span>
                        {limit.configurable && adjustableLabel && (
                          <span className="ml-2 rounded border px-1.5 py-0.5 text-[11px] text-muted-foreground">
                            {adjustableLabel}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {caveat && <p className="text-sm text-muted-foreground mt-3">{caveat}</p>}
    </Container>
  );
}
