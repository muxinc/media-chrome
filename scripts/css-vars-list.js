import fs from 'fs';

const manifest = JSON.parse(fs.readFileSync('./dist/custom-elements.json', 'utf-8'));

let allCssProps = new Set();
for (let cls of getClasses(manifest)) {
  for (let cssProp of cls.cssProperties ?? []) {
    allCssProps.add(cssProp.name);
  }
}

let sortedCssProps = [...allCssProps].sort();
for (let cssProp of sortedCssProps) {
  console.log(cssProp);
}

function getClasses(manifest) {
  let classes = [];
  for (let moduleDoc of manifest.modules) {
    classes.push(...moduleDoc.declarations.filter(d => d.kind === 'class'));
  }
  return classes;
}
