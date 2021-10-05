# snowpack-custom-headers

Allow snowpack to serve a custom set of headers during development

### Usage

First install the package `npm i https://github.com/samueljseay/snowpack-custom-headers -D` or with yarn `yarn add https://github.com/samueljseay/snowpack-custom-headers --dev`

```javascript
// in snowpack.config.mjs
export default {
  devOptions: {
    // You'll need to disable the auto-open functionality, the plugin will open the right page
    open: "none",
  },

  plugins: [
    [
      "snowpack-custom-headers",
      {
        headers: {
          // This is just an example, add any headers you need here.
          "Cross-Origin-Opener-Policy": "same-origin",
          "Cross-Origin-Embedder-Policy": "require-corp",
        },
      },
    ],
  ],
};
```

### Caveats

Note that right now it will serve the same headers for all requests. If you need specific headers per-resource then
please submit a PR.
