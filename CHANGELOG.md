# @smoothtml/vite-plugin-sri

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
