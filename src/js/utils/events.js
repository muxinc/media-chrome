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
