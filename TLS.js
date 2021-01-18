/*TLS server*/
"use strict";
var tls = require("tls");
var fs = require("fs");

const PORT = 8000;
const HOST = "127.0.0.1";

var options = {
    key: fs.readFileSync("private-key.pem"),
    cert: fs.readFileSync("public-cert.pem")
};

var server = tls.createServer(options, function(socket){
    socket.write("I am the server sending you a message.");                     //this is how you write strings with socket
    socket.on("data", function(data){                                           //print the data that we have recieved
        console.log("Recieved: %s [it is %d bytes long]",
        data.toString().replace(/(\n)/gm,""),                                   //use regular expressions to find a new line char and replace it with an empty space
        data.length);
    });
    
    socket.on("end", function(){                                                //spell for letting us know when the transmition is over
        console.log("EOT, (End Of Transmission)");
    });
});

server.listen(PORT, HOST, function(){
    console.log("I'm listening at %s, on port %s");                             //Listening to host 127.0.0.1 on port 8000
});

server.on("error", function(error){                                             //when an error occurs let us know
    console.error(error);
    server.destroy();                                                           //close the connection
});