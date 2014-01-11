var http = require('http');

console.log('Serving http://localhost:8888/');

http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('Hello World');
    response.end();
}).listen(8888);

