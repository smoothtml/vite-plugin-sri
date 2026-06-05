// SPDX-FileCopyrightText: 2026 Rishvic Pushpakaran
//
// SPDX-License-Identifier: Apache-2.0

export const toAsciiLowercase = (s: string) =>
  s.replace(/[A-Z]/g, (c) => c.toLowerCase());

export const splitAsciiWhitespace = (s: string) =>
  s.split(/[\t\n\f\r ]+/).filter(Boolean);

type AttrDqUnsafeChar = '"' | "&";
const ATTR_DQ_ESCAPES: Record<AttrDqUnsafeChar, string> = {
  '"': "&quot;",
  "&": "&amp;",
};
export const escapeAttribute = (s: string) =>
  `"${s.replace(/["&]/g, (c) => ATTR_DQ_ESCAPES[c as AttrDqUnsafeChar])}"`;
