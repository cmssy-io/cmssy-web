import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import cmssy from "@cmssy/eslint-plugin";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "react-hooks": reactHooks,
      cmssy,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // A client component that reaches the cmssy config drags server env into
      // the browser bundle: the page dies at runtime and no build catches it.
      "cmssy/no-server-config-in-client": "error",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    ignores: [
      "node_modules/",
      "dist/",
      "public/",
      ".cmssy/",
      ".next/",
      "vendor/",
      "scripts/",
      "smoke-edit.mjs",
    ],
  },
);
