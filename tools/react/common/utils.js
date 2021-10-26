const ReactPropToAttrNameMap = {
    className: 'class',
    classname: 'class',
    htmlFor: 'for',
    crossOrigin: 'crossorigin',
};

export const toNativeAttrName = (propName, propValue) => {
  if (ReactPropToAttrNameMap[propName]) return ReactPropToAttrNameMap[propName];
  if (typeof propValue == undefined) return undefined;
  if (typeof propValue === "boolean" && !propValue) return undefined;
  return propName;
};

export const toStyleCssString = (styleObj) => {
  return Object.entries(styleObj)
    .map(
      ([k, v]) =>
        `${k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}:${v}`
    )
    .join(";");
};

export const toNativeAttrValue = (propValue, propName) => {
  if (typeof propValue === "boolean") return "";
  if (propName === "style" && typeof propValue === "object")
    return toStyleCssString(propValue);
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
