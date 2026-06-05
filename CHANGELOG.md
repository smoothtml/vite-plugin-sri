# @smoothtml/vite-plugin-sri

## 0.3.0

### Minor Changes

- [#13](https://github.com/smoothtml/vite-plugin-sri/pull/13)
  [`527aa3e`](https://github.com/smoothtml/vite-plugin-sri/commit/527aa3e35343a14fe4bb2c248005975d8c07128d)
  Thanks [@rishvic](https://github.com/rishvic)! - Add SRI hashes to elements
  that already have an `integrity` attribute, preserving existing hashes.

### Patch Changes

- [#13](https://github.com/smoothtml/vite-plugin-sri/pull/13)
  [`daaecd2`](https://github.com/smoothtml/vite-plugin-sri/commit/daaecd2ebff58d10f2d3e6c4bad6b3f0c4db52eb)
  Thanks [@rishvic](https://github.com/rishvic)! - Decode percent-encoded asset
  URLs before bundle lookup so encoded paths resolve correctly

- [#11](https://github.com/smoothtml/vite-plugin-sri/pull/11)
  [`fe5d930`](https://github.com/smoothtml/vite-plugin-sri/commit/fe5d930043d458710af6015c6761e57fadbaf186)
  Thanks [@rishvic](https://github.com/rishvic)! - Add THIRD-PARTY-NOTICES.txt
  to the published package, carrying the MIT license and copyright for the
  bundled Vite-derived code.

## 0.2.0

### Minor Changes

- [#9](https://github.com/smoothtml/vite-plugin-sri/pull/9)
  [`1d6e8aa`](https://github.com/smoothtml/vite-plugin-sri/commit/1d6e8aa22d23a9046586227607b3ce809acba71a)
  Thanks [@rishvic](https://github.com/rishvic)! - Explicitly annotate
  `sriPlugin` return type as `Plugin` to hide internal hook structure from the
  public API.

### Patch Changes

- [#9](https://github.com/smoothtml/vite-plugin-sri/pull/9)
  [`d1cdc3f`](https://github.com/smoothtml/vite-plugin-sri/commit/d1cdc3f7685d1ddcac3dce0dadfa3b3dd6486cfe)
  Thanks [@rishvic](https://github.com/rishvic)! - Fix `<link rel>` SRI
  eligibility check to correctly handle multi-keyword values per the HTML spec.

- [#9](https://github.com/smoothtml/vite-plugin-sri/pull/9)
  [`4a285f8`](https://github.com/smoothtml/vite-plugin-sri/commit/4a285f83141bba69ef043a29ad5a476a2a9a3790)
  Thanks [@rishvic](https://github.com/rishvic)! - Use bare specifiers
  (`crypto`, `path`, `url`) instead of `node:*` for Node built-in imports.

## 0.1.1

### Patch Changes

- [#6](https://github.com/smoothtml/vite-plugin-sri/pull/6)
  [`7cdd440`](https://github.com/smoothtml/vite-plugin-sri/commit/7cdd44013ddb91e548173c81a1c20f15088fe6b7)
  Thanks [@rishvic](https://github.com/rishvic)! - Correct the README status
  note that incorrectly said SRI injection was not yet implemented. The plugin
  injects integrity hashes during `vite build`, as it has since 0.1.0.

## 0.1.0

### Minor Changes

- [#3](https://github.com/smoothtml/vite-plugin-sri/pull/3)
  [`fe67e29`](https://github.com/smoothtml/vite-plugin-sri/commit/fe67e29a39b1b3c42dc4b1353e9863ee2764919c)
  Thanks [@rishvic](https://github.com/rishvic)! - Initial release. Injects SRI
  hashes (SHA-384 by default) for `<script>` and `<link>` tags during Vite's
  build.
