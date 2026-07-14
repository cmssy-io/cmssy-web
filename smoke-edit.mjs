import { checkCmssyEditMode } from "@cmssy/next/testing";
import { readFileSync } from "node:fs";
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const [k, ...v] = line.split("=");
  if (k && !k.startsWith("#")) process.env[k.trim()] = v.join("=").trim().replace(/^"|"$/g, "");
}
const result = await checkCmssyEditMode({
  baseUrl: "http://localhost:3000",
  secret: process.env.CMSSY_DRAFT_SECRET,
  // The check reads <html lang>: a contract. A word from the copy is content, and
  // an editor can rewrite it at any time - then the test lies.
  localizedPath: "/pl",
});
console.log(result.ok ? "EDITOR OK" : "EDITOR BROKEN");
for (const f of result.failures) console.log("  -", f);
process.exit(result.ok ? 0 : 1);
