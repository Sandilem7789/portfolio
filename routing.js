/*Basic Routing*/
const http = require("http");

function index(request, response){
    response.writeHead(200);                                                    //OK status code
    response.end("Hello World");                                                //content will on the body
}

http.createServer(function(request, response){                                  //we could have used arrow functions
    if(request.url === "/"){                                                    //if the url is localhost:8000/
        return index(request, response);                                        //return function index
    }
    
    response.writeHead(404);                                                    //otherwise the file is not found
    response.end(http.STATUS_CODES[404]);                                       //'not found' is going to be displayed on the body
}).listen(8000);                                                                //port that we are going to be listening to