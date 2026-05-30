// SPDX-FileCopyrightText: 2026 Rishvic Pushpakaran
//
// SPDX-License-Identifier: Apache-2.0

import { defineConfig } from "tsdown";

// Deps are externalized, not bundled. If you bundle one into dist/, add its
// attribution to THIRD-PARTY-NOTICES.txt - nothing else enforces this.
export default defineConfig({
  entry: "src/index.ts",
  format: ["esm", "cjs"],
  dts: true,
  publint: {
    strict: true,
  },
});
