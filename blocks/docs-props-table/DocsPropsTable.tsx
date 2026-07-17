import type { BlockProps } from "@cmssy/react";
import { Container } from "../../components/container";
import type { docsPropsTableProps } from "./block";

export default function DocsPropsTable({
  content,
}: BlockProps<typeof docsPropsTableProps>) {
  const {
    title,
    description,
    props = [],
    showDefaults = true,
    showRequired = true,
  } = content;

  if (props.length === 0) return null;

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
              <th className="text-left font-semibold px-4 py-3">Name</th>
              <th className="text-left font-semibold px-4 py-3">Type</th>
              {showDefaults && (
                <th className="text-left font-semibold px-4 py-3">Default</th>
              )}
              <th className="text-left font-semibold px-4 py-3">Description</th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop, index) => (
              <tr
                key={index}
                className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
              >
                {/* Name */}
                <td className="px-4 py-3 align-top">
                  <div className="flex items-center gap-2">
                    <code className="text-[13px] font-mono font-semibold text-sky-600">
                      {prop.name}
                    </code>
                    {showRequired && prop.required && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                        required
                      </span>
                    )}
                  </div>
                </td>

                {/* Type */}
                <td className="px-4 py-3 align-top">
                  <code className="text-[13px] font-mono text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                    {prop.type}
                  </code>
                </td>

                {/* Default */}
                {showDefaults && (
                  <td className="px-4 py-3 align-top">
                    {prop.defaultValue ? (
                      <code className="text-[13px] font-mono text-zinc-600">
                        {prop.defaultValue}
                      </code>
                    ) : (
                      <span className="text-muted-foreground/50">—</span>
                    )}
                  </td>
                )}

                {/* Description */}
                <td className="px-4 py-3 align-top text-muted-foreground">
                  {prop.description || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
