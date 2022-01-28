/* 
  Renamed to <media-time-range> and deprecated
*/

import MediaTimeRange from './media-time-range.js';
import { defineCustomElement } from './utils/defineCustomElement.js';

class MediaProgressRange extends MediaTimeRange {
  constructor() {
    super();

    console.warn(
      'MediaChrome: <media-progress-range> is deprecated. Use <media-time-range> instead.'
    );
  }
}

defineCustomElement('media-progress-range', MediaProgressRange);

export default MediaProgressRange;
