const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const url=require('../config/env');

module.exports=async({emailTo,emailFrom,html})=>{


 const transport = nodemailer.createTransport(
        nodemailerSendgrid({
            apiKey: process.env.apikey
        })
    );
    

 const info=await transport.sendMail({
    from: "saketrj2@gmail.com",
    to: [emailTo],
    subject: `${emailFrom} send a file`,
    html:html ,
});
};