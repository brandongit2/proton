import * as express from 'express';
import * as http from 'http';
import * as path from 'path';

const app = express();
const server = http.createServer(app);

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
