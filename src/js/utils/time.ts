import { isValidNumber } from './utils.js';

const UnitLabels = [
  {
    singular: 'hour',
    plural: 'hours',
  },
  {
    singular: 'minute',
    plural: 'minutes',
  },
  {
    singular: 'second',
    plural: 'seconds',
  },
];
const toTimeUnitPhrase = (timeUnitValue, unitIndex) => {
  const unitLabel =
    timeUnitValue === 1
      ? UnitLabels[unitIndex].singular
      : UnitLabels[unitIndex].plural;

  return `${timeUnitValue} ${unitLabel}`;
};

/**
 * This function converts numeric seconds into a phrase
 * @param {number} seconds - a (positive or negative) time, represented as seconds
 * @returns {string} The time, represented as a phrase of hours, minutes, and seconds
 */
export const formatAsTimePhrase = (seconds) => {
  if (!isValidNumber(seconds)) return '';
  const positiveSeconds = Math.abs(seconds);
  const negative = positiveSeconds !== seconds;
  const secondsDateTime = new Date(0, 0, 0, 0, 0, positiveSeconds, 0);
  const timeParts = [
    secondsDateTime.getHours(),
    secondsDateTime.getMinutes(),
    secondsDateTime.getSeconds(),
  ];
  // NOTE: Everything above should be useable for the `formatTime` function.

  const timeString = timeParts
    // Convert non-0 values to a string of the value plus its unit
    .map(
      (timeUnitValue, index) =>
        timeUnitValue && toTimeUnitPhrase(timeUnitValue, index)
    )
    // Ignore/exclude any 0 values
    .filter((x) => x)
    // join into a single comma-separated string phrase
    .join(', ');

  // If the time was negative, assume it represents some remaining amount of time/"count down".
  const negativeSuffix = negative ? ' remaining' : '';

  return `${timeString}${negativeSuffix}`;
};

/**
 * Converts a time, in numeric seconds, to a formatted string representation of the form [HH:[MM:]]SS, where hours and minutes
 * are optional, either based on the value of `seconds` or (optionally) based on the value of `guide`.
 *
 * @param seconds - The total time you'd like formatted, in seconds
 * @param guide - A number in seconds that represents how many units you'd want to show. This ensures consistent formatting between e.g. 35s and 4834s.
 * @returns A string representation of the time, with expected units
 */
export function formatTime(seconds: number, guide?: number): string {
  // Handle negative values at the end
  let negative = false;

  if (seconds < 0) {
    negative = true;
    seconds = 0 - seconds;
  }

  seconds = seconds < 0 ? 0 : seconds;

  let s: number | string = Math.floor(seconds % 60);
  let m: number | string = Math.floor((seconds / 60) % 60);
  let h: number | string = Math.floor(seconds / 3600);
  const gm = Math.floor((guide / 60) % 60);
  const gh = Math.floor(guide / 3600);

  // handle invalid times
  if (isNaN(seconds) || seconds === Infinity) {
    // '-' is false for all relational operators (e.g. <, >=) so this setting
    // will add the minimum number of fields specified by the guide
    h = m = s = '0';
  }

  // Check if we need to show hours
  // @ts-ignore
  h = h > 0 || gh > 0 ? h + ':' : '';

  // If hours are showing, we may need to add a leading zero.
  // Always show at least one digit of minutes.
  // @ts-ignore
  m = ((h || gm >= 10) && m < 10 ? '0' + m : m) + ':';

  // Check if leading zero is need for seconds
  // @ts-ignore
  s = s < 10 ? '0' + s : s;

  return (negative ? '-' : '') + h + m + s;
}

export const emptyTimeRanges: TimeRanges = Object.freeze({
  length: 0,
  start(index) {
    const unsignedIdx = index >>> 0;
    if (unsignedIdx >= this.length) {
      throw new DOMException(
        `Failed to execute 'start' on 'TimeRanges': The index provided (${unsignedIdx}) is greater than or equal to the maximum bound (${this.length}).`
      );
    }
    return 0;
  },
  end(index) {
    const unsignedIdx = index >>> 0;
    if (unsignedIdx >= this.length) {
      throw new DOMException(
        `Failed to execute 'end' on 'TimeRanges': The index provided (${unsignedIdx}) is greater than or equal to the maximum bound (${this.length}).`
      );
    }
    return 0;
  },
});

/**
 */
export function serializeTimeRanges(
  timeRanges: TimeRanges = emptyTimeRanges
): string {
  return Array.from(timeRanges as any)
    .map((_, i) =>
      [
        Number(timeRanges.start(i).toFixed(3)),
        Number(timeRanges.end(i).toFixed(3)),
      ].join(':')
    )
    .join(' ');
}
