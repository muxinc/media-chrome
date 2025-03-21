import { MediaStateReceiverAttributes } from '../constants.js';
import type MediaController from '../media-controller.js';

export function namedNodeMapToObject(namedNodeMap: NamedNodeMap) {
  const obj = {};
  for (const attr of namedNodeMap) {
    obj[attr.name] = attr.value;
  }
  return obj;
}

/**
 * Get the media controller element from the `mediacontroller` attribute or closest ancestor.
 * @param host - The element to search for the media controller.
 */
export function getMediaController(
  host: HTMLElement
): MediaController | undefined {
  return (
    getAttributeMediaController(host) ??
    closestComposedNode(host, 'media-controller')
  );
}

/**
 * Get the media controller element from the `mediacontroller` attribute.
 * @param host - The element to search for the media controller.
 * @return
 */
export function getAttributeMediaController(
  host: HTMLElement
): MediaController | undefined {
  const { MEDIA_CONTROLLER } = MediaStateReceiverAttributes;
  const mediaControllerId = host.getAttribute(MEDIA_CONTROLLER);

  if (mediaControllerId) {
    return getDocumentOrShadowRoot(host)?.getElementById(
      mediaControllerId
    ) as MediaController;
  }
}

export const updateIconText = (
  svg: HTMLElement,
  value: string,
  selector: string = '.value'
): void => {
  const node = svg.querySelector(selector);

  if (!node) return;

  node.textContent = value;
};

export const getAllSlotted = (
  el: HTMLElement,
  name: string
): HTMLCollection | HTMLElement[] => {
  const slotSelector = `slot[name="${name}"]`;
  const slot: HTMLSlotElement = el.shadowRoot.querySelector(slotSelector);
  if (!slot) return [];
  return slot.children;
};

export const getSlotted = (el: HTMLElement, name: string): HTMLElement =>
  getAllSlotted(el, name)[0] as HTMLElement;

/**
 *
 * @param {{ contains?: Node['contains'] }} [rootNode]
 * @param {Node} [childNode]
 * @returns boolean
 */
export const containsComposedNode = (
  rootNode: Node,
  childNode: Node
): boolean => {
  if (!rootNode || !childNode) return false;
  if (rootNode?.contains(childNode)) return true;
  return containsComposedNode(
    rootNode,
    (childNode.getRootNode() as ShadowRoot).host
  );
};

export const closestComposedNode = <T extends Element = Element>(
  childNode: Element,
  selector: string
): T => {
  if (!childNode) return null;
  const closest = childNode.closest(selector);
  if (closest) return closest as T;
  return closestComposedNode(
    (childNode.getRootNode() as ShadowRoot).host,
    selector
  );
};

/**
 * Get the active element, accounting for Shadow DOM subtrees.
 * @param root - The root node to search for the active element.
 */
export function getActiveElement(
  root: Document | ShadowRoot = document
): HTMLElement {
  const activeEl = root?.activeElement;
  if (!activeEl) return null;
  return getActiveElement(activeEl.shadowRoot) ?? (activeEl as HTMLElement);
}

/**
 * Gets the document or shadow root of a node, not the node itself which can lead to bugs.
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode#return_value
 * @param node - The node to get the root node from.
 */
export function getDocumentOrShadowRoot(
  node: Node
): Document | ShadowRoot | null {
  const rootNode = node?.getRootNode?.();
  if (rootNode instanceof ShadowRoot || rootNode instanceof Document) {
    return rootNode;
  }
  return null;
}

/**
 * Checks if the element is visible includes opacity: 0 and visibility: hidden.
 * @param element - The element to check for visibility.
 */
export function isElementVisible(
  element: HTMLElement,
  { depth = 3, checkOpacity = true, checkVisibilityCSS = true } = {}
): boolean {
  // Supported by Chrome and Firefox https://caniuse.com/mdn-api_element_checkvisibility
  // https://drafts.csswg.org/cssom-view-1/#dom-element-checkvisibility
  // @ts-ignore
  if (element.checkVisibility) {
    // @ts-ignore
    return element.checkVisibility({
      checkOpacity,
      checkVisibilityCSS,
    });
  }
  // Check if the element or its ancestors are hidden.
  let el = element;
  while (el && depth > 0) {
    const style = getComputedStyle(el);
    if (
      (checkOpacity && style.opacity === '0') ||
      (checkVisibilityCSS && style.visibility === 'hidden') ||
      style.display === 'none'
    ) {
      return false;
    }
    el = el.parentElement;
    depth--;
  }
  return true;
}

export type Point = { x: number; y: number };

/**
 * Get progress ratio of a point on a line segment.
 * @param x - The x coordinate of the point.
 * @param y - The y coordinate of the point.
 * @param p1 - The first point of the line segment.
 * @param p2 - The second point of the line segment.
 */
export function getPointProgressOnLine(
  x: number,
  y: number,
  p1: Point,
  p2: Point
): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) return 0; // Avoid division by zero if p1 === p2

  const projection = ((x - p1.x) * dx + (y - p1.y) * dy) / lengthSquared;

  return Math.max(0, Math.min(1, projection)); // Clamp between 0 and 1
}

export function distance(p1: Point, p2: Point) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Get or insert a CSSStyleRule with a selector in an element containing <style> tags.
 * @param styleParent - The parent element containing <style> tags.
 * @param selectorText - The selector text of the CSS rule.
 * @return {CSSStyleRule | {
 *   style: {
 *     setProperty: () => void,
 *     removeProperty: () => void,
 *     width?: string,
 *     height?: string,
 *     display?: string,
 *     transform?: string,
 *   },
 *   selectorText: string,
 * }}
 */
