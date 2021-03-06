const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuidv4 } = require('uuid');
const url=require('../config/env');
const sendEmail=require('../services/emailservice');
const emailTemplate=require('../services/emailtemplate');


let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/') ,
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
              cb(null, uniqueName)
    } ,
});

let upload = multer({ storage, limits:{ fileSize: 1000000 * 100 }, }).single('myfile'); 

router.post('/', (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).send({ error: err.message });
      }
        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        });
       
       try{ const response = await file.save();
          res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });}
       catch(err)
       {
         next(err);
       }
      });
});

router.post('/send',async(req,res)=>{
  
  const {uuid,emailTo,emailFrom}=req.body;
  if(!uuid||!emailTo||!emailFrom)
  {  
    return res.status(422).send({error:'all fields are required'});
  }
  try{
  const file=await File.findOne({uuid:uuid});
  if(file.sender)
  {
    return res.status(422).send({error:'Email already sent'});
  }
  file.sender=emailFrom;
  file.receiver=emailTo;
  const response=await file.save();
  //sending mail
  const html=emailTemplate({
    emailFrom:emailFrom, 
    downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email` ,
    size: parseInt(file.size/1000) + ' KB',
    expires: '24 hours'
});

  const sendingDetails={
    emailTo:emailTo,
    emailFrom:emailFrom,
    html:html
  }

   sendEmail(sendingDetails).then(() => {
    return res.json({success: true});
  }).catch(err => {
    return res.status(500).json({error: 'Error in email sending.'});
  });
  

}
catch(error){
  console.log(error);
  return res.status(500).send({ error: 'Something went wrong.'});}

});

module.exports=router;