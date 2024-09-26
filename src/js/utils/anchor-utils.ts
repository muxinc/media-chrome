/* Adapted from floating-ui - The MIT License - Floating UI contributors */

import type { Point } from './Point.js';
import type { Rect } from './Rect.js';

export type PositionElements = {
  anchor: HTMLElement;
  floating: HTMLElement;
};

export type PositionRects = {
  anchor: Rect;
  floating: Rect;
};

export type Positions = PositionElements & {
  placement: string;
};

export function computePosition({
  anchor,
  floating,
  placement,
}: Positions): Point {
  const rects = getElementRects({ anchor, floating });
  const { x, y } = computeCoordsFromPlacement(rects, placement);
  return { x, y };
}

function getElementRects({
  anchor,
  floating,
}: PositionElements): PositionRects {
  return {
    anchor: getRectRelativeToOffsetParent(anchor, floating.offsetParent),
    floating: {
      x: 0,
      y: 0,
      width: floating.offsetWidth,
      height: floating.offsetHeight,
    },
  };
}

function getRectRelativeToOffsetParent(
  element: Element,
  offsetParent: Element
): Rect {
  const rect = element.getBoundingClientRect();
  // offsetParent returns null in the following situations:
  // - The element or any ancestor has the display property set to none.
  // - The element has the position property set to fixed (Firefox returns <body>).
  // - The element is <body> or <html>.
  const offsetRect = offsetParent?.getBoundingClientRect() ?? { x: 0, y: 0 };
  return {
    x: rect.x - offsetRect.x,
    y: rect.y - offsetRect.y,
    width: rect.width,
    height: rect.height,
  };
}

function computeCoordsFromPlacement(
  { anchor, floating }: PositionRects,
  placement: string
): Rect {
  const alignmentAxis = getSideAxis(placement) === 'x' ? 'y' : 'x';
  const alignLength = alignmentAxis === 'y' ? 'height' : 'width';
  const side = getSide(placement);

  const commonX = anchor.x + anchor.width / 2 - floating.width / 2;
  const commonY = anchor.y + anchor.height / 2 - floating.height / 2;
  const commonAlign = anchor[alignLength] / 2 - floating[alignLength] / 2;

  let coords;
  switch (side) {
    case 'top':
      coords = { x: commonX, y: anchor.y - floating.height };
      break;
    case 'bottom':
      coords = { x: commonX, y: anchor.y + anchor.height };
      break;
    case 'right':
      coords = { x: anchor.x + anchor.width, y: commonY };
      break;
    case 'left':
      coords = { x: anchor.x - floating.width, y: commonY };
      break;
    default:
      coords = { x: anchor.x, y: anchor.y };
  }

  switch (placement.split('-')[1]) {
    case 'start':
      coords[alignmentAxis] -= commonAlign;
      break;
    case 'end':
      coords[alignmentAxis] += commonAlign;
      break;
  }

  return coords;
}

function getSide(placement: string): string {
  return placement.split('-')[0];
}

function getSideAxis(placement: string): 'x' | 'y' {
  return ['top', 'bottom'].includes(getSide(placement)) ? 'y' : 'x';
}
