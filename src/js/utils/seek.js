import { verbs } from '../labels/labels.js';
import { getSlotted, updateIconText } from './element-utils.js';
import { Attributes } from '../media-seek-backward-button.js';

/**
 * @param {HTMLElement} el
 */
export const updateAriaLabel = (el) => {
  // NOTE: seek direction is described via text
  // so always use positive numeric representation
  const seekOffset = Math.abs(+el.getAttribute(Attributes.SEEK_OFFSET));
  const label = verbs.SEEK_BACK_N_SECS({ seekOffset });
  el.setAttribute('aria-label', label);
};

/**
 * @param {HTMLElement} el
 */
export const updateSeekIconValue = (el) => {
  const svg = getSlotted(el, 'backward');
  const value = el.getAttribute(Attributes.SEEK_OFFSET);
  updateIconText(svg, value);
};
