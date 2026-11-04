import type { Element, Root } from "hast";
import { headingRank } from "hast-util-heading-rank";
import { toString } from "hast-util-to-string";
import rehypeParse from "rehype-parse";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface TocResult {
  html: string;
  items: TocItem[];
}

export function extractTocItems(html: string): TocResult {
  const items: TocItem[] = [];
  const file = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSlug)
    .use(() => (tree: Root) => {
      visit(tree, "element", (node: Element, index, parent) => {
        const rank = headingRank(node);
        if (rank === 2 || rank === 3) {
          items.push({
            id: String(node.properties?.id ?? ""),
            text: toString(node),
            level: rank,
          });
        }
        if (node.tagName === "table" && parent && typeof index === "number") {
          const wrapper: Element = {
            type: "element",
            tagName: "div",
            properties: { className: ["docs-table"], tabIndex: 0 },
            children: [node],
          };
          parent.children[index] = wrapper;
          return index + 1;
        }
      });
    })
    .use(rehypeStringify)
    .processSync(html);

  return { html: String(file), items };
}
