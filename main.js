/*A File Server*/
const {createServer} = require("http");
const methods = Object.create(null);                                            //object methods is empty here
createServer((request, response) => {
    let handler = methods[request.method] || notAllowed;                        //'notAllowed' is a method handler
    handler(request).catch(error =>{
        if(error.status !== null) return error;
        return {body: String(error), status: 500};
    })
    .then(({body, status = 200, type = "text/plain"}) => {                      
        response.writeHead(status, {"Content-Type": type});
        if(body && body.pipe) body.pipe(response);                              //if the value of body is a readable stream, it will hava pipe method that is used to foward all content from readable stream to writable stream
        else response.end(body);
    });
}).listen(8000);

async function notAllowed(request){                                             //method handler
    return{                                                                     //return an object
        status: 405,                                                            // code 405, means that the server refuses to handle a given method
        body: `Method ${request.method} not allowed`                            //text to be written on the body of the responce page
    };
}

/*File Paths and stuff*/

const {parse} = require("url");                                                 //importing parse from the url module
const {resolve, sep} = require("path");                                         //importing resolve and sep from the path module

const baseDirectory = process.cwd();                                            //cwd: current working directory, used to find the current working directory

function urlPath(url){                                                          //this is for security reasons, we dont want to expose our entire file system, urlPath 
    let {pathname} = parse(url);
    let path = resolve(decodeURIComponent(pathname).slice(1));                  //we use the 'resolve' function from the path module
    if(path !== baseDirectory && !path.startsWith(baseDirectory + sep)){         //sep binding is a seperator: backslash or forward slash on other systems
        throw {status: 403, body: "Forbidden"};                                 //when the path doesnt start with the baseDirectory or baseDirrectory + sep(which is / or \), an error is thrown with the error code 403
    }
    return path;                                                                //this function returns a working path
}

/*Using the MIME package*/
const {createReadStream} = require("fs");                                       //importing createReadStream from fs package
const {stat, readdir} = require("fs").promises;                                 //importing stat and readdir from promises (instead of direct import from fs) since we are going to be using promises instead of callback style
const mime = require ("mime");                                                  //importing the mime package: mime knows the correct Content-Type for a number of file extensions like(text/plain)

methods.GET = async function(request){                                          //adding GET into the methods object, GET is defiend to be asynchronous
    let path = urlPath(request.url);
    let stats;
    try{                                                                        //try catch block
        stats = await stat(path);                                               //stats is asynchronous since it will touch a disk, touching a disk takes a while
    } catch(error){
        if(error.code !== "ENOENT") throw error;                                //if error code is not ENOENT throw that error
        else return {status: 404, body: "File Not Found"};                      //if the error is ENOENT, then error code is 404, at the body write "file not found"
    }
    if(stats.isDirectory()){                                                    //if stats is a directory
        return {body: (await readdir(path)).join("\n")};                        //read the array files in the directory and return it to the client put a newline at the end
    } else {
        return {body: createReadStream(path),                                   //if the file is not a directory, create a readable stream and return that as the body
                type: mime.getType(path)};                                      //this is where the mime modules comes to work, looks for extentions
    }
};

/*Handling DELETE requests*/
const {rmdir, unlink} = require("fs").promises;

methods.DELETE = async function(request){
    let path = urlPath(request.url);                                            //this will return a path of some sort since the function urlPath returns a path
    let stats;
    try{                                                                        //this try catch block looks whether the file exists or not
        stats = await stat(path);                                               //stat tells a number of properties a bout a file: size property, mtime property(modification time)
    }catch(error){
        if(error.code !== "ENOENT") throw error;                                //if the code of the error is not ENOENT throw that error
        else return {status: 204};                                              //otherwise return an object with the status code 204 : code 204 means the response does not contain any content
    }
    if(stats.isDirectory()) await rmdir(path);                                  //if its a directory remove directory(rmdir)
    else await unlink(path);                                                    //otherwise its a file, unlink that file
    return {status: 204};                                                       //return code 204 wich means the response doesnt contain any content 
};

/*Handling PUT requests*/
const {createWriteStream} = require("fs");

function pipeStream(from, to){
    return new Promise((resolve, reject) => {
        from.on("error", reject);                                               //when input request fails we will reject the promise, and an error will be streamed
        to.on("error", reject);                                                 //if an output request fails we will reject the promise again: this may be deu to network problems
        to.on("finish", resolve);                                               //when pipe is done it will close the output stream: then finish event is fired: this is where the promise gets resolved
        from.pipe(to);                                                          //pipe moves data from a readable stream to a writable   stream
    });
}

methods.PUT = async function(request){
    let path = urlPath(request.url);
    await pipeStream(request, createWriteStream(path));
    return {status: 204};
};
