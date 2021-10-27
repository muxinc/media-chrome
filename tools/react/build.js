import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
const { dirname } = path;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// REACT MODULE STRING CREATION CODE BEGIN
const toPascalCase = (kebabText) => {
  return kebabText.replace(/(^\w|-\w)/g, clearAndUpper);
};

const clearAndUpper = (kebabText) => {
  return kebabText.replace(/-/, '').toUpperCase();
};

const toImportsStr = ({ importPath }) => {
  return `import React from "react";
import "${importPath}";
import { toNativeProps } from "./common/utils";`;
};

// const toReactComponentJSXStr = (config) => {
//   const { elementName } = config;
//   const ReactComponentName = toPascalCase(elementName);
//   return `const ${ReactComponentName} = ({ children, ...props }) => {
//   return (
//     <${elementName} {...toNativeProps(props)}>{children}</${elementName}>
//   );
// };`;
// };

const toReactComponentStr = (config) => {
  const { elementName } = config;
  const ReactComponentName = toPascalCase(elementName);
  return `const ${ReactComponentName} = ({ children, ...props }) => {
  return React.createElement('${elementName}', toNativeProps(props), children);
};`;
};

const toExportsStr = (config) => {
  const { elementName } = config;
  const ReactComponentName = toPascalCase(elementName);
  return `export { ${ReactComponentName} };`;
};

const toCustomElementReactWrapperModule = (config) => {
  const moduleStr = `${toReactComponentStr(config)}

${toExportsStr(config)}
`;

  return moduleStr;
};
// REACT MODULE STRING CREATION CODE END

// BUILD BEGIN

const entryPointsToReactModulesIterable = (
  entryPoints,
  { getDefinedCustomElements, distRoot }
) => {
  let alreadyDefinedCustomElementNames = [];
  return {
    [Symbol.asyncIterator]() {
      return {
        i: 0,
        next() {
          const { i } = this;
          if (i >= entryPoints.length) return Promise.resolve({ done: true });

          const importPath = entryPoints[i];
          const importPathAbs = require.resolve(importPath);
          const importPathObj = path.parse(importPathAbs);
          const modulePathAbs = path.format({
            dir: distRoot,
            name: importPathObj.name,
            ext: '.js',
          });

          const importPathRelative = path.relative(distRoot, importPathAbs);
          return import(importPath)
            .then((_) => {
              const customElementNames = getDefinedCustomElements();
              const componentsWithExports = customElementNames
                .filter(
                  (name) => !alreadyDefinedCustomElementNames.includes(name)
                )
                .map((elementName) => {
                  return toCustomElementReactWrapperModule({
                    elementName,
                  });
                });

              const moduleStr = `${toImportsStr({
                importPath: importPathRelative,
              })}\n\n${componentsWithExports.join('\n')}`;

              fs.writeFileSync(modulePathAbs, moduleStr);
              alreadyDefinedCustomElementNames = customElementNames;
              return {
                modulePath: modulePathAbs,
                moduleContents: moduleStr,
              };
            })
            .then((moduleDef) => {
              this.i++;
              return { value: moduleDef, done: false };
            })
            .catch((err) => {
              return Promise.reject({ value: err });
            });
        },
      };
    },
  };
};

const createReactWrapperModules = async ({
  entryPoints,
  setupGlobalsAsync,
  distRoot = './',
  commonModulesSrcRoot = path.join(__dirname, 'common'),
}) => {
  return setupGlobalsAsync().then(async (customElementNames) => {
    if (!entryPoints?.length) {
      console.error('no entrypoints! bailing');
      return;
    }

    fs.mkdirSync(distRoot, { recursive: true });

    const commonModulesDistPath = path.join(distRoot, 'common');
    fs.mkdirSync(commonModulesDistPath, { recursive: true });
    fs.readdirSync(commonModulesSrcRoot, { withFileTypes: true }).forEach(
      (dirEntryObj) => {
        const { name } = dirEntryObj;
        fs.copyFileSync(
          path.format({ name, dir: commonModulesSrcRoot }),
          path.format({ name, dir: commonModulesDistPath })
        );
      }
    );

    const moduleCreateAsyncIterable = entryPointsToReactModulesIterable(
      entryPoints,
      { getDefinedCustomElements: () => customElementNames, distRoot }
    );

    try {
      for await (let moduleDef of moduleCreateAsyncIterable) {
        const { modulePath, moduleContents } = moduleDef;
        console.log(
          'React module wrapper created!',
          'path (absolute):',
          modulePath,
          '\n',
          'contents:',
          moduleContents
        );
      }
    } catch (err) {
      console.log('unexpected error generating module!', err);
    }

    console.log('\n\n\n', 'module generation completed!');
  });
};

export { toCustomElementReactWrapperModule };
// BUILD END

// EXTERNALIZEABLE/CONFIG CODE BEGIN
const projectRoot = path.join(__dirname, '..', '..');
const distRoot = path.join(projectRoot, 'dist', 'react');
const entryPoints = [path.join(projectRoot, 'dist', 'index.js')];
const setupGlobalsAsync = async () => {
  const customElementNames = await import(
    path.join(projectRoot, 'dist', 'utils', 'server-safe-globals.js')
  ).then((exports) => {
    globalThis.window = exports.Window;
    globalThis.document = exports.Document;
    globalThis.window.document = globalThis.document;
    window.customElementNames = [];
    window.customElements.define = (name, _classRef) =>
      window.customElementNames.push(name);
    // NOTE: The current implementation relies on the fact that `customElementNames` will be mutated
    // to add the Custom Element html name for every element that's defined as a result of loading/importing the entryPoints modules (CJP).
    return window.customElementNames;
  });
  return customElementNames;
};

createReactWrapperModules({ entryPoints, setupGlobalsAsync, distRoot });
// EXTERNALIZEABLE/CONFIG CODE END
