import * as child_process from 'child_process';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as yargs from 'yargs';

const argv = yargs.argv;
const exec = child_process.exec;
const app = express();
const server = http.createServer(app);

if (argv.dev) {
    process.env.NODE_ENV = 'development';
} else {
    process.env.NODE_ENV = 'production';
}

const outFromChildProcess = (error: any, stdout: any, stderr: any) => {
    console.log(stdout);
    console.log(stderr);
    if (error != null) {
        console.log('exec error: ' + error);
    }
};

const runBuild = () => {
    exec('gulp build', {env: { FORCE_COLOR: true }}, outFromChildProcess);
};

const runWatch = () => {
    exec('gulp watch', {env: { FORCE_COLOR: true }}, outFromChildProcess);
};

const displayHeading = (text: string) => {
    let captializedText = text.toUpperCase();

    return (`--- ${captializedText} ---`);
};

// BUILD CONTENT
console.log(displayHeading('Running Build'));
runBuild();

// SERVE CONTENT
console.log(displayHeading('Serving Content'));

app.use(express.static(path.join(__dirname, 'build')));

app.use('/', (req, res) => {
    res.sendFile(__dirname + '/build/index.html');
});

app.use((req, res) => {
    res.status(404);
});

server.listen(2000, () => {
    console.log('Listening on *:2000');
});

// WATCH FOR CHANGES
console.log(displayHeading('Running Watch'));
runWatch();
