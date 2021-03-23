const url=require('./env');
const mongoose=require('mongoose');
 function connectDb()
{
    
        mongoose.connect(process.env.development, {useNewUrlParser: true,useCreateIndex: true,useUnifiedTopology: true,useFindAndModify: true});    
        
        const connection=mongoose.connection;

        connection.once('open',()=>{
            console.log("connected to dataBase...");

        }).catch(err=>{
            
            console.log("connection failed...",err.message);
            next(err);
        })
   
          
        
}
module.exports=connectDb;