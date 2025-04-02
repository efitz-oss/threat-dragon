import appFactory from './src/app.js';

const app = appFactory.create();
const port = process.env.SERVER_API_PORT || process.env.PORT || 3000;

const server = app.listen(app.get('port'), function() {
    const address = server.address();
    if (address) {
        console.log('Express API server listening at ' + address.address + ' on port ' + address.port);
    } else {
        console.log('Express API server listening on port ' + app.get('port'));
    }
});

process.once('SIGUSR2', 
    function () { 
        process.kill(process.pid, 'SIGUSR2'); 
    }
);
