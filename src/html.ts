// SPDX-FileCopyrightText: 2019-present, VoidZero Inc. and Vite contributors
// SPDX-FileCopyrightText: 2026 Rishvic Pushpakaran
//
// SPDX-License-Identifier: MIT

import colors from "picocolors";
import { generateCodeFrame } from "./utils.ts";

import type { DefaultTreeAdapterMap, ErrorCodes, ParserError } from "parse5";
import type { RollupError } from "rolldown";
import type { Logger } from "vite";

export function nodeIsElement(
  node: DefaultTreeAdapterMap["node"],
): node is DefaultTreeAdapterMap["element"] {
  return node.nodeName[0] !== "#";
}

function traverseNodes(
  node: DefaultTreeAdapterMap["node"],
  visitor: (node: DefaultTreeAdapterMap["node"]) => void,
) {
  if (node.nodeName === "template") {
    node = (node as DefaultTreeAdapterMap["template"]).content;
  }
  visitor(node);
  if (
    nodeIsElement(node) ||
    node.nodeName === "#document" ||
    node.nodeName === "#document-fragment"
  ) {
    node.childNodes.forEach((childNode) => {
      traverseNodes(childNode, visitor);
    });
  }
}

type ParseWarnings = Partial<Record<ErrorCodes, string>>;

export async function traverseHtml(
  html: string,
  filePath: string,
  warn: Logger["warn"],
  visitor: (node: DefaultTreeAdapterMap["node"]) => void,
): Promise<void> {
  // lazy load compiler
  const { parse, ErrorCodes } = await import("parse5");
  const warnings: ParseWarnings = {};
  const ast = parse(html, {
    scriptingEnabled: false, // parse inside <noscript>
    sourceCodeLocationInfo: true,
    onParseError: (e: ParserError) => {
      handleParseError(e, ErrorCodes, html, filePath, warnings);
    },
  });
  traverseNodes(ast, visitor);

  for (const message of Object.values(warnings)) {
    warn(colors.yellow(`\n${message}`));
  }
}

function formatParseError(parserError: ParserError, id: string, html: string) {
  const formattedError = {
    code: parserError.code,
    message: `parse5 error code ${parserError.code}`,
    frame: generateCodeFrame(
      html,
      parserError.startOffset,
      parserError.endOffset,
    ),
    loc: {
      file: id,
      line: parserError.startLine,
      column: parserError.startCol,
    },
  } satisfies RollupError;
  return formattedError;
}

function handleParseError(
  parserError: ParserError,
  errorCodes: typeof ErrorCodes,
  html: string,
  filePath: string,
  warnings: ParseWarnings,
) {
  switch (parserError.code) {
    case errorCodes.missingDoctype:
      // ignore missing DOCTYPE
      return;
    case errorCodes.abandonedHeadElementChild:
      // Accept elements without closing tag in <head>
      return;
    case errorCodes.duplicateAttribute:
      // Accept duplicate attributes #5966
      // The first attribute is used, browsers silently ignore duplicates
      return;
    case errorCodes.nonVoidHtmlElementStartTagWithTrailingSolidus:
      // Allow self closing on non-void elements #10439
      return;
    case errorCodes.unexpectedQuestionMarkInsteadOfTagName:
      // Allow <?xml> declaration and <?> empty elements
      // lit generates <?>: https://github.com/lit/lit/issues/2470
      return;
  }
  const parseError = formatParseError(parserError, filePath, html);
  warnings[parseError.code] ??=
    `Unable to parse HTML; ${parseError.message}\n` +
    ` at ${parseError.loc.file}:${String(parseError.loc.line)}:${String(parseError.loc.column)}\n` +
    parseError.frame;
}
