import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { visit } from "unist-util-visit";

/** Site-relative becomes absolute; a docs page points at its Markdown twin. */
export function markdownHref(href: string, base: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const [path = "", suffix = ""] = href.split(/(?=[?#])/, 2);
  const isDocs = path === "/docs" || path.startsWith("/docs/");
  return `${base}${path}${isDocs ? ".md" : ""}${suffix}`;
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
