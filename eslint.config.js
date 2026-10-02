import js from "@eslint/js";
import globals from "globals";
import importPluginX from "eslint-plugin-import-x";
import eslintPluginPrettier from "eslint-config-prettier/flat";
import minecraftLinting from "eslint-plugin-minecraft-linting";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "import-x": importPluginX,
      "minecraft-linting": minecraftLinting,
    },
    settings: {
      "import-x/resolver": {
        node: true,
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "no-undef": "error",
      "import-x/named": "error",
      "import-x/no-unresolved": ["off", { caseSensitive: true }],
      "import-x/extensions": ["off", "always", { js: "always" }],
      "minecraft-linting/avoid-unnecessary-command": "error",
    },
  },
  eslintPluginPrettier,
];
