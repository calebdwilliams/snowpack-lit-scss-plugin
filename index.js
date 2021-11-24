const { processString } = require('uglifycss');
const { dirname, join } = require('path');
const execa = require('execa');
const { readFileSync } = require('fs');

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
      const args = ['--stdin', '--load-path', dirname(filePath), '--load-path', join(process.cwd(), 'node_modules')];

      let { stdout, stderr } = await execa('sass', args, options);

      if (stderr) {
        console.log(stderr);
      }

      if (!isDev) {
        stdout = processString(stdout, {});
      }

      if (/\.lit\.scss$/.exec(filePath)) {
        return `import {css} from 'lit';export default css${stringToTemplateLiteral(stdout)};`
      } else {
        return `const style=document.createElement('style');style.innerHTML=${stringToTemplateLiteral(stdout)};document.head.appendChild(style);export default null;`;
      }
    }
  };
};
