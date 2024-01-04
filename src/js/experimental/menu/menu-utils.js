import { MediaStateReceiverAttributes } from '../../constants.js';
import { closestComposedNode } from '../../utils/element-utils.js';

/** @typedef {import('./media-chrome-menu.js').MediaChromeMenu} MediaChromeMenu */

export function showMenu(button, targetLocalName) {
  const target = getTarget(button, targetLocalName);
  const hidden = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', `${!hidden}`);
  target.hidden = hidden;
}

export function getTarget(button, targetLocalName) {
  const container = getMediaControllerElement(button)
    ?? /** @type {ShadowRoot|Document} */ (button.getRootNode());

  return /** @type {MediaChromeMenu} */ (/** @type {unknown} */ (
    container.querySelector(button.target ? `#${button.target}` : targetLocalName)
  ));
}

export function getMediaControllerElement(host) {
  const mediaControllerId = host.getAttribute(MediaStateReceiverAttributes.MEDIA_CONTROLLER);
  if (mediaControllerId) {
    return host.getRootNode()?.getElementById(mediaControllerId);
  }
  return closestComposedNode(host, 'media-controller');
}
