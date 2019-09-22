// Web Components: Extending Native Elements, A working example

import CustomVideoElement from './custom-video-element.js';
import Hls from 'hls.js';

class HLSVideoElement extends CustomVideoElement {
  constructor() {
    super();
  }

  get testAttr() {
    return false;
  }

  set testAttr(val) {
    console.log('set testAttr');
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
    if (val !== this.src) {
      this.setAttribute('src', val);
    }
  }

  load() {
    if (Hls.isSupported()) {
      var hls = new Hls({
        // Kind of like preload metadata, but causes spinner.
        // autoStartLoad: false,
      });

      hls.loadSource(this.src);
      hls.attachMedia(this.nativeEl);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
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

window.customElements.define('hls-video', HLSVideoElement);
window.HLSVideoElement = HLSVideoElement;

export default HLSVideoElement;
