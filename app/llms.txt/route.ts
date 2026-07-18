const body = `# cmssy

> cmssy is an AI-native headless CMS. You model structured content and edit it
> visually or through Claude (via the cmssy MCP server); your own Next.js
> frontend renders it with the @cmssy/next SDK. cmssy never hosts your site.

## Key facts

- Content is composed from typed blocks; block schemas live in your frontend code.
- Data collections are models with records, delivered over a typed GraphQL API.
- Claude connects through the cmssy MCP server (70+ tools: pages, blocks, media,
  forms, commerce, publishing) and edits content directly - never your code.
- Built-in commerce: products, carts, orders, discounts, order pipelines.
- Every field is multilingual by default.

## Docs

- Documentation: https://www.cmssy.com/docs
- Quickstart: https://www.cmssy.com/docs/quickstart
- Headless SDK installation: https://www.cmssy.com/docs/installation
- MCP server: https://www.cmssy.com/docs/mcp-server
- Pricing: https://www.cmssy.com/pricing

## App

- Sign up / log in: https://cmssy.io/login
`;

export function GET() {
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
