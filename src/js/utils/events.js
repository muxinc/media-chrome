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
