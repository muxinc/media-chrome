import { delay } from './utils.js';

let testMediaEl;
export const getTestMediaEl = () => {
  if (testMediaEl) return testMediaEl;
  testMediaEl = document?.createElement?.('video');
  return testMediaEl;
};

export const hasVolumeSupportAsync = async (mediaEl = getTestMediaEl()) => {
  if (!mediaEl) return false;
  const prevVolume = mediaEl.volume;
  mediaEl.volume = prevVolume / 2 + 0.1;
  await delay(0);
  return mediaEl.volume !== prevVolume;
};

export const hasPipSupport = (mediaEl = getTestMediaEl()) =>
  typeof mediaEl?.requestPictureInPicture === 'function';