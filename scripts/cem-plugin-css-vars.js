
export function generateCssVars() {

  const cssPropertyDefaults = {};

  return {
    name: 'css-var-defaults',
    analyzePhase({ ts, node, moduleDoc }) {

      switch (node.kind) {
        case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
        case ts.SyntaxKind.TemplateExpression: {

          if (!cssPropertyDefaults[moduleDoc.path]) {
            cssPropertyDefaults[moduleDoc.path] = {};
          }

          const text = node.getFullText();
          if (text.includes('var(--')) {
            const matches = matchRecursive(text, /var\(/);
            matches.forEach(m => {
              const splitted = m.split(',');
              const cssProp = splitted[0].trim();
              const cssDefault = splitted.slice(1).join(',').trim();

              // Filter out CSS vars like --${this.localName}-display
              if (/^[\w-]+$/.test(cssProp)) {
                cssPropertyDefaults[moduleDoc.path][cssProp] = cssDefault;
              }
            });
          }
          break;
        }
      }
    },
    moduleLinkPhase({ moduleDoc }) {
      const classDeclaration = moduleDoc.declarations.find(d => d.kind === 'class');
      const cssDefaults = cssPropertyDefaults[moduleDoc.path];

      for (let prop of classDeclaration.cssProperties ?? []) {
        if (!prop.default && cssDefaults[prop.name]) {
          prop.default = cssDefaults[prop.name];
        }
      }
    },
  };
}

function matchRecursive(s, prefix, startChar = '(', endChar = ')') {
  let m;
  let start = 0;
  let input = s;
  let matches = [];

  while ((m = (input = s.slice(start)).match(prefix)) != null) {
    let endOffset = m.index + m[0].length;
    let counter = 1;
    let skipUntil = '';
    let i = endOffset;

    for (; i < input.length; i++) {
      let c = input[i];
      if (counter === 0) {
        break;
      }

      if (c === skipUntil) {
        skipUntil = '';
      } else if (c === '"') {
        skipUntil = '"';
      } else if (c === "'") {
        skipUntil = "'";
      } else if (c === startChar) {
        counter++;
      } else if (c === endChar) {
        counter--;
      }
    }

    if (counter === 0) {
      matches.push(input.slice(endOffset, i - 1));
    }

    start += endOffset;
  }

  return matches;
}
