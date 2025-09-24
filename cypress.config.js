import { defineConfig } from "cypress";

export default defineConfig({
  projectId: '8kvx29',
  e2e: {
    baseUrl: "http://localhost:3000",
    env: {
      graphqlEndpoint: "http://localhost:3002/graphql",
    },
    setupNodeEvents(on, config) {},
  },

  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
