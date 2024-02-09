/* Adapted from floating-ui - The MIT License - Floating UI contributors */

export function computePosition({ anchor, floating, placement }) {
  let rects = getElementRects({ anchor, floating });
  let { x, y } = computeCoordsFromPlacement(rects, placement);
  return { x, y };
}

function getElementRects({ anchor, floating }) {
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

function getRectRelativeToOffsetParent(element, offsetParent) {
  let rect = element.getBoundingClientRect();
  let offsetRect = offsetParent.getBoundingClientRect();
  return {
    x: rect.x - offsetRect.x,
    y: rect.y - offsetRect.y,
    width: rect.width,
    height: rect.height,
  };
}

function computeCoordsFromPlacement({ anchor, floating }, placement) {
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

function getSide(placement) {
  return placement.split('-')[0];
}

function getSideAxis(placement) {
  return ['top', 'bottom'].includes(getSide(placement)) ? 'y' : 'x';
}
