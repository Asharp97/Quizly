// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    // Enforce no slash for self-closing tags
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always", // No trailing slash for void tags (e.g., <input>)
          normal: "always", // Always close regular HTML tags
          component: "always", // Always close Vue component tags
        },
        svg: "always", // Always close SVG tags
        math: "always", // Always close MathML tags
      },
    ],
  },
});
