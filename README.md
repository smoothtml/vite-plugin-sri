<!--
SPDX-FileCopyrightText: 2026 Rishvic Pushpakaran

SPDX-License-Identifier: Apache-2.0
-->

# @smoothtml/vite-plugin-sri

[![REUSE status](https://api.reuse.software/badge/github.com/smoothtml/vite-plugin-sri)](https://api.reuse.software/info/github.com/smoothtml/vite-plugin-sri)

Vite plugin that adds Subresource Integrity (SRI) hashes to scripts and
stylesheets in built HTML.

> **Status:** early scaffold. The plugin registers a `transformIndexHtml` hook
> with `apply: "build"`, but the integrity-injection logic is not yet
> implemented. Not ready for production use.

## Install

```sh
pnpm add -D @smoothtml/vite-plugin-sri
```

Requires Vite `^8.0.0` as a peer dependency.

## Usage

```ts
// vite.config.ts
import { defineConfig } from "vite";
import sri from "@smoothtml/vite-plugin-sri";

export default defineConfig({
  plugins: [sri()],
});
```

The plugin only runs during `vite build` (no-op during `vite serve`).

## Options

- `hashAlgorithm` - `"sha256" | "sha384" | "sha512"`, default `"sha384"`
  (follows the
  [W3C SRI specification's recommended baseline](https://www.w3.org/TR/sri/#hash-collision-attacks)).

## License

[Apache-2.0](./LICENSE)
