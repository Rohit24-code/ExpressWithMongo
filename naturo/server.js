// 3. Start the server
// this should be on the top level
// so that we can have access of proccess.env at  all places
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const PORT = 4000;
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
  .then(() => console.log('Connected to DB'));

app.listen(process.env.PORT || PORT, () => {
  console.log(`App running on port ${process.env.PORT || PORT}`);
});
