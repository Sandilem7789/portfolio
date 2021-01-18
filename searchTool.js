/* global process */

const {statSync, readdirSync, readFileSync} = require("fs");
let searchTerm = new RegExp(process.argv[2]);                                   //there must be an argument when running this 

for(let arg of process.argv.slice(3)){
    search(arg);
}

function search(file){
    let stats = statSync(file);
    console.log(stats);
    if(stats.isDirectory()){
        console.log("is dir");
        for(let f of readdirSync(file)){
            search(file + "/" + f);
        }
    }
    else if(searchTerm.test(readFileSync(file, "utf8"))){
        console.log("File name: " + file + " has been found");
    }
}