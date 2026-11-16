/**
 * General setup:
 *
 * ```sh
 * yarn create @eslint/config
 * ```
 *
 * ✔ How would you like to use ESLint? · problems
 * ✔ What type of modules does your project use? · esm
 * ✔ Which framework does your project use? · react
 * ✔ Does your project use TypeScript? · typescript
 * ✔ Where does your code run? · browser
 *   The config that you've selected requires the following dependencies:
 *   eslint, globals, @eslint/js, typescript-eslint, eslint-plugin-react
 * ✔ Would you like to install them now? · Yes
 * ✔ Which package manager do you want to use? · yarn
 *
 * ```sh
 * yarn add @eslint/compat eslint-plugin-simple-import-sort eslint-config-prettier eslint-plugin-prettier --dev
 * ```
 *
 * You can remove this comment block afterwards ;-)
 */
import { fixupConfigRules } from "@eslint/compat";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { languageOptions: { globals: globals.browser } },
  {
    ...pluginJs.configs.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  ...tseslint.configs.recommended,
  // @ts-ignore
  ...fixupConfigRules(pluginReactConfig),
  eslintConfigPrettier,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "react/prop-types": "off", // Does not work nicely with React.FC TS declarations

      // Enable these if your TSConfig is preserve and you don't need a React import in scope for JSX
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Packages `react` related packages come first.
            ["^react", "^@?\\w"],
            // Internal packages.
            ["^(@|components)(/.*|$)"],
            // Side effect imports.
            ["^\\u0000"],
            // Parent imports. Put `..` last.
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // Other relative imports. Put same-folder imports and `.` last.
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // Style imports.
            ["^.+\\.?(css)$"],
          ],
        },
      ],
    },
  },
];
