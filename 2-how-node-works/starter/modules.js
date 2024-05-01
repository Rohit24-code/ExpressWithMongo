console.log(arguments)
//this proofs we are in a fucntion that wraps our file beacuse arguments are provided in a funciton

console.log(require('module').wrapper)

// this is what node uses behind the scene that give access to require and module etc. 
// '(function (exports, require, module, __filename, __dirname) { ',
// '\n});'


//require("") uses caching 