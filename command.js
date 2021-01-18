/*Here we are creating command line utilities*/
/* global process */

'use strict';

var username = process.argv[2];                                                 //first argument: username
if(!username) {
    var appName = process.argv[1].split(require("path").sep).pop();             //Extract the filename
    console.error("Missing argument! Example: %s YOUR_NAME", appName);          //An example of how to run the node app
    process.exit(1);                                                            //exit(0): no error, exit(1): error
}

console.log("Hello %s!", username);