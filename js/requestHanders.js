"use strict";
var exec = require("child_process").exec;
var weather = require('./weather.js');
var fs = require('fs');
var url = require('url');
var req = require('request');
var username = "*";
var password = "*";
var weatherobj = weather.weather;
//weatherobj.initialize();


var reqSubmit = function(request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/javascript'
  });
  var query = (url.parse(request.url, true).query);
  weatherobj.initialize(query, response);

}
var reqStart = function(request, response) {
  console.log("in handle");
  //weatherobj.print();
  var query = (url.parse(request.url, true).query);


  fs.readFile("./html/index.html", function(err, data) {

    response.writeHead(200, {
      'Content-Type': 'text/html'
    });
    response.write(data);
    response.end();
  });


}
var clientJS = function(request, response) {
  fs.readFile("./js/client.js", function(err, data) {
    response.writeHead(200, {
      'Content-Type': 'text/javascript'
    });
    response.write(data);
    response.end();
  });


}

var getData = function(request, response) {
  req({
      url: 2007

    },
    function(error, data, body) {
      response.writeHead(200, {
        'Content-Type': 'text/xml'
      });
      response.write(body);
      response.end();
    });
  // Do more stuff with 'body' here
}


var style = function(request, response) {
  fs.readFile("./css/style.css", function(err, data) {
    response.writeHead(200, {
      'Content-Type': 'text/css'
    });
    response.write(data);
    response.end();
  });


}

var reqXHTML = function(request, response) {



  var rs = fs.createReadStream("./images/ln_validated.gif");
  rs.on('error', function(err) {
    response.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    response.write("error");
    response.end();
    return;
  });
  rs.pipe(response);





}
var loading = function(request, response) {



  var rs = fs.createReadStream("./images/spinner.gif");
  rs.on('error', function(err) {
    response.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    response.write("error");
    response.end();
    return;
  });
  rs.pipe(response);





}
var reqVCSS = function(request, response) {



  var rs = fs.createReadStream("./images/vcss.gif");
  rs.on('error', function(err) {
    response.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    response.write("error");
    response.end();
    return;
  });
  rs.pipe(response);



}
module.exports.reqSubmit = reqSubmit;
module.exports.getData = getData;
module.exports.reqVCSS = reqVCSS;
module.exports.reqXHTML = reqXHTML;
module.exports.clientJS = clientJS;
module.exports.reqStart = reqStart;
module.exports.loading = loading;

module.exports.style = style;
