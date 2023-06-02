
const iconSets = {};

export function registerIcons(name, options) {
  iconSets[name] = options;
}

export function getIcons(name) {
  return iconSets[name];
}
