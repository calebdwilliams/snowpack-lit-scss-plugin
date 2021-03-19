const { renderSync } = require('sass');
const { processString } = require('uglifycss');
const { join, dirname } = require('path');
const sassImporter = require('sass-module-importer');
const execa = require('execa');
const { readFileSync } = require('fs');

const importer = sassImporter();
const includePaths = ['./node_modules', join(process.cwd(), 'node_modules')];

const illegalChars = new Map();
illegalChars.set('\\', '\\\\');
illegalChars.set('`', '\\`');
illegalChars.set('$', '\\$');
function stringToTemplateLiteral(s) {
  if (!s) {
    return '``';
  }
  let res = '';
  for (let i = 0; i < s.length; i++) {
    const c = s.charAt(i);
    res += illegalChars.get(c) || c;
  }
  return `\`${res}\``;
}

module.exports = function () {
  return {
    name: 'snowpack-lit-scss-plugin',
    resolve: {
      input: ['.scss', '.sass'],
      output: ['.js']
    },
    async load({ filePath, isDev }) {
      const input = readFileSync(filePath, 'utf-8');
      const options = { input, preferLocal: true };
      const args = ['--stdin', '--load-path', dirname(filePath)];

      let { stdout, stderr } = await execa('sass', args, options);

      if (stderr) {
        throw stderr;
      }

      if (!isDev) {
        stdout = processString(stdout, {});
      }

      if (/\.lit\.scss$/.exec(filePath)) {
          return  `import { css } from 'lit-element'; export default css${stringToTemplateLiteral(stdout)};`
      } else {
          return `const style = document.createElement('style'); style.innerHTML = ${stringToTemplateLiteral(stdout)}; document.head.appendChild(style);`;
      }
    }
  };
};
