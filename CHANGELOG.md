# @smoothtml/vite-plugin-sri

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
