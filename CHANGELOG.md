# Changelog
## Click [here][unreleased] for unreleased diff
##  [0.0.2][v0.0.2]
###  Added
- A `build` script. Execute using the command `node build` in the project root. Has several arguments; use the `-h` flag to see them.
    - Also accessible through the `npm start` command.
    - Uses `webpack-dev-middleware` and `webpack-hot-middleware`
- A new Express server which serves a directory called `testfiles` in addition to the Webpack output.
    - In this commit, running `node build -sw` and navigating to `localhost:2000/testfiles/graphing.json` will show you the contents of `src/testfiles/graphing.json`.
### Removed
- The `npm run dev` and `npm run prod` commands, due to lack of configurability.
### Developer notes
In order for hot module replacement to work for your dependencies, you will need to use the `module.hot.accept()` command in the code. See [this link](https://survivejs.com/webpack/appendices/hmr/) for details on how to do this.
Also note that `if (module.hot) {}` blocks are automatically removed during production builds.
## 0.0.1
### Added
- Build system
    - Uses NPM as package manager.
    - Uses Webpack as builder.
    - Uses Typescript as JavaScript replacement.
    - Set up linters (ESLint, ).
    - React support.
    - Other libraries used:
        - PostCSS
        - UglifyJS
        - Express
    - Use `npm start` or `npm run dev` to start the build process, along with watching. Also starts a server. Only use for development.
    - Use `npm run prod` to build for production. Creates a `build/` directory for built files. Otherwise essentially the same as `npm run dev` except it builds slower and runs faster.

[v0.0.2]: https://github.com/brandongit2/math/compare/v0.0.1...v0.0.2
[unreleased]: https://github.com/brandongit2/math/compare/v0.0.1...HEAD