/** @TODO Add type defs to custom-video-element directly */
export default class CustomAudioElement<
    V extends HTMLAudioElement = HTMLAudioElement
  >
  extends HTMLElement
  implements HTMLAudioElement
{
  static readonly observedAttributes: Array<string>;
  readonly nativeEl: V;
  attributeChangedCallback(attrName, oldValue, newValue): void;
}
