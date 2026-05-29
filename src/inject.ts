// SPDX-FileCopyrightText: 2026 Rishvic Pushpakaran
//
// SPDX-License-Identifier: Apache-2.0

import { createHash } from "crypto";
import path from "path";
import MagicString from "magic-string";
import colors from "picocolors";
import { nodeIsElement, traverseHtml } from "./html.ts";
import type { OutputBundle } from "rolldown";
import type { Logger } from "vite";

export interface InjectSriOptions {
  hashAlgorithm: "sha256" | "sha384" | "sha512";
  bundle: OutputBundle;
  filename: string;
  htmlPath: string;
  base: string;
  warn: Logger["warn"];
}

export async function injectSri(
  html: string,
  opts: InjectSriOptions,
): Promise<string> {
  const s = new MagicString(html);

  await traverseHtml(html, opts.filename, opts.warn, (node) => {
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
    const sourceAttr = attrs.find((attr) => attr.name === sourceAttrName);
    if (!sourceAttr) {
      return;
    }

    const baseUrl = new URL(opts.base, "resolve://");
    const assetUrl = new URL(sourceAttr.value, new URL(opts.htmlPath, baseUrl));
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
    const asset = opts.bundle[assetFilePath];
    if (!asset) {
      opts.warn(
        colors.yellow(
          `\nCould not find asset ${JSON.stringify(assetFilePath)} in bundle while processing ${JSON.stringify(opts.htmlPath)}`,
        ),
      );
      return;
    }
    const data = asset.type === "asset" ? asset.source : asset.code;
    const hash = createHash(opts.hashAlgorithm);
    hash.update(data);
    const digest = hash.digest("base64");

    const startTagEndOffset = sourceCodeLocation?.startTag?.endOffset;
    if (startTagEndOffset === undefined) {
      opts.warn(
        colors.yellow(
          `Unable to find source code location of <${nodeName} ${sourceAttrName}="${sourceAttr.value}">`,
        ),
      );
      return;
    }
    const appendOffset = html[startTagEndOffset - 2] === "/" ? 2 : 1;
    s.appendRight(
      startTagEndOffset - appendOffset,
      ` integrity="${opts.hashAlgorithm}-${digest}"`,
    );
  });

  return s.toString();
}

/**
 * Checks whether a `rel` attribute value contains at least one keyword that
 * makes a `<link>` element eligible for SRI integrity injection.
 *
 * @see https://html.spec.whatwg.org/commit-snapshots/56ec62263c25df7c98382f17dff5d00b915e7ca2/#the-link-element
 * @param rel - The `rel` attribute value.
 * @returns `true` if any keyword is SRI-eligible, `false` otherwise.
 */
export function isSriEligibleRel(rel: string) {
  const acceptedKeywords = ["stylesheet", "preload", "modulepreload"];
  return rel
    .split(/[\t\n\f\r ]+/)
    .filter(Boolean)
    .some((v) =>
      acceptedKeywords.includes(v.replace(/[A-Z]/g, (c) => c.toLowerCase())),
    );
}
