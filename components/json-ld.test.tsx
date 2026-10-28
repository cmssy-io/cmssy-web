import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { JsonLd } from "./json-ld";

describe("JsonLd", () => {
  it("escapes < so content cannot close the script tag and inject markup", () => {
    const html = renderToStaticMarkup(
      <JsonLd
        data={{
          "@type": "Question",
          name: '</script><img src=x onerror="alert(1)">',
        }}
      />,
    );
    expect(
      html.indexOf("</script>"),
      "a literal </script> before the closing tag means block content broke out of the JSON-LD script and executes as markup",
    ).toBe(html.length - "</script>".length);
    expect(html).toContain("\\u003c/script>");
  });

  it("round-trips the data through the rendered script body", () => {
    const data = { "@context": "https://schema.org", "@type": "FAQPage" };
    const html = renderToStaticMarkup(<JsonLd data={data} />);
    const body = html.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");
    expect(JSON.parse(body)).toEqual(data);
    expect(html).toContain('type="application/ld+json"');
  });
});
