import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
const { dirname } = path;

const __filename = fileURLToPath(import.meta.url);
import { GlobalThis } from '../../dist/utils/server-safe-globals.js';
const __dirname = dirname(__filename);

// Notes about the current implementation of the React wrapper compiler:
// Currently relies on a build having already been generated.
// Outputs (uncompiled) ES Modules to the dist dir
// Does not currently support "extras" components

// REACT MODULE STRING CREATION CODE BEGIN
const clearAndUpper = (kebabText) => {
  return kebabText.replace(/-/, '').toUpperCase();
};

const toPascalCase = (kebabText) => {
  return kebabText.replace(/(^\w|-\w)/g, clearAndUpper);
};

const toImportsStr = ({ importPath }) => {
  return `import React from "react";
import { createComponent } from 'ce-la-react';
import * as Modules from "${importPath}"
`;
};

const toReactComponentStr = (config) => {
  const { elementName } = config;
  const ReactComponentName = toPascalCase(elementName);
  return `
export const ${ReactComponentName} = createComponent({
  tagName: "${elementName}",
  elementClass: Modules.${ReactComponentName},
  react: React,
});`;
};

const toCustomElementReactWrapperModule = (config) => {
  return `${toReactComponentStr(config)}`;
};
// TYPESCRIPT DECLARATION FILE STRING CREATION CODE BEGIN
const toTypeImportsAndGenericDefinitionsStr = ({importPath}) => {
  return `import { createComponent } from "ce-la-react";
import * as Modules from "${importPath}"
`;
};

const toDeclarationStr = (config) => {
  const { elementName } = config;
  const ReactComponentName = toPascalCase(elementName);
  return `export declare const ${ReactComponentName}: ReturnType<typeof createComponent<Modules.${ReactComponentName}>>;`;
};

const toCustomElementReactTypeDeclaration = (config) => {
 return `${toDeclarationStr(config)}`;
};
// TYPESCRIPT DECLARATION FILE STRING CREATION CODE END

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
          // Remove `-element` suffix for React modules
          const name = importPathObj.name.replace(/-element$/, '');

          const relativeDir = path.dirname(path.relative(distRoot, importPathAbs));
          const distReactRoot = path.join(distRoot, 'react', relativeDir);

          const modulePathAbs = path.format({
            dir: distReactRoot,
            name,
            ext: '.js',
          });
          const tsDeclPathAbs = path.format({
            dir: distReactRoot,
            name,
            ext: '.d.ts',
          });

          return import(importPath)
            .then((_) => {
              const customElementNames = getDefinedCustomElements();

              const undefinedCustomElementNames = customElementNames.filter(
                (name) => !alreadyDefinedCustomElementNames.includes(name)
              );

              const componentsWithExports = undefinedCustomElementNames.map(
                (elementName) => {
                  return toCustomElementReactWrapperModule({
                    elementName,
                  });
                }
              );

              fs.mkdirSync(path.dirname(modulePathAbs), { recursive: true });

              const importPathRelative = path.relative(distReactRoot, importPathAbs);
              const utilsBase = path.dirname(path.relative(importPathAbs, distRoot));
              const moduleStr = `${toImportsStr({
                importPath: importPathRelative,
                utilsBase
              })}\n${componentsWithExports.join('\n')}`;

              fs.writeFileSync(modulePathAbs, moduleStr);

              const declarationsWithExports = undefinedCustomElementNames.map(
                (elementName) => {
                  return toCustomElementReactTypeDeclaration({ elementName });
                }
              );

              const tsDeclStr = `${toTypeImportsAndGenericDefinitionsStr({
                importPath: importPathRelative})}\n${declarationsWithExports.join(
                '\n'
              )}`;

              fs.writeFileSync(tsDeclPathAbs, tsDeclStr);

              alreadyDefinedCustomElementNames = [...customElementNames];

              return {
                modulePath: modulePathAbs,
                moduleContents: moduleStr,
                tsDeclarationPath: tsDeclPathAbs,
                tsDeclarationContents: tsDeclStr,
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

    const distReactRoot = path.join(distRoot, 'react');

    fs.mkdirSync(distReactRoot, { recursive: true });

    const commonModulesDistPath = path.join(distReactRoot, 'common');
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
        const { modulePath } = moduleDef;
        console.log(
          'React module wrapper created!',
          'path (absolute):',
          modulePath
          // '\n',
          // 'contents:',
          // moduleContents
        );
      }
    } catch (err) {
      console.log('unexpected error generating module!', err);
    }

    console.log('module generation completed!');
  });
};

export { toCustomElementReactWrapperModule };
// BUILD END

// EXTERNALIZEABLE/CONFIG CODE BEGIN
const projectRoot = path.join(__dirname, '..', '..');
const distRoot = path.join(projectRoot, 'dist');
const entryPoints = [
  path.join(projectRoot, 'dist', 'index.js'),
  path.join(projectRoot, 'dist', 'menu', 'index.js'),
  path.join(projectRoot, 'dist', 'media-theme.js')
];
const setupGlobalsAsync = async () => {
  const globalThis = GlobalThis;
  globalThis.customElementNames = [];
  globalThis.customElements.define = (name, _classRef) =>
    globalThis.customElementNames.push(name);
  return globalThis.customElementNames;
};

createReactWrapperModules({ entryPoints, setupGlobalsAsync, distRoot });
// EXTERNALIZEABLE/CONFIG CODE END
