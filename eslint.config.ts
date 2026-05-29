// SPDX-FileCopyrightText: 2026 Rishvic Pushpakaran
//
// SPDX-License-Identifier: Apache-2.0

import { fileURLToPath } from "url";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, includeIgnoreFile } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig([
  includeIgnoreFile(gitignorePath, { gitignoreResolution: true }),
  {
    files: ["src/**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.node,
    },
  },
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslintConfigPrettier,
]);
