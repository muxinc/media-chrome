/** @TODO Add type defs to custom-video-element directly */
export default class CustomVideoElement<
    V extends HTMLVideoElement = HTMLVideoElement
  >
  extends HTMLElement
  implements HTMLVideoElement
{
  static readonly observedAttributes: Array<string>;
  readonly nativeEl: V;
  attributeChangedCallback(attrName, oldValue, newValue): void;
}
