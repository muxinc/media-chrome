import { readFile } from 'fs/promises';
import path from 'path';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';

export async function getImportedUrls(
  filePath,
  parentDir,
  importedUrls = new Set(),
  visitedFiles = new Set()
) {
  const absolutePath = path.resolve(filePath);
  const dir = path.dirname(absolutePath);

  if (visitedFiles.has(absolutePath)) {
    return importedUrls;
  }

  visitedFiles.add(absolutePath);
  importedUrls.add(path.relative(parentDir, absolutePath))

  const content = await readFile(absolutePath, 'utf-8');
  const ast = acorn.parse(content, { sourceType: 'module', ecmaVersion: 2022 });

  let promises = [];

  // Handle recursively
  walk.ancestor(ast, {
    ImportDeclaration(node) {
      const absoluteImportPath = path.resolve(dir, node.source.value);
      promises.push(
        getImportedUrls(absoluteImportPath, parentDir, importedUrls, visitedFiles)
      );
    },
  });

  await Promise.all(promises);

  return importedUrls;
}
