/* 
  Renamed to <media-time-range> and deprecated
*/

import MediaTimeRange from './media-time-range.js';
import { window } from './utils/server-safe-globals.js';

class MediaProgressRange extends MediaTimeRange {
  constructor() {
    super();

    console.warn(
      'MediaChrome: <media-progress-range> is deprecated. Use <media-time-range> instead.'
    );
  }
}

if (!window.customElements.get('media-progress-range')) {
  window.customElements.define('media-progress-range', MediaProgressRange);
}

export default MediaProgressRange;
