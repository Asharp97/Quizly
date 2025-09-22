import { defineVitestConfig } from "@nuxt/test-utils/config";
import { resolve } from "path";

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    alias: {
      "#gql/default": resolve(__dirname, "test-setup.ts"),
    },
  },
});
