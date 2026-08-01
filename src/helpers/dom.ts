// oxlint-disable max-params

import { invariant } from "@/utils/error";

/**
 * Find a DOM element or elements and validate their types.
 * @example
 * // Single element
 * const button = $("button", HTMLButtonElement)
 *
 * // Multiple elements
 * const buttons = $("button", HTMLButtonElement, true, document)
 */
export function $<E extends Element>(
  selector: string,
  Constructor: new (...args: unknown[]) => E,
  nodelist?: false,
  parent?: ParentNode,
): E;
export function $<E extends Element>(
  selector: string,
  Constructor: new (...args: unknown[]) => E,
  nodelist?: true,
  parent?: ParentNode,
): NodeListOf<E>;
export function $<E extends Element>(
  selector: string,
  Constructor: new (...args: unknown[]) => E,
  nodelist = false,
  parent: ParentNode = document,
): E | NodeListOf<E> {
  if (nodelist) {
    const nodes = parent.querySelectorAll(selector);
    for (const node of nodes) {
      invariant(
        node instanceof Constructor,
        `expected ${selector} to be an Element of type '${Constructor.name}' but got '%s'`,
        typeof node,
      );
    }
    return nodes as NodeListOf<E>;
  }

  const node = parent.querySelector(selector);
  invariant(
    node instanceof Constructor,
    `expected ${selector} to be an Element of type '${Constructor.name}' but got '%s'`,
    typeof node,
  );

  return node;
}

export const createElement = (
  name: string,
  Constructor: CustomElementConstructor,
  options?: ElementDefinitionOptions,
) => {
  if (!customElements.get(name)) customElements.define(name, Constructor, options);
};
