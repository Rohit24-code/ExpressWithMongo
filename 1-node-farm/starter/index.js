const fs = require("fs");
const http = require("http");
const url = require("url");
/////////////////////////////////////////////////////////////

//  Read And Write Files

// //Read and write in node js synchronously or blocking.
// const textIn=fs.readFileSync("./txt/input.txt",'utf-8')

// const textOut= `This is what we know about the avocado ${textIn}. \n created on ${Date.now()}`
// fs.writeFileSync("./txt/output.txt",textOut);

// //Read and write in node js asynchronously or non-blocking.

// // this is a call back hell and it runs from top to bottom.
// fs.readFile("./txt/start.txt","utf-8",(err,data1)=>{

//    if(err) return console.log('Error !')

//    fs.readFile(`./txt/${data1}.txt`,"utf-8",(err,data2)=>{
//       console.log(data2,'data2');
//       fs.readFile(`./txt/append.txt`,"utf-8",(err,data3)=>{
//        console.log(data3)

//        fs.writeFile("./txt/final.txt",`${data2}\n ${data3}`,'utf-8',err=>{
//         console.log("the file has been written")
//        })
//       })
//    })
// })

// console.log("will read file")

/////////////////////////////////////////////////////////

//  Server

//This code runs only for the first time when the file is readed and the bottom will run evry time 
const data=fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const parsedData = JSON.parse(data)

const server = http.createServer((req, res) => {
  const pathname = req.url;
  if (pathname === "/rohit") {
    res.end("ROhit hu me");
  } else if (pathname === "/product") {
    res.end("hum product ha");
  } else if (pathname === "/api") {
   res.end(data)
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello world",
    });
    //we need to specify header before sending the response
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, () => {
  console.log("listening to req on port 8000");
});
