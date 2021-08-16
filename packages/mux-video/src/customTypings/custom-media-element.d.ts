/** @TODO Add type defs to custom-video-element directly */
declare module "custom-video-element" {
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
}
