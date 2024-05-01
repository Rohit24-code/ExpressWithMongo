const fs = require('fs');
const server= require("http").createServer()

server.on('request',(req,res)=>{
    //bad solution
    // fs.readFile('test-file.txt',(err,data)=>{
    //     if(err)console.log(err);
    //     res.end(data);
    // })


    // second but a bit ineffective solution using chunks 
    // const readable=fs.createReadStream("test-file.txt")
    // readable.on('data',chunk=>{
    //     res.write(chunk)
    // })
    // readable.on('end',()=>{
    //      res.end()
    // })
    // readable.on('error',err=>{
    //     console.log(err)
    //     res.statusCode=500
    //     res.end("file not found")
    // })


    //Best solution to read and write using pipe
     const readable=fs.createReadStream("test-file.txt")
     readable.pipe(res);

})

server.listen(8000,'127.0.0.1',()=>{
   console.log("listening")
})