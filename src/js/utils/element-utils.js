import { MediaStateReceiverAttributes } from '../constants.js';

/** @typedef {import('../media-controller.js').MediaController} MediaController */

/**
 * Get the media controller element from the `mediacontroller` attribute or closest ancestor.
 * @param  {HTMLElement} host
 * @return {MediaController | undefined}
 */
export function getMediaController(host) {
  return (
    getAttributeMediaController(host) ??
    closestComposedNode(host, 'media-controller')
  );
}

/**
 * Get the media controller element from the `mediacontroller` attribute.
 * @param  {HTMLElement} host
 * @return {MediaController | undefined}
 */
export function getAttributeMediaController(host) {
  const { MEDIA_CONTROLLER } = MediaStateReceiverAttributes;
  const mediaControllerId = host.getAttribute(MEDIA_CONTROLLER);

  if (mediaControllerId) {
    return /** @type MediaController */ (
      /** @type {unknown} */ (
        getDocumentOrShadowRoot(host)?.getElementById(mediaControllerId)
      )
    );
  }
}

export const updateIconText = (svg, value, selector = '.value') => {
  const node = svg.querySelector(selector);

  if (!node) return;

  node.textContent = value;
};

export const getAllSlotted = (el, name) => {
  const slotSelector = `slot[name="${name}"]`;
  const slot = el.shadowRoot.querySelector(slotSelector);
  if (!slot) return [];
  return slot.children;
};

export const getSlotted = (el, name) => getAllSlotted(el, name)[0];

/**
 *
 * @param {{ contains?: Node['contains'] }} [rootNode]
 * @param {Node} [childNode]
 * @returns boolean
 */
export const containsComposedNode = (rootNode, childNode) => {
  if (!rootNode || !childNode) return false;
  if (rootNode?.contains(childNode)) return true;
  return containsComposedNode(
    rootNode,
    /** @type {ShadowRoot} */ (childNode.getRootNode()).host
  );
};

export const closestComposedNode = (childNode, selector) => {
  if (!childNode) return null;
  const closest = childNode.closest(selector);
  if (closest) return closest;
  return closestComposedNode(childNode.getRootNode().host, selector);
};

/**
 * Get the active element, accounting for Shadow DOM subtrees.
 * @param {Document|ShadowRoot} root
 * @return {Element|null}
 */
export function getActiveElement(root = document) {
  const activeEl = root?.activeElement;
  if (!activeEl) return null;
  return getActiveElement(activeEl.shadowRoot) ?? activeEl;
}

/**
 * Gets the document or shadow root of a node, not the node itself which can lead to bugs.
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode#return_value
 * @param {Node} node
 * @return {Document|ShadowRoot|null}
 */
export function getDocumentOrShadowRoot(node) {
  const rootNode = node?.getRootNode?.();
  if (rootNode instanceof ShadowRoot || rootNode instanceof Document) {
    return rootNode;
  }
  return null;
}

/**
 * Checks if the element is visible includes opacity: 0 and visibility: hidden.
 * @param  {HTMLElement} element
 * @return {Boolean}
 */
export function isElementVisible(element, depth = 3) {
  // Supported by Chrome and Firefox https://caniuse.com/mdn-api_element_checkvisibility
  // https://drafts.csswg.org/cssom-view-1/#dom-element-checkvisibility
  // @ts-ignore
  if (element.checkVisibility) {
    // @ts-ignore
    return element.checkVisibility({
      checkOpacity: true,
      checkVisibilityCSS: true,
    });
  }
  // Check if the element or its ancestors are hidden.
  let el = element;
  while (el && depth > 0) {
    const style = getComputedStyle(el);
    if (
      style.opacity === '0' ||
      style.visibility === 'hidden' ||
      style.display === 'none'
    ) {
      return false;
    }
    el = el.parentElement;
    depth--;
  }
  return true;
}

