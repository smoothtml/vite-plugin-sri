// SPDX-FileCopyrightText: 2019-present, VoidZero Inc. and Vite contributors
// SPDX-FileCopyrightText: 2026 Rishvic Pushpakaran
//
// SPDX-License-Identifier: MIT

export const splitRE: RegExp = /\r?\n/g;

const range: number = 2;

type Pos = {
  /** 1-based */
  line: number;
  /** 0-based */
  column: number;
};

export function posToNumber(source: string, pos: number | Pos): number {
  if (typeof pos === "number") return pos;
  const lines = source.split(splitRE);
  const { line, column } = pos;
  const start = lines
    .slice(0, line - 1)
    .reduce((sum, line) => sum + line.length + 1, 0);
  return start + column;
}

export function numberToPos(source: string, offset: number | Pos): Pos {
  if (typeof offset !== "number") return offset;
  if (offset > source.length) {
    throw new Error(
      `offset is longer than source length! offset ${String(offset)} > length ${String(source.length)}`,
    );
  }

  const lines = source.slice(0, offset).split(splitRE);
  return {
    line: lines.length,
    column: lines[lines.length - 1]?.length ?? 0,
  };
}

const MAX_DISPLAY_LEN = 120;
const ELLIPSIS = "...";

export function generateCodeFrame(
  source: string,
  start: number | Pos = 0,
  end?: number | Pos,
): string {
  start = Math.max(posToNumber(source, start), 0);
  end = Math.min(
    end !== undefined ? posToNumber(source, end) : start,
    source.length,
  );
  const lastPosLine = numberToPos(source, end).line;
  const lineNumberWidth = Math.max(3, String(lastPosLine).length + 1);
  const lines = source.split(splitRE);
  let count = 0;
  const res: string[] = [];
  for (const [i, anchor] of lines.entries()) {
    count += anchor.length;
    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length) continue;
        const line = j + 1;
        const lineLength = lines[j]?.length ?? 0;
        const pad = Math.max(start - (count - lineLength), 0);
        const underlineLength = Math.max(
          1,
          end > count ? lineLength - pad : end - start,
        );

        let displayLine = lines[j] as string;
        let underlinePad = pad;
        if (lineLength > MAX_DISPLAY_LEN) {
          let startIdx = 0;
          if (j === i) {
            if (underlineLength > MAX_DISPLAY_LEN) {
              startIdx = pad;
            } else {
              const center = pad + Math.floor(underlineLength / 2);
              startIdx = Math.max(0, center - Math.floor(MAX_DISPLAY_LEN / 2));
            }
            underlinePad =
              Math.max(0, pad - startIdx) +
              (startIdx > 0 ? ELLIPSIS.length : 0);
          }
          const prefix = startIdx > 0 ? ELLIPSIS : "";
          const suffix =
            lineLength - startIdx > MAX_DISPLAY_LEN ? ELLIPSIS : "";
          const sliceLen = MAX_DISPLAY_LEN - prefix.length - suffix.length;
          displayLine =
            prefix + displayLine.slice(startIdx, startIdx + sliceLen) + suffix;
        }
        res.push(
          `${String(line)}${" ".repeat(lineNumberWidth - String(line).length)}|  ${displayLine}`,
        );
        if (j === i) {
          // push underline
          const underline = "^".repeat(
            Math.min(underlineLength, MAX_DISPLAY_LEN),
          );
          res.push(
            `${" ".repeat(lineNumberWidth)}|  ` +
              " ".repeat(underlinePad) +
              underline,
          );
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1);
            const underline = "^".repeat(Math.min(length, MAX_DISPLAY_LEN));
            res.push(`${" ".repeat(lineNumberWidth)}|  ` + underline);
          }
          count += lineLength + 1;
        }
      }
      break;
    }
    count++;
  }
  return res.join("\n");
}
