// SPDX-License-Identifier: Apache-2.0
declare namespace Intl {
  class DurationFormat {
    constructor(locales?: Intl.LocalesArgument, options?: DurationFormatOptions);
    format(duration: Duration): string;
  }

  interface DurationFormatOptions {
    localeMatcher?: "lookup" | "best fit";
    style?: "long" | "short" | "narrow";
    years?: "long" | "short" | "narrow";
    months?: "long" | "short" | "narrow";
    weeks?: "long" | "short" | "narrow";
    days?: "long" | "short" | "narrow";
    hours?: "long" | "short" | "narrow";
    minutes?: "long" | "short" | "narrow";
    seconds?: "long" | "short" | "narrow";
    milliseconds?: "long" | "short" | "narrow";
    microseconds?: "long" | "short" | "narrow";
    nanoseconds?: "long" | "short" | "narrow";
    digital?: boolean;
  }

  interface Duration {
    years?: number;
    months?: number;
    weeks?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
    microseconds?: number;
    nanoseconds?: number;
  }
}
