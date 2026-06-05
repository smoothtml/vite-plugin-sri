// SPDX-FileCopyrightText: 2026 Rishvic Pushpakaran
//
// SPDX-License-Identifier: Apache-2.0

const HASH_ORDER = ["sha256", "sha384", "sha512"] as const;
export type HashAlgorithm = (typeof HASH_ORDER)[number];

export function compareHash(a: HashAlgorithm, b: HashAlgorithm) {
  return HASH_ORDER.indexOf(a) - HASH_ORDER.indexOf(b);
}

export function getComponentAlgo(component: string): HashAlgorithm | undefined {
  return HASH_ORDER.find((h) => component.startsWith(`${h}-`));
}
