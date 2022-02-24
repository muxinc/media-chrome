const ReactPropToAttrNameMap = {
  className: 'class',
  classname: 'class',
  htmlFor: 'for',
  crossOrigin: 'crossorigin',
  viewBox: 'viewBox',
};

export const toKebabCase = (string) =>
  string.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

export const toNativeAttrName = (propName, propValue) => {
  if (ReactPropToAttrNameMap[propName]) return ReactPropToAttrNameMap[propName];
  if (typeof propValue == undefined) return undefined;
  if (typeof propValue === 'boolean' && !propValue) return undefined;
  if (/[A-Z]/.test(propName)) return toKebabCase(propName);
  return propName;
};

export const toNativeAttrValue = (propValue, _propName) => {
  if (typeof propValue === 'boolean') return '';
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
