const fs = require("fs");
const superagent = require("superagent");

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) reject("i could not find that file");
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err, data) => {
      if (err) reject(err);
      resolve("success");
    });
  });
};


// async await is synthentic sugar for promises 
  const getDogPic= async ()=>{
    try{
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(data,'data')
    
        const res1Pro =   superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    
        const res2Pro =   superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    
        const res3Pro =   superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
          
        const all = await Promise.all([res1Pro,res2Pro,res3Pro])
        const imgs = all.map((item)=>item.body.message)
        console.log(imgs,"imgs")
        await writeFilePro("dog-img.txt",imgs.join("\n"));
        console.log("random dog saved to file")
    }
    catch(err){
        console.log(err,"err")
        throw err
    }
    return 'Ready'
  }

  (async ()=>{
    try{
       console.log("1. will get dog pics")
  const x = await getDogPic()
  console.log(x)
  console.log("2. get dog pics")
    }
    catch(err){

    }
  })();

  // console.log("1. will get dog pics")
  // const x = await getDogPic()
  // console.log(x)
  // console.log("2. get dog pics")
// readFilePro(`${__dirname}/dog.txt`)
//   .then((data) => {
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })

//   .then((res) => {
//     console.log(res.body.message)
//     return writeFilePro("dog-img.txt",res.body.message);
//   })
//   .then((res) => {
//     console.log(res, "res");
//   })
//   .catch((err) => {
//     return console.log(err, "err");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
