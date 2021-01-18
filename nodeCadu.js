/*Melearning Nodejs*/
const http = require("http");

http.createServer((request, response) => {
    response.writeHead(200, {
        "Content-Type": "text/plain"
    });
    
    response.write("Hello World!\n");
    response.end();
}).listen(8000);

/******************************************************************************/


/*Working With Modules*/
const ytTut1 = require("./ytTut1.js");
console.log(ytTut1.sum(2,3));
console.log(ytTut1.PI);
console.log(new ytTut1.SomeMathObject());

/*Events Module and The emitter Class*/
const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

eventEmitter.on("tutorial", (n1, n2) => {                                       //only going to be executed if the "tutorial" event occurs
    console.log("\n", n1 + n2);
});

eventEmitter.emit("tutorial", 1, 2);                                            //emitting an event, like pushing down a button

class Person extends EventEmitter{
    constructor(name){
        super();
        this._name = name;
    }
    
    get name(){
        return this._name;
    }
}

let sandile = new Person("Sandile");
let sizwe = new Person("Sizwe");

sandile.on("name", () => {
    console.log("My name is" , sandile.name);
});
sizwe.on("name", () => {
    console.log("My other name is", sizwe.name);
});

sandile.emit("name");
sizwe.emit("name");

/*ytTut1.js Working with modules*/
const sum = (num1, num2) => num1 + num2;
const PI = 3.14;
class SomeMathObject{
    constructor(){
        console.log("object created");
    }
}

module.exports = {sum: sum, PI: PI, 
                   SomeMathObject: SomeMathObject
               };
               
/*ReadLine Module*/
/* global process */

const readline = require("readline");
const rl = readline.createInterface({input: process.stdin, 
                                     output: process.stdout});
let num1 = Math.floor((Math.random() * 10) + 1);
let num2 = Math.floor((Math.random() * 10) + 1);
let answer = num1 + num2;


rl.question(`What is ${num1} + ${num2}?\n`,
    (userInput) => {
        if(userInput.trim() == answer){
            rl.close();                                                         //this line emitts the close event
    }else{
        rl.setPrompt("Incorrect response, please try again\n");
        rl.prompt();
        rl.on("line", (userInput) => {
           if(userInput.trim() == answer)
               rl.close();
           else{
                rl.setPrompt(`Your answer of ${userInput} is incorrect try angain\n`);
                rl.prompt();
                
           }
        });
    }
});

rl.on("close", () => {                                                          //and here were are listening for a close event
    console.log("Correct!!!");                                                  //then here we are we will display this message upon hearing a close event
});

/*FIle System Module 25 Niv 2020*/
const fs = require("fs");


fs.writeFile("Example.txt", "this is an example", (error) => {                  //1st arg: name of file, 2nd arg: content of file,  3rd: error
    if(error) console.log(error);                                               //print the error if theres an error
    else{                                                                       
        console.log("file created successfully");                               
        fs.readFile("Example.txt", "utf8", (error, file) => {                   //1st arg: Name of file, 2nd arg: encoding (leabve this out the ouput is going to be binary), 3rd arg: (error and file)
            if(error) console.log(error);
            else console.log(file);
        });
    }
}); 

fs.rename("Example.txt", "Example2.txt", (error) => {                           //renaming a file
    if(error) console.log(error);
    else console.log("successfully renamed the file");
}); 

fs.appendFile("example2.txt", " Some data being appended", (error) => {         //adding data into a file
    if(error) console.log(error);
    else console.log("File successfully appended");
});

fs.unlink("Example2.txt", (error) => {                                          //deleting a file
    if(error) console.log(error);
    else console.log("successfully deleted");
});

/*FIle System Module Part 2: 26 N0V 2020*/
const fs = require("fs");
fs.mkdir("tutorial", (error) => {                                               //make directory: create a folder
    if(error) console.log(error);
    else console.log("Folder Successfully created");
    fs.writeFile("./tutorial/example.txt", "NEW example", (error) => {
        if(error) console.log(error);
        else console.log("File successfully created");
    });
});


fs.unlink("./tutorial/example.txt", (error) => {                                //deleting a file
    if(error) console.log(error);                                               //if there's an error, display it
    else{                                                                       //otherwise this means
        console.log("File deleted successfully");                               //...
        fs.rmdir("tutorial", (error) => {                                       //remove folder called tutorial, callback a function for bearing bad news
            if(error) console.log(error);                                       //if there's an error state it
            else console.log("folder deleted successfully");                    //otherwise the folder has been removed successfuly
        });
    }
});

/*Cannot delete a folder containing files you need to delete all of them first*/
fs.readdir("tutorial", (err, files) => {                                        //read directory: reads the list of files in the folder
    if(err) console.log(err);
    else{
        console.log(files);                                                     //array with the name of the files
        for(let file of files){
            fs.unlink("./tutorial/" + file, (err) => {
                if(err) console.log(err);
                else console.log("successfully deleted file: ", file);
            });
        }
    }
});

/*Working with Readable Streams and Writable streams 27 Nov 2020*/
const fs = require("fs");
const readStream = fs.createReadStream("./example.txt", "utf8");                //read stream methods inherits from the emitter class: we wanna read something
const writeStream = fs.createWriteStream("example2.txt");                       //we wanna write Something
readStream.on("data", (chunk) => {                                              //so when data is emitted
    console.log(chunk);                                                         //display the chunk of data from the file, we can send this chunk to another file if we like
    writeStream.write(chunk);                                                   //this is going to write this data to example2.txt
});

/*Pipes and Pipe Chaining*/                                                     //to use a pipe we need to have two streams source stream and destination stream
const fs = require("fs");
const zlib = require("zlib");                                                   //installed module                                               
//const gzip = zlib.createGzip();                                               //transform stream data is going to be compressed(Gzip): Gunzip()
const gunzip = zlib.createGunzip();                                             //unzips what has been zipped with gzip
//const readStream = fs.createReadStream("./example.txt", "utf8");              //read stream methods inherits from the emitter class: we wanna read something
const readStream = fs.createReadStream("./example2.txt.gz");
const writeStream = fs.createWriteStream("uncompressed.txt");                   //we wanna write Something
readStream.pipe(gunzip).pipe(writeStream);                                      //take chunks of data from readStream pipe to gzip(transform it) then pipe it to writeStream

/*Creating an HTTP Server using the HTTP Module*/
const http = require("http");
const server = http.createServer((request, response) => {
    if(request.url === "/"){
        response.write("Hello agin from Node");
        response.end();
    }
    else{
        response.write("Using another domain");                                 //here we can even put a 404 page
        response.end();
    }
});

server.listen("8000");

/*Serving Static Files with HTTP and File System Module*/
const http = require("http");
const fs = require("fs");
http.createServer((req, res) => {
    //const readStream = fs.createReadStream("./static/index.html");
    //const readStream = fs.createReadStream("./static/example.json");
    const readStream = fs.createReadStream("./static/sprites.png");
    //res.writeHead(200, {"Content-Type": "text/html"});
    //res.writeHead(200, {"Content-Type": "application/json"});
    res.writeHead(200, {"Content-Type": "image/png"});
    readStream.pipe(res);
}).listen(8000);
