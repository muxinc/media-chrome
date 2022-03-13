import fs from 'fs';
import {
  getDeclarationInFile,
  hasIgnoreJSDoc,
  isCustomElementsDefineCall,
} from '@custom-elements-manifest/analyzer/src/utils/ast-helpers.js';
import { resolveModuleOrPackageSpecifier } from '@custom-elements-manifest/analyzer/src/utils/index.js';

export function camelCase(name) {
  return name.replace(/[-_]([a-z])/g, ($0, $1) => $1.toUpperCase());
}

const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const { name, description, version, author, homepage, license } = packageData;

export default {
  globs: ['src/js/media-*', 'src/js/extras'],
  outdir: 'dist',
  plugins: [
    // Append package data
    {
      name: 'mediachrome-package-data',
      packageLinkPhase({ customElementsManifest }) {
        customElementsManifest.package = {
          name,
          description,
          version,
          author,
          homepage,
          license,
        };
      },
    },
    defineCustomElementCallsPlugin(),
  ],
};

/**
 * defineCustomElementCalls
 * Adapted from https://github.com/open-wc/custom-elements-manifest/blob/master/packages/analyzer/src/features/analyse-phase/custom-elements-define-calls.js
 *
 * Analyzes calls for:
 * @example defineCustomElement()
 */
export function defineCustomElementCallsPlugin() {
  let counter;
  return {
    name: 'mediachrome-defineCustomElement',
    analyzePhase({ ts, node, moduleDoc, context }) {
      if (node?.kind === ts.SyntaxKind.SourceFile) {
        counter = 0;
      }

      if (hasIgnoreJSDoc(node)) return;

      /**
       * @example defineCustomElement('my-el', MyEl);
       */
      if (isDefineCustomElementCall(node, ts)) {
        const classArg = node.parent.arguments[1];
        // let isAnonymousClass = classArg?.kind === ts.SyntaxKind.ClassExpression;
        let isUnnamed = classArg?.name === undefined;

        // if (isAnonymousClass) {
        //   const klass = createClass(classArg, moduleDoc, context);

        //   if (isUnnamed) {
        //     klass.name = `anonymous_${counter}`;
        //   }
        //   moduleDoc.declarations.push(klass);
        // }

        let elementClass;

        /**
         * @example defineCustomElement('m-e', class extends HTMLElement{})
         *                                            ^
         */
        if (isUnnamed) {
          elementClass = `anonymous_${counter}`;
          counter = counter + 1;
        }

        /**
         * @example defineCustomElement('m-e', MyElement)
         *                                       ^^^^^^^^^
         */
        if (node?.parent?.arguments?.[1]?.text) {
          elementClass = node.parent.arguments[1].text;
        }

        /**
         * @example defineCustomElement('m-e', class MyElement extends HTMLElement{})
         *                                             ^^^^^^^^^
         */
        if (classArg?.name) {
          elementClass = classArg?.name?.getText();
        }

        const elementTag = node.parent.arguments[0].text;

        const klass = getDeclarationInFile(elementClass, node?.getSourceFile());

        if (hasIgnoreJSDoc(klass)) return;

        const definitionDoc = {
          kind: 'custom-element-definition',
          name: elementTag,
          declaration: {
            name: elementClass,
            ...resolveModuleOrPackageSpecifier(
              moduleDoc,
              context,
              elementClass
            ),
          },
        };

        moduleDoc.exports = [...(moduleDoc.exports || []), definitionDoc];
      }
    },
  };
}

/**
 * @example defineCustomElement('my-el', MyEl);
 */
const isDefineCustomElementCall = (node, ts) => {
  return node?.getText() === 'defineCustomElement' &&
    node?.parent?.kind === ts.SyntaxKind.CallExpression;
}
