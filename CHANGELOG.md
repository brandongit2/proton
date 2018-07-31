# Changelog
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