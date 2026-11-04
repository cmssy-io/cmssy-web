import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export function isDocsPath(path: string): boolean {
  return path === "/docs" || path.startsWith("/docs/");
}

/** Site-relative becomes absolute; a docs page points at its Markdown twin. */
export function markdownHref(href: string, base: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const cut = href.search(/[?#]/);
  const path = cut === -1 ? href : href.slice(0, cut);
  const suffix = cut === -1 ? "" : href.slice(cut);
  const trimmed = path.replace(/\/+$/, "") || "/";
  if (!isDocsPath(trimmed)) return `${base}${path}${suffix}`;
  return `${base}${trimmed}.md${suffix}`;
}

function rewriteUrls(base: string) {
  return (tree: Parameters<typeof visit>[0]) => {
    visit(tree, (node) => {
      if (node.type !== "link" && node.type !== "image") return;
      const target = node as unknown as { url: string };
      target.url = markdownHref(target.url, base);
    });
  };
}

export function htmlToMarkdown(html: string, base = ""): string {
  const markdown = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeRemark)
    .use(rewriteUrls, base)
    .use(remarkGfm, { tablePipeAlign: false })
    .use(remarkStringify, { bullet: "-", fences: true, listItemIndent: "one" })
    .processSync(html);
  return String(markdown).trim();
}
