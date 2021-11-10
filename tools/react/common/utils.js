const ReactPropToAttrNameMap = {
  className: 'class',
  classname: 'class',
  htmlFor: 'for',
  crossOrigin: 'crossorigin',
};

export const toNativeAttrName = (propName, propValue) => {
  if (ReactPropToAttrNameMap[propName]) return ReactPropToAttrNameMap[propName];
  if (typeof propValue == undefined) return undefined;
  if (typeof propValue === 'boolean' && !propValue) return undefined;
  return propName;
};

export const toStyleCssString = (styleObj) => {
  return Object.entries(styleObj)
    .map(
      ([k, v]) =>
        `${k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}:${v}`
    )
    .join(';');
};

export const isMaybeBrowser = () => typeof window != undefined;
export const isMaybeServer = () => typeof global != undefined;

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
