const fs=require("fs")
const crypto=require("crypto");

const start= Date.now()

// setting the thread pool count to 1;
process.env.UV_THREADPOOL_SIZE=1;
setTimeout(()=>console.log("1. inside setTimeOut Finished"),0)

setImmediate(()=>console.log("2. inside setImmediate Finished"))

fs.readFile('test-file.txt',()=>{
    console.log('I/O finished')

    console.log("-------bottom code is coming from event loop")

    setTimeout(()=>console.log("1a-0. inside setTimeOut Finished"),0)
    setTimeout(()=>console.log("1b-3000. inside setTimeOut Finished"),3000)
    setImmediate(()=>console.log("2a. inside setImmediate Finished"))


    process.nextTick(()=>console.log("process.next tick"))

    crypto.pbkdf2("password","salt",100000,1024,'sha512',()=>{
        console.log(Date.now()-start,"password encrypted")
    })
    crypto.pbkdf2("password","salt",100000,1024,'sha512',()=>{
        console.log(Date.now()-start,"password encrypted")
    })
})

console.log("Hello from the code that is not inside any call back ")