import parser from "@babel/eslint-parser";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "no-unused-vars": ["warn", { 
        "varsIgnorePattern": "^(React|CustomForm|EditForm|TaskList|ThemeSwitcher|TaskItem|PlusIcon|CheckIcon|PencilSquareIcon|TrashIcon|XMarkIcon|SunIcon|MoonIcon|SwatchIcon|App|Login)$",
        "argsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }],
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": ["warn", {
        "additionalHooks": "(useMyCustomHook|useMyOtherHook)"
      }],
    },
  },
]);
