module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "globals": {
        vue: true,
        wx: true
      },
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module",
        "allowImportExportEverywhere": false,
        "codeFrame": false,
        "ecmaVersion": 6,
        "ecmaFeatures": {
          "experimentalObjectRestSpread": true
        }
    },
    plugins: [
        "vuefix",
        "babel",
        "prefer-object-spread"
    ],
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "strict": 0,
        "prefer-object-spread/prefer-object-spread": 2
    }
}