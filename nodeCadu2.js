/*Reverse*/
const {reverse} = require("./reverse");
let argument = process.argv[2];
console.log(reverse(argument));

/*File System*/
let {readFile} = require("fs");
readFile("file.txt", "utf8", (error, text) => {
    if(error) throw error;
    console.log("The file contains:", text);
});

/*HTTP Module*/
const {createServer} = require("http");
let server = createServer((request, response) => {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(`
        <h1>Hello</h1>
        <p>
            You asked for <code>${request.url}</code>
        </p>`);
    response.end();
}).listen(8000);

console.log("Listen 8000");