import fs from 'fs';

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
  ],
};
