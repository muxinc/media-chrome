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
