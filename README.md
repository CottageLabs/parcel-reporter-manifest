# @cottagelabs/parcel-reporter-manifest

A build manifest generator for [Parcel](https://v2.parceljs.org/).

This Parcel [Reporter plugin](https://v2.parceljs.org/plugin-system/reporter/) records the mapping between targets and
their output files for consumption by your backend web framework. You can use it to integrate Parcel-produced bundle
files into a traditional (non-SPA) web application.

It can be used for the same purpose as [webpack-bundle-tracker](https://www.npmjs.com/package/webpack-bundle-tracker),
but does not provide a compatible output.


## Usage

Add as a dependency:

```shell
$ npm install save @cottagelabs/parcel-reporter-manifest --save
```

Add to your `.parcelrc`, e.g.:

```json
{
  "extends": "@parcel/config-default",
  "reporters": ["...", "@cottagelabs/parcel-reporter-manifest"]
}
```

Optionally, configure the filename to save to in your `package.json`:

```json
{
  "parcel-reporter-manifest": {
    "file": "parcel-manifest.json"
  }
}
```

The default output file is `parcel-manifest.json`.


## Output

The generated manifest will look like this in the case of a [build
success](https://v2.parceljs.org/plugin-system/reporter/#build-success):
```json
{
  "status": "done",
  "distPath": "/path/to/your-app/dist",
  "bundles": [
    {
      "name": "app",
      "type": "js",
      "path": "app.js",
      "size": 19755
    },
    {
      "name": "app",
      "type": "css",
      "path": "app.css",
      "size": 71
    },
    {
      "name": "component",
      "type": "js",
      "path": "component.js",
      "size": 19646
    }
  ]
}
```

If you have used a rewriter plugin, the paths will be the rewritten paths.

In the case of a [build failure](https://v2.parceljs.org/plugin-system/reporter/#build-failure), your manifest could
look like this:

```json
{
  "status": "error",
  "distPath": "/path/to/your-app/dist",
  "error": [
    {
      "message": "Unexpected eof",
      "codeFrames": [
        {
          "filePath": "/path/to/your-app/src/app.js",
          "codeHighlights": [
            {
              "message": null,
              "start": {
                "line": 3,
                "column": 2
              },
              "end": {
                "line": 3,
                "column": 1
              }
            }
          ]
        }
      ],
      "hints": null,
      "origin": "@parcel/transformer-js"
    }
  ]
}
```

The `error` key contains an array of serialized [Diagnostic](https://v2.parceljs.org/plugin-system/logging/#Diagnostic)
objects.


# Acknowledgements

This plugin takes inspiration and borrows from ol-loginov's
[parcel-reporter-entries](https://github.com/ol-loginov/parcel-reporter-entries), released under the ISC license.