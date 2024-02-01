/**
 * Dispatch an InvokeEvent on the target element to perform an action.
 * The default action is auto, which is determined by the target element.
 * In our case it's only used for toggling a menu.
 */
export class InvokeEvent extends Event {
  /** @type {string} */
  action;
  /** @type {Element} */
  relatedTarget;
  /** @param  {EventInit & { action?: string, relatedTarget: Element }} init */
  constructor({ action = 'auto', relatedTarget, ...options }) {
    super('invoke', options);
    this.action = action;
    this.relatedTarget = relatedTarget;
  }
}

/**
 * Similar to the popover toggle event.
 * https://developer.mozilla.org/en-US/docs/Web/API/ToggleEvent
 */
export class ToggleEvent extends Event {
  /** @type {'open' | 'closed'} */
  newState;
  /** @type {'open' | 'closed'} */
  oldState;
  /**
   * @param  {EventInit & { newState: 'open' | 'closed', oldState: 'open' | 'closed' }} init
   */
  constructor({ newState, oldState, ...options }) {
    super('toggle', options);
    this.newState = newState;
    this.oldState = oldState;
  }
}
