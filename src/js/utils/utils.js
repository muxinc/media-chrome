
export function stringifyRenditionList(renditions) {
  return renditions
    ?.map(({ id, width, height }) => {
      return [id, width, height].filter(a => a != null).join(':')
    }).join(' ');
}

export function parseRenditionList(renditions) {
  return renditions
    ?.split(/\s+/)
    .map((group) => {
      const [id, width, height] = group.split(':');
      return { id, width, height };
    });
}

export function dashedToCamel(word) {
  return word
    .split('-')
    .map(function (x, i) {
      return (
        (i ? x[0].toUpperCase() : x[0].toLowerCase()) + x.slice(1).toLowerCase()
      );
    })
    .join('');
}

export function constToCamel(word, upperFirst = false) {
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

export function camelCase(name) {
  return name.replace(/[-_]([a-z])/g, ($0, $1) => $1.toUpperCase());
}

export function isValidNumber(x) {
  return typeof x === 'number' && !Number.isNaN(x) && Number.isFinite(x);
}

export function isNumericString(str) {
  if (typeof str != 'string') return false; // we only process strings!
  // @ts-ignore
  return !isNaN(str) && !isNaN(parseFloat(str));
}

/**
 * Returns a promise that will resolve after passed ms.
 * @param  {number} ms
 * @return {Promise}
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
