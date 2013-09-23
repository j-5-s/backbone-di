var static = require('node-static');

//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('./public', {headers: {"Access-Control-Allow-Origin":"*"}});
console.log('Static server listing on port 8080 -> http://localhost:8080');
require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(8080);