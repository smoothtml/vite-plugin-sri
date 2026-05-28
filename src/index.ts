// SPDX-FileCopyrightText: 2026 Rishvic Pushpakaran
//
// SPDX-License-Identifier: Apache-2.0

import path from "node:path";
import colors from "picocolors";
import MagicString from "magic-string";
import { nodeIsElement, traverseHtml } from "./html.ts";

import type { Plugin, ResolvedConfig } from "vite";

export interface SriPluginOptions {
  hashAlgorithm?: "sha256" | "sha384" | "sha512";
}

export default async function sriPlugin({
  hashAlgorithm = "sha384",
}: SriPluginOptions = {}) {
  let config: ResolvedConfig;

  const { createHash } = await import("node:crypto");

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

        const s = new MagicString(html);

        await traverseHtml(
          html,
          ctx.filename,
          (...args) => {
            config.logger.warn(...args);
          },
          (node) => {
            if (!nodeIsElement(node)) {
              return;
            }

            const { nodeName, attrs, sourceCodeLocation } = node;

            if (
              nodeName !== "script" &&
              !(
                nodeName === "link" &&
                attrs.some(
                  (attr) => attr.name === "rel" && isSriEligibleRel(attr.value),
                )
              )
            ) {
              return;
            }

            // Skip elements with integrity attribute present.
            if (attrs.some((attr) => attr.name === "integrity")) {
              return;
            }

            const sourceAttrName = nodeName === "script" ? "src" : "href";
            const sourceAttr = attrs.find(
              (attr) => attr.name === sourceAttrName,
            );
            if (!sourceAttr) {
              return;
            }

            const baseUrl = new URL(config.base, "resolve://");
            const assetUrl = new URL(
              sourceAttr.value,
              new URL(ctx.path, baseUrl),
            );
            if (
              assetUrl.protocol !== baseUrl.protocol ||
              assetUrl.host !== baseUrl.host
            ) {
              return;
            }

            // Sanitize empty pathnames, so paths are always absolute.
            const basePath = baseUrl.pathname || "/";
            const assetPath = assetUrl.pathname || "/";

            const assetFilePath = path.relative(basePath, assetPath);
            const asset = bundle[assetFilePath];
            if (!asset) {
              config.logger.warn(
                colors.yellow(
                  `\nCould not find asset ${JSON.stringify(assetFilePath)} in bundle while processing ${JSON.stringify(ctx.path)}`,
                ),
              );
              return;
            }
            const data = asset.type === "asset" ? asset.source : asset.code;
            const hash = createHash(hashAlgorithm);
            hash.update(data);
            const digest = hash.digest("base64");

            const startTagEndOffset = sourceCodeLocation?.startTag?.endOffset;
            if (startTagEndOffset === undefined) {
              config.logger.warn(
                colors.yellow(
                  `Unable to find source code location of <${nodeName} ${sourceAttrName}="${sourceAttr.value}">`,
                ),
              );
              return;
            }
            const appendOffset = html[startTagEndOffset - 2] === "/" ? 2 : 1;
            s.appendRight(
              startTagEndOffset - appendOffset,
              ` integrity="${hashAlgorithm}-${digest}"`,
            );
          },
        );
        return s.toString();
      },
    },
  } satisfies Plugin;
}

function isSriEligibleRel(rel: string) {
  const cleanRel = rel.trim().toLowerCase();
  if (cleanRel === "preload" || cleanRel === "modulepreload") {
    return true;
  }
  return cleanRel.split(/\s+/).some((v) => v === "stylesheet");
}
