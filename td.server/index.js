import appFactory from './dist/app.js';

const app = appFactory.create();

const server = app.listen(app.get('port'), function() {
    const address = server.address();
    if (address) {
        console.log('Express server listening at ' + address.address + ' on port ' + address.port);
    } else {
        console.log('Express server listening on port ' + app.get('port'));
    }
});
