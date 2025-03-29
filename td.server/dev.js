import appFactory from './src/app.js';

const app = appFactory.create();

const server = app.listen(app.get('port'), function() {
    const address = server.address();
    if (address) {
        console.log('Development server listening at ' + address.address + ' on port ' + address.port);
    } else {
        console.log('Development server listening on port ' + app.get('port'));
    }
});

process.once('SIGUSR2', 
  function () { 
    process.kill(process.pid, 'SIGUSR2'); 
  }
);
