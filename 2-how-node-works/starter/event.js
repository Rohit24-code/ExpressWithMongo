const EventEmitter = require('events');
const http =require("http")

//this is how how they write internally and we make a instance of it and use it ;

class Sales extends EventEmitter{
    constructor(){
        super()
    }
}

// creating a instance 
const myEmitter=new Sales;


myEmitter.on('newSale',(()=>{
    console.log("there was a new sale")
}))

myEmitter.on('newSale',()=>{
    console.log("Customer name: Rohit");
})

myEmitter.on("newSale", stock=>{
    console.log(`There are now ${stock} item present`)
})

// this is like a event we make for clicking a btn like 
// in btn we do click event  
myEmitter.emit("newSale",9);

//Another example
const server=http.createServer();

server.on('request',(req,res)=>{
    console.log("Request Received");
    res.end("request received")
})

server.on('request',(req,res)=>{
    console.log("Another Request");
    // res.end("Another request")
})

server.on('close',(req,res)=>{
    console.log("server closed");
    // res.end("server closed")
})

server.listen(8000,'127.0.0.1',()=>{
    console.log("waiting for req")
})