/**
 * Get progress ratio of a point on a line segment.
 * @param  {number} x
 * @param  {number} y
 * @param  {{ x: number, y: number }} p1
 * @param  {{ x: number, y: number }} p2
 * @return {number}
 */
export function getPointProgressOnLine(x, y, p1, p2) {
  const segment = distance(p1, p2);
  const toStart = distance(p1, { x, y });
  const toEnd = distance(p2, { x, y });
  if (toStart > segment || toEnd > segment) {
    // Point is outside the line segment, so clamp it to the nearest end
    return toStart > toEnd ? 1 : 0;
  }
  return toStart / segment;
}

export function distance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Get or insert a CSSStyleRule with a selector in an element containing <style> tags.
 * @param  {Element|ShadowRoot} styleParent
 * @param  {string} selectorText
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
export function getOrInsertCSSRule(styleParent, selectorText) {
  const cssRule = getCSSRule(styleParent, (st) => st === selectorText);
  if (cssRule) return cssRule;
  return insertCSSRule(styleParent, selectorText);
}

/**
 * Get a CSSStyleRule with a selector in an element containing <style> tags.
 * @param  {Element|ShadowRoot} styleParent
 * @param  {(selectorText) => boolean} predicate
 * @return {CSSStyleRule | undefined}
 */
export function getCSSRule(styleParent, predicate) {
  let style;
  // @ts-ignore
  for (style of styleParent.querySelectorAll('style')) {
    // Catch this error. e.g. browser extension adds style tags.
    //   Uncaught DOMException: CSSStyleSheet.cssRules getter:
    //   Not allowed to access cross-origin stylesheet
    let cssRules;
    try {
      cssRules = style.sheet?.cssRules;
    } catch {
      continue;
    }
    for (let rule of cssRules ?? []) {
      if (predicate(rule.selectorText)) return rule;
    }
  }
}

/**
 * Insert a CSSStyleRule with a selector in an element containing <style> tags.
 * @param  {Element|ShadowRoot} styleParent
 * @param  {string} selectorText
 * @return {CSSStyleRule | undefined}
 */
export function insertCSSRule(styleParent, selectorText) {
  const styles = styleParent.querySelectorAll('style') ?? [];
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
  return /** @type {CSSStyleRule} */ (
    style.sheet.cssRules?.[style.sheet.cssRules.length - 1]
  );
}

/**
 * Gets the number represented by the attribute
 * @param {any} el (Should be an HTMLElement, but need any for SSR cases)
 * @param {string} attrName
 * @param {number} [defaultValue = Number.NaN]
 * @returns {number | undefined} Will return undefined if no attribute set
 */
export function getNumericAttr(el, attrName, defaultValue = Number.NaN) {
  const attrVal = el.getAttribute(attrName);
  return attrVal != null ? +attrVal : defaultValue;
}

/**
 * @param {any} el (Should be an HTMLElement, but need any for SSR cases)
 * @param {string} attrName
 * @param {number} value
 */
export function setNumericAttr(el, attrName, value) {
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
 * @param {any} el (Should be an HTMLElement, but need any for SSR cases)
 * @param {string} attrName
 * @returns {boolean}
 */
export function getBooleanAttr(el, attrName) {
  return el.hasAttribute(attrName);
}

/**
 * @param {any} el (Should be an HTMLElement, but need any for SSR cases)
 * @param {string} attrName
 * @param {boolean} value
 */
export function setBooleanAttr(el, attrName, value) {
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
 * @param {any} el (Should be an HTMLElement, but need any for SSR cases)
 * @param {string} attrName
 */
export function getStringAttr(el, attrName, defaultValue = null) {
  return el.getAttribute(attrName) ?? defaultValue;
}

/**
 * @param {*} el (Should be an HTMLElement, but need any for SSR cases)
 * @param {string} attrName
 * @param {string} value
 */
export function setStringAttr(el, attrName, value) {
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
