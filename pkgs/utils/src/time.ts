// SPDX-License-Identifier: Apache-2.0
export const secs = (item: Temporal.DurationLike) => Temporal.Duration.from(item).total("seconds");