export function getOrInsertCSSRule(
  styleParent: Element | ShadowRoot,
  selectorText: string
): CSSStyleRule {
  const cssRule = getCSSRule(styleParent, (st) => st === selectorText);
  if (cssRule) return cssRule;
  return insertCSSRule(styleParent, selectorText);
}

/**
 * Get a CSSStyleRule with a selector in an element containing <style> tags.
 * @param  styleParent - The parent element containing <style> tags.
 * @param  predicate - A function that returns true for the desired CSSStyleRule.
 */
export function getCSSRule(
  styleParent: Element | ShadowRoot,
  predicate: (selectorText: string) => boolean
): CSSStyleRule | undefined {
  let style;

  for (style of styleParent.querySelectorAll('style:not([media])') ?? []) {
    // Catch this error. e.g. browser extension adds style tags.
    //   Uncaught DOMException: CSSStyleSheet.cssRules getter:
    //   Not allowed to access cross-origin stylesheet
    let cssRules;
    try {
      cssRules = style.sheet?.cssRules;
    } catch {
      continue;
    }
    for (const rule of cssRules ?? []) {
      if (predicate(rule.selectorText)) return rule;
    }
  }
}

/**
 * Insert a CSSStyleRule with a selector in an element containing <style> tags.
 * @param styleParent - The parent element containing <style> tags.
 * @param selectorText - The selector text of the CSS rule.
 */
export function insertCSSRule(
  styleParent: Element | ShadowRoot,
  selectorText: string
): CSSStyleRule | undefined {
  const styles = styleParent.querySelectorAll('style:not([media])') ?? [];
  const style = styles?.[styles.length - 1];

  // If there is no style sheet return an empty style rule.
  if (!style?.sheet) {
    // The style tag must be connected to the DOM before it has a sheet.
    // This could indicate a bug. Should the code be moved to connectedCallback?
    console.warn(
      'Media Chrome: No style sheet found on style tag of',
      styleParent
    );

    return {
      // @ts-ignore
      style: {
        setProperty: () => {},
        removeProperty: () => '',
        getPropertyValue: () => '',
      },
    };
  }

  style?.sheet.insertRule(`${selectorText}{}`, style.sheet.cssRules.length);
  return /** @type {CSSStyleRule} */ style.sheet.cssRules?.[
    style.sheet.cssRules.length - 1
  ];
}

/**
 * Gets the number represented by the attribute
 * @param el - (Should be an HTMLElement, but need any for SSR cases)
 * @param attrName - The name of the attribute to get
 * @param defaultValue - The default value to return if the attribute is not set
 * @returns Will return undefined if no attribute set
 */
export function getNumericAttr(
  el: HTMLElement,
  attrName: string,
  defaultValue: number = Number.NaN
): number | undefined {
  const attrVal = el.getAttribute(attrName);
  return attrVal != null ? +attrVal : defaultValue;
}

/**
 * @param el - (Should be an HTMLElement, but need any for SSR cases)
 * @param attrName - The name of the attribute to set
 * @param value - The value to set
 */
export function setNumericAttr(
  el: HTMLElement,
  attrName: string,
  value: number
): void {
  // Simple cast to number
  const nextNumericValue = +value;

  // Treat null, undefined, and NaN as "nothing values", so unset if value is currently set.
  if (value == null || Number.isNaN(nextNumericValue)) {
    if (el.hasAttribute(attrName)) {
      el.removeAttribute(attrName);
    }
    return;
  }

  // Avoid resetting a value that hasn't changed
  if (getNumericAttr(el, attrName, undefined) === nextNumericValue) return;

  el.setAttribute(attrName, `${nextNumericValue}`);
}

/**
 * @param el - (Should be an HTMLElement, but need any for SSR cases)
 * @param attrName - The name of the attribute to get
 */
export function getBooleanAttr(el: HTMLElement, attrName: string): boolean {
  return el.hasAttribute(attrName);
}

/**
 * @param el - (Should be an HTMLElement, but need any for SSR cases)
 * @param attrName - The name of the attribute to set
 * @param value - The value to set
 */
export function setBooleanAttr(
  el: HTMLElement,
  attrName: string,
  value: boolean
): void {
  // also handles undefined
  if (value == null) {
    if (el.hasAttribute(attrName)) {
      el.removeAttribute(attrName);
    }
    return;
  }

  // avoid setting a value that hasn't changed
  // NOTE: For booleans, we can rely on a loose equality check
  if (getBooleanAttr(el, attrName) == value) return;

  el.toggleAttribute(attrName, value);
}

/**
 * @param el - (Should be an HTMLElement, but need any for SSR cases)
 * @param attrName - The name of the attribute to get
 * @param defaultValue - The default value to return if the attribute is not set
 */
export function getStringAttr(
  el: HTMLElement,
  attrName: string,
  defaultValue: any = null
) {
  return el.getAttribute(attrName) ?? defaultValue;
}

/**
 * @param el -  (Should be an HTMLElement, but need any for SSR cases)
 * @param attrName - The name of the attribute to get
 * @param value - The value to set
 */
export function setStringAttr(
  el: HTMLElement,
  attrName: string,
  value: string
) {
  // also handles undefined
  if (value == null) {
    if (el.hasAttribute(attrName)) {
      el.removeAttribute(attrName);
    }
    return;
  }

  const nextValue = `${value}`;
  // avoid triggering a set if no change
  if (getStringAttr(el, attrName, undefined) === nextValue) return;

  el.setAttribute(attrName, nextValue);
}
