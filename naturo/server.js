// 3. Start the server
// this should be on the top level
// so that we can have access of proccess.env at  all places

//uncaught exception is something like if i try to console a variable without even declaring it


const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const PORT = 4000;

process.on('uncaughtException',err=>{
  console.log("-----Shutting Down-------------UNHANDLED Exception--------------")
  console.log(err.name,err.message)
    process.exit(1);
})


const DB = process.env.MONGO_URI.replace(
  '<PASSWORD>',
  process.env.MONGO_PASSWORD,
);
const app = require('./app');
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to DB')).catch((err)=>console.log(err))

const server=app.listen(process.env.PORT || PORT, () => {
  console.log(`App running on port ${process.env.PORT || PORT}`);
});

//this is take care of all the unhandled rejection like we can say async without catch kind of
process.on('unhandledRejection',err=>{
  console.log("-----Shutting Down-------------UNHANDLED REJECTIONS--------------")
  console.log(err.name,err.message)
  server.close(()=>{
    process.exit(1);
  })
})



