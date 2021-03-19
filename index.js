const { renderSync } = require('sass');
const importer = require('node-sass-importer');

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
      const data = renderSync({
        file: filePath,
        importer
      }).css.toString();

      // TODO: minify output
      if (!isDev) {}

      if (/\.lit\.scss$/.exec(filePath)) {
          return  `import { css } from 'lit-element'; export default css${stringToTemplateLiteral(data)};`
      } else {
          return `const style = document.createElement('style'); style.innerHTML = ${stringToTemplateLiteral(data)}; document.head.appendChild(style);`;
      }
    }
  };
};
