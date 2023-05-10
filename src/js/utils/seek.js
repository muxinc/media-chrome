import { verbs } from '../labels/labels.js';
import { getSlotted, updateIconText } from './element-utils.js';
import { Attributes } from '../media-seek-backward-button.js';

/**
 * @param {HTMLElement & { seekOffset: number; }} el
 */
export function updateAriaLabel(el) {
  // NOTE: seek direction is described via text
  // so always use positive numeric representation
  const seekOffset = Math.abs(el.seekOffset);
  const label = verbs.SEEK_BACK_N_SECS({ seekOffset });
  el.setAttribute('aria-label', label);
}

/**
 * @param {HTMLElement & { seekOffset: number; }} el
 * @param {"backward" | "forward"} direction
 */
export function updateSeekIconValue(el, direction) {
  const svg = getSlotted(el, direction);
  const value = el.seekOffset;
  updateIconText(svg, value);
}
