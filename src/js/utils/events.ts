export type InvokeEventInit = EventInit & {
  action?: string;
  relatedTarget: Element;
};

/**
 * Dispatch an InvokeEvent on the target element to perform an action.
 * The default action is auto, which is determined by the target element.
 * In our case it's only used for toggling a menu.
 */
export class InvokeEvent extends Event {
  action: string;
  relatedTarget: Element;

  /**
   * @param init - The event options.
   */
  constructor({ action = 'auto', relatedTarget, ...options }: InvokeEventInit) {
    super('invoke', options);
    this.action = action;
    this.relatedTarget = relatedTarget;
  }
}

export type ToggleState = 'open' | 'closed';
export type ToggleEventInit = EventInit & {
  newState: ToggleState;
  oldState: ToggleState;
};

/**
 * Similar to the popover toggle event.
 * https://developer.mozilla.org/en-US/docs/Web/API/ToggleEvent
 */
export class ToggleEvent extends Event {
  newState: ToggleState;
  oldState: ToggleState;

  /**
   * @param init - The event options.
   */
  constructor({ newState, oldState, ...options }: ToggleEventInit) {
    super('toggle', options);
    this.newState = newState;
    this.oldState = oldState;
  }
}
