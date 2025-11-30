// SPDX-License-Identifier: Apache-2.0
interface Duration {
  d: number;
  h: number;
  m: number;
  s: number;
}

export function secs({ d = 0, h = 0, m = 0, s = 0 }: Partial<Duration>) {
  return d * 24 * 60 * 60 + h * 60 * 60 + m * 60 + s;
}
