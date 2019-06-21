"use strict";
var server=require("./js/server");
var router=require('./js/router');
var rh=require('./js/requestHanders.js');

var handle = {};
  handle['/']=rh.reqStart;
  handle['/index.html']=rh.reqStart;
  handle['/js/client.js']=rh.clientJS;
  handle['/css/style.css']=rh.style;
  handle['/data']=rh.getData;
  handle['/submit']=rh.reqSubmit;
  handle['/xhtml']=rh.reqXHTML;
  handle['/vcss']=rh.reqVCSS;
  handle['/loading']=rh.loading;

server(router,handle);
