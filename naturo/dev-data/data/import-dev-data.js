// 3. Start the server
// this should be on the top level
// so that we can have access of proccess.env at  all places
const fs=require('fs');
const Tour = require("./../../models/tourModel")
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const PORT = 4000;
const DB = process.env.MONGO_URI.replace(
  '<PASSWORD>',
  process.env.MONGO_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to DB'));

  // READ JSON FILE 
  const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'))

  // IMPORT DATA INTO DB 
  const importData= async () => {
    try {
      await Tour.create(tours)
      console.log("data successfully loaded")
    } catch (error) {
      console.log(error)
    }
  }

   // DELETE DATA INTO DB 
   const deleteData= async () => {
    try {
      await Tour.deleteMany()
      console.log("data successfully deleted")
    } catch (error) {
      console.log(error)
    }
  }


  if(process.argv[2] === '--import'){
    importData()
  }
  else if (process.argv[2] === '--delete'){
    deleteData()
  }
