const mediaElPropTypes = {
  muted: 'boolean',
  volume: 'number',
  textTracks: 'object',
  readyState: 'number',
  currentTime: 'number',
  playbackRate: 'number',
  paused: 'boolean',
  play: 'function',
  pause: 'function',
};
const mediaElPropTypeTuples = Object.entries(mediaElPropTypes);

// Predicate that checks if a particular node minimally conforms to an HTMLMediaElement's shape.
export const isMediaEl = (node) => {
  return (
    node &&
    mediaElPropTypeTuples.every(
      ([propName, propType]) => typeof node[propName] === propType
    )
  );
};
