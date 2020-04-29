const http = require('http');
const debug = require("debug")("node-angular");

const app = require('./app');

const normalizePort = (val) => {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}


const onError = (error) => {
    if(error.syscall !== 'listen'){
        throw error;
    }
}

const onListening = () => {
    const addr = server.address();
    const bind = typeof port === 'string' ? 'pipe' +port : 'port'+port;
    debug('Listening on ' +bind)
}

const port = normalizePort(process.env.PORT || '3000');

app.set('port', port); // Set Configuration and let knowing express about the port
const server = http.createServer(app)


server.on('error', onError);
server.on('listening', onListening)
server.listen(port);// Node JS server listen port