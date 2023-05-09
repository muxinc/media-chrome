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
 * @returns {number | undefined} Will return undefined if no attribute set
 */
export function getNumericAttr(el, attrName) {
  const attrVal = el.getAttribute(attrName);
  return attrVal != null ? +attrVal : undefined;
}

/**
 * @param {any} el (Should be an HTMLElement, but need any for SSR cases)
 * @param {string} attrName
 * @param {number} value
 */
export function setNumericAttr(el, attrName, value) {
  // avoid setting a value that hasn't changed
  if (getNumericAttr(el, attrName) == value) return;

  // also handles undefined
  if (value == null) {
    el.removeAttribute(attrName);
    return;
  }

  // force to a numeric value before setting as a string
  el.setAttribute(attrName, `${+value}`);
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
  // avoid setting a value that hasn't changed
  if (getBooleanAttr(el, attrName) == value) return;

  // also handles undefined
  if (value == null) {
    el.removeAttribute(attrName);
    return;
  }

  el.toggleAttribute(attrName, value);
}

/**
 * @param {any} el (Should be an HTMLElement, but need any for SSR cases)
 * @param {string} attrName
 */
export function getStringAttr(el, attrName) {
  return el.getAttribute(attrName) ?? undefined;
}

/**
 * @param {*} el (Should be an HTMLElement, but need any for SSR cases)
 * @param {string} attrName
 * @param {string} value
 */
export function setStringAttr(el, attrName, value) {
  // avoid triggering a set if no change
  if (getStringAttr(el, attrName) == value) return;

  // also handles undefined
  if (value == null) {
    el.removeAttribute(attrName);
    return;
  }

  el.setAttribute(attrName, `${value}`);
}
