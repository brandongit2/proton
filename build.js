const commander = require('commander');
const express = require('express');
const http = require('http');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

commander
    .version('0.0.1', '-v, --version')
    .option('-w, --watch', 'Watch for file changes.')
    .option('-s, --server', 'Start a local server.')
    .option('-d, --dev', 'Run in development mode.')
    .option('-p, --prod', 'Run in production mode.')
    .option('--port [port]', 'Run server on this port. Used in conjunction with the -s flag.')
    .parse(process.argv);

if (commander.port) {
    try {
        commander.port = parseInt(commander.port);
    } catch (e) {
        throw new Error('Please enter a number for the port.');
    }
} else {
    commander.port = 2000;
}

if (!commander.prod) commander.dev = true;

let config = require(`./webpack.${commander.prod ? 'prod' : 'dev'}.js`);
if (commander.watch) {
    config = merge(config, {
        entry:   ['webpack-hot-middleware/client'],
        watch:   true,
        plugins: [new webpack.HotModuleReplacementPlugin()]
    });
}

console.log(require('util').inspect(config, {depth: Infinity}));
const compiler = webpack(config);

if (commander.prod) {
    compiler.run((err, stats) => {
        console.log(stats.toString({colors: true}));
    });
}

if (commander.server) {
    const app = express();

    if (commander.dev) {
        app.use(require('webpack-dev-middleware')(compiler, {
            publicPath: '/',
            stats:      {
                colors: true
            }
        }));

        if (commander.watch) {
            app.use(require('webpack-hot-middleware')(compiler));
        }
    } else {
        app.use('/', express.static(path.resolve(__dirname, 'build')));
    }

    app.use('/workspaces', express.static(path.resolve(__dirname, 'src/workspaces')));

    const server = http.createServer(app);
    server.listen(commander.port, '0.0.0.0', () => {
        console.log(`Server listening on port ${commander.port}`);
    });
}
