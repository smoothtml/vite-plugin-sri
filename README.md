<!--
SPDX-FileCopyrightText: 2026 Rishvic Pushpakaran

SPDX-License-Identifier: Apache-2.0
-->

# @smoothtml/vite-plugin-sri

[![REUSE status](https://api.reuse.software/badge/github.com/smoothtml/vite-plugin-sri)](https://api.reuse.software/info/github.com/smoothtml/vite-plugin-sri)

Vite plugin that adds Subresource Integrity (SRI) hashes to scripts and
stylesheets in built HTML.

> **Status:** early release (`0.x`). SRI injection works during `vite build`,
> but the API may still change before `1.0`.

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

## Acknowledgments

This plugin includes code adapted from [Vite](https://github.com/vitejs/vite) (©
2019-present, VoidZero Inc. and Vite contributors, MIT-licensed). Specifically,
`src/html.ts` and `src/utils.ts` are derived from
`packages/vite/src/node/plugins/html.ts` and `packages/vite/src/node/utils.ts`
respectively. See the SPDX headers in those files and [`NOTICE`](./NOTICE) for
details.

## License

[Apache-2.0](./LICENSE)
