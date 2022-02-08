const ReactPropToAttrNameMap = {
  className: 'class',
  classname: 'class',
  htmlFor: 'for',
  crossOrigin: 'crossorigin',
  viewBox: 'viewBox',
};

// const toKebabCase = (string) =>
//   string
//     .replace(/([a-z])([A-Z])/g, '$1-$2')
//     .replace(/[\s_]+/g, '-')
//     .toLowerCase();
const toKebabCase = (string) =>
  string.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

export const toNativeAttrName = (propName, propValue) => {
  if (ReactPropToAttrNameMap[propName]) return ReactPropToAttrNameMap[propName];
  if (typeof propValue == undefined) return undefined;
  if (typeof propValue === 'boolean' && !propValue) return undefined;
  if (/[A-Z]/.test(propName)) return toKebabCase(propName);
  return propName;
};

export const toStyleCssString = (styleObj) => {
  return (
    Object.entries(styleObj)
      /** @TODO Evaluate special key/values (e.g. add px to well-defined sizing styles?) (CJP) */
      .map(([k, v]) => `${toKebabCase(k)}:${v}`)
      .join(';')
  );
};

export const isMaybeBrowser = () => typeof window != 'undefined';
export const isMaybeServer = () => typeof global != 'undefined';

// NOTE: Next.js expects us to still provide CSS objects, even to native elements (CJP).
export const toStyleAttr =
  isMaybeBrowser() && !isMaybeServer() ? toStyleCssString : (x) => x;

export const toNativeAttrValue = (propValue, propName) => {
  if (typeof propValue === 'boolean') return '';
  if (propName === 'style' && typeof propValue === 'object')
    return toStyleAttr(propValue);
  return propValue;
};

export const toNativeProps = (props = {}) => {
  return Object.entries(props).reduce(
    (transformedProps, [propName, propValue]) => {
      const attrName = toNativeAttrName(propName, propValue);

      // prop was stripped. Don't add.
      if (!attrName) {
        return transformedProps;
      }

      const attrValue = toNativeAttrValue(propValue, propName);
      transformedProps[attrName] = attrValue;
      return transformedProps;
    },
    {}
  );
};
