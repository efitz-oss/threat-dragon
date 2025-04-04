import appFactory from './src/app.js';

const app = appFactory.create();
const tdServerPort = process.env.SERVER_API_PORT || process.env.PORT || 3000;

const server = app.listen(tdServerPort, function () {
    const address = server.address();
    if (address) {
        console.log(
            'Express API server listening at ' + address.address + ' on port ' + address.port
        );
    } else {
        console.log('Express API server listening on port ' + tdServerPort);
    }
});

process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGUSR2');
});
