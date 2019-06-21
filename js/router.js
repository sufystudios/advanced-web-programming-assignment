"use strict";
var router= function(path,handle,response,request)
 {
   console.log(path);
   if(typeof handle[path] === 'function') {
     handle[path](request,response);
   }
   else {
   response.writeHead(404, {"Content-Type": "text/plain"});
   response.write("Error not found 404");
   response.end();
 }
}
module.exports=router;
