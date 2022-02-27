# snowpack-lit-scss-plugin

This package is a simple Snowpack plugin to load SCSS as JavaScript modules for use with LitElement. Any file with the `.lit.scss` extension will be compiled and loaded using Lit's `css` tagged template literal. Any other `.scss` files will be added to the document head.

## Install

```shell
npm i snowpack-lit-scss-plugin
```

## Usage

Create a .lit.scss file:

```scss
/* my-element.lit.scss */

$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```

Then import it and use it in your element.

JavaScript:

```javascript
/* my-element.js */

import {LitElement, html} from 'lit';
import styles from './my-element.lit.scss';

class MyElement extends LitElement {
  static styles = styles;
  /* ... */
}
customElements.define('my-element', MyElement);
```

TypeScript:

```typescript
/* my-element.ts */

import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import styles from './my-element.lit.scss';

@customElement('my-element')
class MyElement extends LitElement {
  static styles = styles;
  /* ... */
}
```

It's customary to give the same name to your styles file and your element (e.g. `my-element.lit.scss` for `my-element.js`) but it's not required, especially if you use the same style file for multiple elements.

The `styles` property of a LitElement can also be an array, e.g. (in JavaScript) :

```javascript
import {LitElement, html, css} from 'lit';
import commonStyles from './common.lit.scss';

class MyElement extends LitElement {
  static styles = [commonStyles, css`/* more styles */`];
  /* ... */
}
customElements.define('my-element', MyElement);
```
