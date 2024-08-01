import { TextTrackKinds } from '../constants.js';
import type { Rendition } from '../media-store/state-mediator';
import type { TextTrackLike } from './TextTrackLike.js';

export function stringifyRenditionList(renditions: Rendition[]): string {
  return renditions?.map(stringifyRendition).join(' ');
}

export function parseRenditionList(renditions: string): Rendition[] {
  return renditions?.split(/\s+/).map(parseRendition);
}

export function stringifyRendition(rendition: Rendition): string {
  if (rendition) {
    const { id, width, height } = rendition;
    return [id, width, height].filter((a) => a != null).join(':');
  }
}

export function parseRendition(rendition: string): Rendition {
  if (rendition) {
    const [id, width, height] = rendition.split(':');
    return { id, width: +width, height: +height };
  }
}

export function stringifyAudioTrackList(audioTracks: any[]) {
  return audioTracks?.map(stringifyAudioTrack).join(' ');
}

export function parseAudioTrackList(audioTracks: string): TextTrackLike[] {
  return audioTracks?.split(/\s+/).map(parseAudioTrack);
}

export function stringifyAudioTrack(audioTrack: any): string {
  if (audioTrack) {
    const { id, kind, language, label } = audioTrack;
    return [id, kind, language, label].filter((a) => a != null).join(':');
  }
}

export function parseAudioTrack(audioTrack: string): TextTrackLike {
  if (audioTrack) {
    const [id, kind, language, label] = audioTrack.split(':');
    return {
      id,
      kind: kind as TextTrackKinds,
      language,
      label,
    };
  }
}

export function dashedToCamel(word: string): string {
  return word
    .split('-')
    .map(function (x, i) {
      return (
        (i ? x[0].toUpperCase() : x[0].toLowerCase()) + x.slice(1).toLowerCase()
      );
    })
    .join('');
}

export function constToCamel(
  word: string,
  upperFirst: boolean = false
): string {
  return word
    .split('_')
    .map(function (x, i) {
      return (
        (i || upperFirst ? x[0].toUpperCase() : x[0].toLowerCase()) +
        x.slice(1).toLowerCase()
      );
    })
    .join('');
}

export function camelCase(name: string): string {
  return name.replace(/[-_]([a-z])/g, ($0, $1) => $1.toUpperCase());
}

export function isValidNumber(x: any): boolean {
  return typeof x === 'number' && !Number.isNaN(x) && Number.isFinite(x);
}

export function isNumericString(str: any): boolean {
  if (typeof str != 'string') return false;
  return !isNaN(str as any) && !isNaN(parseFloat(str));
}

/**
 * Returns a promise that will resolve after passed ms.
 * @param  {number} ms
 * @return {Promise}
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const capitalize = (str: string) =>
  str && str[0].toUpperCase() + str.slice(1);
