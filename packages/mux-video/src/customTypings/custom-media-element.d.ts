/** @TODO Add type defs to custom-video-element directly */
declare module 'custom-video-element' {
    export default class CustomVideoElement extends HTMLElement implements HTMLVideoElement {
        static readonly observedAttributes: Array<string>;
        readonly nativeEl: HTMLVideoElement
    }
}