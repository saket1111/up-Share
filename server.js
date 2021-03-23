const express=require('express');
const app=express();
const connectdb=require('./config/db');
const multer=require('multer');
const bodyParser = require('body-parser');
const path=require('path');
const url=require('./config/env');
const cors=require('cors');
require('dotenv').config()
//make connection to database
connectdb();
//Templates
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');
//cors
const corsOptions={
  origin:process.env.allowed_clients.split(',')
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.use('/api/files',require('./routes/files'));
app.use('/files',require('./routes/show'));
app.use('/files/download',require('./routes/download'));
//global error middleware
app.use(function (err, req, res, next) {
    if (err instanceof multer.MulterError) {
      res.statusCode = 400;
      res.send(err.code);
    } else if (err) {
      if (err.message === "FILE_MISSING") {
        res.statusCode = 400;
        res.send("FILE_MISSING");
      } 
      else {
        res.statusCode = 500;
        res.send(err.message);
        console.log(err.message);
      }
    }
  });


//Server creation....
const port=process.env.PORT||3000;
app.listen(port,()=>{
console.log(`listening on port ${port}`);
});


