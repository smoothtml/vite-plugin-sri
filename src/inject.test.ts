// SPDX-FileCopyrightText: 2026 Rishvic Pushpakaran
//
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from "vitest";
import { isSriEligibleRel } from "./inject.ts";

describe("isSriEligibleRel", () => {
  describe("accepted keywords", () => {
    it("accepts 'stylesheet'", () => {
      expect(isSriEligibleRel("stylesheet")).toBe(true);
    });

    it("accepts 'preload'", () => {
      expect(isSriEligibleRel("preload")).toBe(true);
    });

    it("accepts 'modulepreload'", () => {
      expect(isSriEligibleRel("modulepreload")).toBe(true);
    });
  });

  describe("non-eligible values", () => {
    it("rejects empty string", () => {
      expect(isSriEligibleRel("")).toBe(false);
    });

    it("rejects 'prefetch'", () => {
      expect(isSriEligibleRel("prefetch")).toBe(false);
    });

    it("rejects 'dns-prefetch'", () => {
      expect(isSriEligibleRel("dns-prefetch")).toBe(false);
    });

    it("rejects 'icon'", () => {
      expect(isSriEligibleRel("icon")).toBe(false);
    });
  });

  describe("case-insensitivity", () => {
    it("accepts 'Stylesheet'", () => {
      expect(isSriEligibleRel("Stylesheet")).toBe(true);
    });

    it("accepts 'PRELOAD'", () => {
      expect(isSriEligibleRel("PRELOAD")).toBe(true);
    });

    it("accepts 'ModulePreload'", () => {
      expect(isSriEligibleRel("ModulePreload")).toBe(true);
    });
  });

  describe("multi-keyword rel values", () => {
    it("accepts when eligible keyword are in the list", () => {
      expect(isSriEligibleRel("stylesheet prefetch")).toBe(true);
      expect(isSriEligibleRel("prefetch preload")).toBe(true);
    });

    it("rejects list with no eligible keywords", () => {
      expect(isSriEligibleRel("prefetch dns-prefetch")).toBe(false);
    });

    it("accepts uppercase eligible keyword in a list", () => {
      expect(isSriEligibleRel("PRELOAD prefetch")).toBe(true);
    });
  });

  describe("whitespace separators", () => {
    it.each([
      ["tab (\\t)", "stylesheet\tpreload"],
      ["newline (\\n)", "stylesheet\npreload"],
      ["form feed (\\f)", "stylesheet\fpreload"],
      ["carriage return (\\r)", "stylesheet\rpreload"],
    ])("splits on %s", (_, rel) => {
      expect(isSriEligibleRel(rel)).toBe(true);
    });

    it("does not split on \\v", () => {
      expect(isSriEligibleRel("stylesheet\vpreload")).toBe(false);
    });

    it("accepts with leading and trailing spaces", () => {
      expect(isSriEligibleRel("  stylesheet  ")).toBe(true);
    });

    it("accepts with multiple consecutive spaces between keywords", () => {
      expect(isSriEligibleRel("stylesheet  preload")).toBe(true);
    });

    it("rejects whitespace-only string", () => {
      expect(isSriEligibleRel("   ")).toBe(false);
    });
  });
});
