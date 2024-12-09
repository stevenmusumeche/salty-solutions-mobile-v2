import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://o2hlpsp9ac.execute-api.us-east-1.amazonaws.com/prod/api",
  documents: ["graphql/documents/**/*.ts"],
  generates: {
    "./graphql/generated.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
    },
  },
};

export default config;
