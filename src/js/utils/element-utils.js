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

export const containsComposedNode = (rootNode, childNode) => {
  if (!rootNode || !childNode) return false;
  if (rootNode.contains(childNode)) return true;
  return containsComposedNode(rootNode, childNode.getRootNode().host);
};

export const closestComposedNode = (childNode, selector) => {
  if (!childNode) return null;
  const closest = childNode.closest(selector);
  if (closest) return closest;
  return closestComposedNode(childNode.getRootNode().host, selector);
};

/**
 * Get or insert a CSS rule with a selector in an element containing <style> tags.
 * @param  {Element|ShadowRoot} styleParent
 * @param  {string} selectorText
 * @return {CSSStyleRule |
 * { style: {
 * setProperty: () => void,
 * removeProperty: () => void,
 * width?: string,
 * height?: string,
 * display?: string,
 * transform?: string,
 * }}}
 */
export function getOrInsertCSSRule(styleParent, selectorText) {
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
    for (let rule of cssRules ?? [])
      if (rule.selectorText === selectorText) return rule;
  }
  // If there is no style sheet return an empty style rule.
  if (!style?.sheet) {
    return {
      style: {
        setProperty: () => {},
        removeProperty: () => {},
      },
    };
  }

  style.sheet.insertRule(`${selectorText}{}`, style.sheet.cssRules.length);
  return style.sheet.cssRules[style.sheet.cssRules.length - 1];
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

/**
 * Get the active element, accounting for Shadow DOM subtrees.
 * @author Cory LaViska
 * @see https://www.abeautifulsite.net/posts/finding-the-active-element-in-a-shadow-root/
 */
export function getActiveElement(root = document) {
  const activeEl = root.activeElement;

  if (!activeEl) return null;

  // If there’s a shadow root, recursively find the active element within it.
  // If the recursive call returns null, return the active element
  // of the top-level Document.
  if (activeEl.shadowRoot) {
    // @ts-ignore
    return getActiveElement(activeEl.shadowRoot) || document.activeElement;
  }

  // If not, we can just return the active element
  return activeEl;
}
