import { document } from './server-safe-globals.js';
import { getOrInsertCSSRule, insertCSSRule } from './element-utils.js';
import { observeResize, unobserveResize } from './resize-observer.js';

const template = document.createElement('template');
template.innerHTML = /*html*/`
  <style>
    .segments #appearance {
      height: var(--media-range-segment-hover-height, 7px);
    }

    #background,
    #track {
      clip-path: url(#segments-clipping);
    }

    #segments {
      --segments-gap: var(--media-range-segments-gap, 2px);
      position: absolute;
      width: 100%;
      height: 100%;
    }

    #segments-clipping {
      transform: translateX(calc(var(--segments-gap) / 2));
    }

    #segments-clipping:empty {
      display: none;
    }

    #segments-clipping rect {
      height: var(--media-range-track-height, 4px);
      y: calc((var(--media-range-segment-hover-height, 7px) - var(--media-range-track-height, 4px)) / 2);
      transition: var(--media-range-segment-transition, transform .1s ease-in-out);
      transform: var(--media-range-segment-transform, scaleY(1));
      transform-origin: center;
    }
  </style>
  <svg id="segments"><clipPath id="segments-clipping"></clipPath></svg>
`;

/** @typedef {new (...args: any[]) => any} Constructor */
/**
 * @template {!Constructor} T
 * @param {T} superclass - The class to extend
 */
export const RangeSegmentsMixin = (superclass) =>
  class RangeSegments extends superclass {
    #segments = [];
    #cssRules = {};

    connectedCallback() {
      super.connectedCallback();
      observeResize(this.container, this.#updateComputedStyles);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      unobserveResize(this.container, this.#updateComputedStyles);
    }

    #updateComputedStyles = () => {
      // This fixes a Chrome bug where it doesn't refresh the clip-path on content resize.
      const clipping = this.shadowRoot.querySelector('#segments-clipping');
      if (clipping) clipping.parentNode.append(clipping);
    }

    updateSegments(segments) {
      if (!segments?.length) return;

      let clipping = this.shadowRoot.querySelector('#segments-clipping');

      if (!clipping) {
        this.#cssRules.activeSegment = insertCSSRule(this.shadowRoot, '#segments-clipping rect:nth-child(0)');
        this.appearance.append(template.content.cloneNode(true));
      }

      this.container.classList.toggle('segments', !!segments.length);

      clipping = this.shadowRoot.querySelector('#segments-clipping');
      clipping.textContent = '';

      const normalized = [...new Set([
        +this.range.min,
        ...segments.flatMap(s => [s.start, s.end]),
        +this.range.max
      ])];

      this.#segments = [...normalized];

      const lastMarker = normalized.pop();
      for (const [i, marker] of normalized.entries()) {
        const [isFirst, isLast] = [i === 0, i === normalized.length - 1];
        const x = isFirst ? 'calc(var(--segments-gap) / -1)' : `${marker * 100}%`;
        const x2 = isLast ? lastMarker : normalized[i + 1];
        const width = `calc(${(x2 - marker) * 100}%${isFirst || isLast ? '' : ` - var(--segments-gap)`})`;

        const segmentEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const cssRule = getOrInsertCSSRule(this.shadowRoot, `#segments-clipping rect:nth-child(${i + 1})`);
        cssRule.style.setProperty('x', x);
        cssRule.style.setProperty('width', width);
        clipping.append(segmentEl);
      }
    }

    handleEvent(evt) {
      super.handleEvent(evt);

      switch (evt.type) {
        case 'pointermove':
          this.#updateActiveSegment(evt);
          break;
        case 'pointerleave':
          this.#cssRules.activeSegment?.style.removeProperty('transform');
          break;
      }
    }

    #updateActiveSegment(evt) {
      const rule = this.#cssRules.activeSegment;
      if (!rule) return;

      const pointerRatio = this.getPointerRatio(evt);
      const segmentIndex = this.#segments.findIndex((start, i, arr) => {
        const end = arr[i + 1];
        return end != null && pointerRatio >= start && pointerRatio <= end;
      });

      const selectorText = `#segments-clipping rect:nth-child(${segmentIndex + 1})`;

      if (rule.selectorText != selectorText || !rule.style.transform) {
        rule.selectorText = selectorText;
        rule.style.setProperty(
          'transform',
          'var(--media-range-segment-hover-transform, scaleY(2))'
        );
      }
    }
  };
