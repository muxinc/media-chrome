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

export const containsWithShadow = (refNode, otherNode) => {
  if (!refNode || !otherNode) return false;
  if (refNode.contains(otherNode)) return true;
  return [refNode, ...refNode.querySelectorAll("*")].some((el) => {
    return containsWithShadow(el.shadowRoot, otherNode);
  });
}
