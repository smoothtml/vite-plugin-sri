// SPDX-FileCopyrightText: 2026 Rishvic Pushpakaran
//
// SPDX-License-Identifier: Apache-2.0

import type { Plugin } from "vite";

export interface SriPluginOptions {
  hashAlgorithm?: "sha256" | "sha384" | "sha512";
}

export default function sriPlugin({
  hashAlgorithm = "sha384",
}: SriPluginOptions = {}) {
  // TODO: consumed by transformIndexHtml handler
  void hashAlgorithm;

  return {
    name: "vite-plugin-sri",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        if (!ctx.bundle) {
          return html;
        }
        // TODO: implement the actual functionality.
        return html;
      },
    },
  } satisfies Plugin;
}
