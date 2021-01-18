/*Routing using Objects*/
const http = require("http");

var routes = {                                                                  //routes object: this is where one can put the tree of the website
    "/":    function index (request, response){                                 //when home i.e "localhost:8000/"..
                response.writeHead(200);                                        //everythis is ok
                response.end("Hello again");                                    //display "Hello again"
            },
            
    "/foo": function foo (request, response){                                   //when the url goes to foo i.e "localhost:8000/foo"
                response.writeHead(200);                                        //everything is ok
                response.end("You are now viewing foo");                        //display this on the body
            }
};

http.createServer(function (request, response){                                 //create a file server
    if(request.url in routes){                                                  //if the request is in the routes object
        return routes[request.url](request, response);                          //call the said function
    }
    
    response.writeHead(404);                                                    //otherwise the url is not found
    response.end(http.STATUS_CODES[404]);                                       //return file not found
}).listen(8000);                                                                //listen to this port