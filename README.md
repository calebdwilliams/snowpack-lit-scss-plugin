# snowpack-lit-scss-plugin

This package is a simple Snowpack plugin to load SCSS as JavaScript modules for use with LitElement. Any file with the `.lit.scss` extension will be compiled and loaded using Lit's `css` tagged template literal. Any other `.scss` files will be added to the document head.

### Plugin Options

```
compileScssAsModule: Boolean (default = false)
```
When enabled, the compiled .scss files will export a default no-op value in order to make them importable from other modules or components
