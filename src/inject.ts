// SPDX-FileCopyrightText: 2026 Rishvic Pushpakaran
//
// SPDX-License-Identifier: Apache-2.0

import { createHash } from "node:crypto";
import path from "node:path";
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

function isSriEligibleRel(rel: string) {
  const cleanRel = rel.trim().toLowerCase();
  if (cleanRel === "preload" || cleanRel === "modulepreload") {
    return true;
  }
  return cleanRel.split(/\s+/).some((v) => v === "stylesheet");
}
