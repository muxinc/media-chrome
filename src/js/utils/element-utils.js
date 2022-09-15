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
 * @param  {Element} styleParent
 * @param  {string} selectorText
 * @return {CSSStyleRule|{ style: { setProperty: () => {} } }}
 */
export function getOrInsertCSSRule(styleParent, selectorText) {
  let style;
  for (style of styleParent.querySelectorAll('style')) {
    for (let rule of style.sheet?.cssRules ?? [])
      if (rule.selectorText === selectorText) return rule;
  }
  // If there is no style sheet return an empty style rule.
  if (!style?.sheet) return { style: { setProperty: () => {} } };

  style.sheet.insertRule(`${selectorText}{}`, style.sheet.cssRules.length);
  return style.sheet.cssRules[style.sheet.cssRules.length - 1];
}
