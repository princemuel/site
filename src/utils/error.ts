// oxlint-disable max-classes-per-file unicorn/custom-error-definition
import { isString } from "./guards";

export const throwAsError = (exception: unknown): never => {
  throw isString(exception) ? new Error(exception) : exception;
};

export const getErrorMessage = (exception: unknown): string => {
  if (exception instanceof Error) return exception.message;
  if (isString(exception)) return exception;
  return "An unknown error occurred";
};

const STACK_FRAMES_TO_STRIP = 2;

/**
 * Strip the internal library frames from an error's stack trace so consumers see only the frames relevant to
 * _their_ code.
 */
function stripInternalStackFrames(error: Error): void {
  if (!error.stack) return;

  const stackLines = error.stack.split("\n");
  stackLines.splice(1, STACK_FRAMES_TO_STRIP);
  error.stack = stackLines.join("\n");
}

export class InvariantError extends Error {
  // oxlint-disable-next-line unicorn/custom-error-definition
  override name = "Invariant Violation";

  constructor(message: string, ...positionals: unknown[]) {
    super(format(message, ...positionals));
    stripInternalStackFrames(this);
  }
}

type CustomErrorConstructor = new (message: string) => Error;

type CustomErrorFactory = (message: string) => Error;

type CustomError = CustomErrorConstructor | CustomErrorFactory;

interface Invariant {
  (condition: unknown, message: string, ...positionals: unknown[]): asserts condition;

  as: (
    ErrorClass: CustomError,
    condition: unknown,
    message: string,
    ...positionals: unknown[]
  ) => asserts condition;
}

export const invariant: Invariant = (condition, message, ...positionals): asserts condition => {
  if (!condition) throw new InvariantError(message, ...positionals);
};

invariant.as = (ErrorClass, condition, message, ...positionals): asserts condition => {
  if (condition) return;

  const msg = positionals.length === 0 ? message : format(message, ...positionals);

  // oxlint-disable-next-line init-declarations
  let error: Error;
  try {
    // Prefer treating it as a class (`new ErrorClass(...)`).
    error = Reflect.construct(ErrorClass as CustomErrorConstructor, [msg]);
  } catch {
    // Fall back to calling it as a factory function.
    // oxlint-disable-next-line new-cap
    error = (ErrorClass as CustomErrorFactory)(msg);
  }

  // oxlint-disable-next-line no-throw-literal
  throw error;
};

/**
 * Matches printf-style placeholders: %s %d %i %j %o Captures an optional leading "%" so "%%s" can be treated as
 * an escaped, literal "%s" rather than a placeholder. The `u` flag makes `.` and character handling
 * Unicode-aware, so messages containing astral-plane characters (emoji, rare CJK, etc.) are scanned correctly
 * instead of splitting surrogate pairs.
 */
const PLACEHOLDER_PATTERN = /(?<escapePrefix>%?)(?<placeholder>%(?<flag>[sdijo]))/gu;

type PlaceholderFlag = "s" | "d" | "i" | "j" | "o";

function serializePositional(value: unknown, flag: PlaceholderFlag): unknown {
  switch (flag) {
    case "s": {
      return value;
    }

    case "d":
    case "i": {
      return Number(value);
    }

    case "j": {
      return JSON.stringify(value);
    }

    case "o": {
      // Preserve strings as-is to avoid wrapping them in extra quotes.
      if (typeof value === "string") return value;
      const serialized = JSON.stringify(value);
      const isEmptyContainer = serialized === "{}" || serialized === "[]";
      const isOpaqueObject = /^\[object .+?\]$/u.test(serialized);
      if (isEmptyContainer || isOpaqueObject) return value;
      return serialized;
    }

    default: {
      // oxlint-disable-next-line typescript/restrict-template-expressions
      throw new Error(`Unhandled placeholder flag: ${flag}`);
    }
  }
}

export function format(message: string, ...positionals: unknown[]): string {
  if (positionals.length === 0) return message;

  let cursor = 0;
  let formatted = message.replaceAll(PLACEHOLDER_PATTERN, (match: string, ...args: unknown[]) => {
    // The last argument to a replacer callback is the `groups` object
    // when the pattern has named capture groups.
    interface Groups {
      escapePrefix: string;
      flag: PlaceholderFlag;
    }

    const groups = args.at(-1) as Groups;

    // "%%s" - the leading "%" escapes the placeholder; leave it literal.
    if (groups.escapePrefix) return match;

    const value = serializePositional(positionals[cursor], groups.flag);
    cursor++;
    return String(value);
  });

  // Any positionals with no matching placeholder get appended verbatim.
  if (cursor < positionals.length) formatted += ` ${positionals.slice(cursor).join(" ")}`;

  // Collapse any remaining escaped "%%" down to a literal "%".
  formatted = formatted.replaceAll(/%{2}/gu, "%");

  return formatted;
}

export class PrettyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}
