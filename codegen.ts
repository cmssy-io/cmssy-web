import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: process.env.CODEGEN_SCHEMA || "https://api.cmssy.io/graphql",
  documents: ["graphql/**/*.graphql", "cmssy/**/*.graphql"],
  generates: {
    "graphql/generated/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        avoidOptionals: true,
        scalars: {
          JSON: "Record<string, unknown>",
          DateTime: "string",
        },
      },
    },
  },
  overwrite: true,
  ignoreNoDocuments: true,
};

export default config;
