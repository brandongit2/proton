const commander = require('commander');
const express = require('express');
const http = require('http');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

commander
    .version('0.0.1', '-v, --version')
    .option('-w, --watch', 'watch for file changes.')
    .option('-s, --server', 'Start a local server.')
    .option('-d, --dev', 'Run in development mode.')
    .option('-p, --prod', 'Run in production mode.')
    .option('--port [port]', 'Run server on this port. Used in conjunction with the -s flag.')
    .parse(process.argv);

if (commander.port) {
    if (typeof commander.port != 'number') {
        throw new Error('Please enter a number for the port.');
    } else if (!commander.port.isInteger()) {
        throw new Error('Please enter an integer for the port.');
    }
}
if (!commander.port) {
    commander.port = 2000;
}

let config = require(`./webpack.${commander.prod ? 'prod' : 'dev'}.js`);
if (commander.watch) {
    config = merge(config, {
        entry: ['webpack-hot-middleware/client'],
        watch: true,
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    });
}

const compiler = webpack(config);

if (commander.server) {
    const app = express();

    app.use(require('webpack-dev-middleware')(compiler, {publicPath: '/'}));
    if (commander.watch) {
        app.use(require('webpack-hot-middleware')(compiler));
    }

    app.use('/testfiles', express.static(path.join(__dirname, 'src/testfiles')));

    const server = http.createServer(app);
    server.listen(commander.port, () => {
        console.log(`Server listening on port ${commander.port}`);
    });
}
