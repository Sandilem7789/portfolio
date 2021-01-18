/*Chapter 20*/
let message = "Hello World";
//console.log(message);

function title(titleName){
    console.log(" -------------------------------\n",
				"\t", titleName, "\n",
                "-------------------------------");
}

const {readFile} = require("fs");
readFile("file.txt", "utf8", (error, text) => {
    //title("The File System");
    if(error) throw error;
    //  console.log("the file contains: ", text);   
});

/*The HTTP Module*/
/*HTTP server*/
const {createServer} = require("http");                                         //callong the HTTP module
let server = createServer((request, response) => {                              //request and response bindings are objects representing incoming and outgoing data
    response.writeHead(200, {"Content-Type" : "text/html"});
    response.write(`
        <h1>Hello</h1>
        <p>You asked for <code>${request.url}</code></p>`);
    response.end;
});
server.listen(8000);
console.log("Listening! (port: 8000)");

/*HTTP client*/
const {request} = require("http");
let requestStream = request({
    hostname: "eloquentjavascript.net",
    path: "/20_node.html",
    method: "GET",
    headers: {Accept: "text/html"}
}, response => {
    console.log("Server responded with status code", response.statusCode);
});
requestStream.end();

/*A server that reads request bodies and streams them back as uppercase characters*/
const {createServer} = require("http");
createServer((request, response) => {
    response.writeHead(200, {"Content-Type": "text/plain"});
    request.on("data", chunk =>                                                 //"on" is a data handler, 
        response.write(chunk.toString().toUpperCase()));
    request.on("end", () => response.end());                                    //when the request ends, end the response??
}).listen(8000);                                                                //this is where we must point the prowser

const {request} = require("http");
request({
    hostname: "localhost",
    port: 8000,
    method: "POST"
}, response => {
    response.on("data", chunk => process.stdout.write(chunk.toString()));
}).end("Hello Server");