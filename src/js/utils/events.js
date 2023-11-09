/**
 * Similar to the popover toggle event in anticipation of using <selectlist>.
 * https://developer.mozilla.org/en-US/docs/Web/API/ToggleEvent
 */
export class ToggleEvent extends Event {
  /** @type {'open' | 'closed'} */
  newState;
  /** @type {'open' | 'closed'} */
  oldState;
  /**
   * @param  {string} type
   * @param  {EventInit & { newState: 'open' | 'closed', oldState: 'open' | 'closed' }} init
   */
  constructor(type, { newState, oldState, ...options }) {
    super(type, options);
    this.newState = newState;
    this.oldState = oldState;
  }
}
