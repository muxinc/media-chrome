// Web Components: Extending Native Elements, A working example

import CustomVideoElement from 'custom-video-element';
import Hls from 'hls.js';

class MuxVideoElement extends CustomVideoElement {

  protected __hls?: Hls;

  constructor() {
    super();
  }

  get hls() {
    return this.__hls;
  }

  get src() {
    // Use the attribute value as the source of truth.
    // No need to store it in two places.
    // This avoids needing a to read the attribute initially and update the src.
    return this.getAttribute('src');
  }

  set src(val) {
    // If being set by attributeChangedCallback,
    // dont' cause an infinite loop
    if (val === this.src) return;
    
    if (val == null) {
      this.removeAttribute('src');
    } else {
      this.setAttribute('src', val);
    }
  }

  load() {
    /** @TODO Add custom errors + error codes */
    if (!this.src) {
      console.error('DONT DO THIS');
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        // Kind of like preload metadata, but causes spinner.
        // autoStartLoad: false,
      });

      hls.loadSource(this.src);
      hls.attachMedia(this.nativeEl);

      this.__hls = hls;

    } else if (this.nativeEl.canPlayType('application/vnd.apple.mpegurl')) {
      this.nativeEl.src = this.src;
    }
  }

  // play() {
  //   if (this.readyState === 0 && this.networkState < 2) {
  //     this.load();
  //     this.hls.on(Hls.Events.MANIFEST_PARSED,function() {
  //     video.play();
  //
  //     return this.nativeEl.play();
  //   }
  // }

  connectedCallback() {
    this.load();

    // Not preloading might require faking the play() promise
    // so that you can call play(), call load() within that
    // But wait until MANIFEST_PARSED to actually call play()
    // on the nativeEl.
    // if (this.preload === 'auto') {
    //   this.load();
    // }
  }
}

declare global {
  interface Window { MuxVideoElement: typeof MuxVideoElement; }
}

if (!window.customElements.get('hls-video')) {
  window.customElements.define('hls-video', MuxVideoElement);
  window.MuxVideoElement = MuxVideoElement;
}

export default MuxVideoElement;