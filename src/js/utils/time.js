// Consider moving this to a more generic utils module
const isValidNumber = x => typeof x === 'number' && !Number.isNaN(x) && Number.isFinite(x);

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
  }
];
const toTimeUnitPhrase = (timeUnitValue, unitIndex) => {
  const unitLabel = timeUnitValue === 1
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
  const timeParts = [secondsDateTime.getHours(), secondsDateTime.getMinutes(), secondsDateTime.getSeconds()];
  // NOTE: Everything above should be useable for the `formatTime` function.

  const timeString = timeParts
    // Convert non-0 values to a string of the value plus its unit
    .map((timeUnitValue, index) => timeUnitValue && toTimeUnitPhrase(timeUnitValue, index))
    // Ignore/exclude any 0 values
    .filter(x => x)
    // join into a single comma-separated string phrase
    .join(', ');

  // If the time was negative, assume it represents some remaining amount of time/"count down".
  const negativeSuffix = negative ? ' remaining' : '';

  return `${timeString}${negativeSuffix}`;
};

export function formatTime(seconds, guide) {
  // Handle negative values at the end
  let negative = false;

  if (seconds < 0) {
    negative = true;
    seconds = 0 - seconds;
  }

  seconds = seconds < 0 ? 0 : seconds;
  let s = Math.floor(seconds % 60);
  let m = Math.floor((seconds / 60) % 60);
  let h = Math.floor(seconds / 3600);
  const gm = Math.floor((guide / 60) % 60);
  const gh = Math.floor(guide / 3600);

  // handle invalid times
  if (isNaN(seconds) || seconds === Infinity) {
    // '-' is false for all relational operators (e.g. <, >=) so this setting
    // will add the minimum number of fields specified by the guide
    h = m = s = '-';
  }

  // Check if we need to show hours
  h = h > 0 || gh > 0 ? h + ':' : '';

  // If hours are showing, we may need to add a leading zero.
  // Always show at least one digit of minutes.
  m = ((h || gm >= 10) && m < 10 ? '0' + m : m) + ':';

  // Check if leading zero is need for seconds
  s = s < 10 ? '0' + s : s;

  return (negative ? '-' : '') + h + m + s;
}
