import * as dotenv from "dotenv"
import type { CodegenConfig } from "@graphql-codegen/cli"

dotenv.config({ path: "./.env.local" })

const config: CodegenConfig = {
  schema: [
    {
      "https://api.github.com/graphql": {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
          Authorization: `Bearer ${process.env.DEV_GITHUB_TOKEN}`,
        },
      },
    },
  ],
  documents: ["app/**/*.tsx"],
  generates: {
    "./gql/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
}

export default config
