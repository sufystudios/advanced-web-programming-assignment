"use strict";
var http = require("http"); // import http core modules
var url = require("url"); // import url core modules


var server = function(route,handle) {
   http.createServer( function (request, response) {
     

     route(url.parse(request.url).pathname,handle,response,request);


   }).listen(41091);
}
module.exports=server;
