import { window } from './utils/server-safe-globals.js';

class MediaViewerCount extends window.HTMLElement {
  constructor() {
    super();
  }

  get token() {
    return this.getAttribute('token');
  }

  get interval() {
    return this.getAttribute('interval')*1000;
  }

  disconnectedCallback() {
    clearInterval(this.myInterval);
  }

  getViewCount(myToken) {
    
    const url = `https://stats.mux.com/counts?token=${myToken}`
    let success = 1;

    try {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET", url, false);
      xmlHttp.send(null);
    } catch (exception) {
      success = 0;
      console.warn("Error retrieving media-viewer-count data: "+exception)
    }
    if (success) {
      let responseObj = JSON.parse(xmlHttp.responseText);
      const hasError = Object.prototype.hasOwnProperty.call(responseObj,'error');
      const hasData = Object.prototype.hasOwnProperty.call(responseObj,'data');
      if (hasError) {
        console.warn("Error retrieving media-viewer-count data: "+responseObj.error);
        return false;
      } else if (hasData) {
        let data = responseObj.data[0];
        this.textContent = data.views;
      } else {
        console.warn("Error retrieving media-viewer-count data: no data in response");
        return false;
      }
    }
  }

  connectedCallback() {
    this.getViewCount(this.token);
    this.myInterval = setInterval(this.getViewCount.bind(this),this.interval,this.token);
  }
}

if (!window.customElements.get('media-viewer-count')) {
  window.customElements.define('media-viewer-count', MediaViewerCount);
}

export default MediaViewerCount;
