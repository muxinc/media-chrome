import fs from 'fs';
import { generateCustomData } from "cem-plugin-vs-code-custom-data-generator";

const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const { name, description, version, author, homepage, license } = packageData;

export default {
  globs: ['dist/media-*', 'dist/extras'],
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
    generateCustomData({
      outdir: 'dist',
      htmlFileName: 'vscode.html-data.json',
      cssFileName: 'vscode.css-data.json',
    })
  ],
};
