// SPDX-FileCopyrightText: 2026 Rishvic Pushpakaran
//
// SPDX-License-Identifier: Apache-2.0

import { injectSri } from "./inject.ts";
import type { Plugin, ResolvedConfig } from "vite";

export interface SriPluginOptions {
  hashAlgorithm?: "sha256" | "sha384" | "sha512";
}

export default function sriPlugin({
  hashAlgorithm = "sha384",
}: SriPluginOptions = {}) {
  let config: ResolvedConfig;

  return {
    name: "vite-plugin-sri",
    apply: "build",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    transformIndexHtml: {
      order: "post",
      async handler(html, ctx) {
        const { bundle } = ctx;
        if (!bundle) {
          return html;
        }
        return injectSri(html, {
          hashAlgorithm,
          bundle,
          filename: ctx.filename,
          htmlPath: ctx.path,
          base: config.base,
          warn: (...args) => {
            config.logger.warn(...args);
          },
        });
      },
    },
  } satisfies Plugin;
}
