const { renderSync } = require('sass');
const { processString } = require('uglifycss');
const { join } = require('path');
const sassImporter = require('node-sass-importer');

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
      let data = renderSync({
        file: filePath,
        importer,
        includePaths
      }).css.toString();

      if (!isDev) {
        data = processString(data, {});
      }

      if (/\.lit\.scss$/.exec(filePath)) {
          return  `import { css } from 'lit-element'; export default css${stringToTemplateLiteral(data)};`
      } else {
          return `const style = document.createElement('style'); style.innerHTML = ${stringToTemplateLiteral(data)}; document.head.appendChild(style);`;
      }
    }
  };
};
