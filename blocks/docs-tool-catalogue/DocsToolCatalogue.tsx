import type { BlockProps } from "@cmssy/react";
import { Container } from "../../components/container";
import type { docsToolCatalogueProps } from "./block";
import { catalogueRows } from "./rows";

export default function DocsToolCatalogue({
  content,
}: BlockProps<typeof docsToolCatalogueProps>) {
  const {
    title,
    description,
    toolHeader = "",
    permissionHeader = "",
    purposeHeader = "",
    noPermissionLabel = "",
    tools,
    note,
  } = content;

  const rows = catalogueRows(tools);
  if (rows.length === 0) return null;

  return (
    <Container as="section" className="py-6">
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold font-mono">
              {title}{" "}
              <span className="text-muted-foreground font-normal">
                ({rows.length})
              </span>
            </h3>
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
              <th className="text-left font-semibold px-4 py-3">
                {toolHeader}
              </th>
              <th className="text-left font-semibold px-4 py-3">
                {permissionHeader}
              </th>
              <th className="text-left font-semibold px-4 py-3">
                {purposeHeader}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.name}
                className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 align-top">
                  <code className="text-[13px] font-mono font-semibold text-primary">
                    {row.name}
                  </code>
                </td>
                <td className="px-4 py-3 align-top">
                  {row.permission ? (
                    <code className="text-[13px] font-mono text-muted-foreground">
                      {row.permission}
                    </code>
                  ) : (
                    <span className="text-muted-foreground">
                      {noPermissionLabel}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 align-top text-muted-foreground">
                  {row.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {note && <p className="text-sm text-muted-foreground mt-3">{note}</p>}
    </Container>
  );
}
