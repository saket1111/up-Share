const router=require('express').Router();
const File=require('../models/file');

router.get('/:uuid',async(req,res)=>{
    try{
        const file=await File.findOne({uuid:req.params.uuid});
        if(!file)
        {
            return res.render('download',{error:'file not foound'});
        }
        const filePath=`${__dirname}/../${file.path}`;
        res.download(filePath);
    }
    catch(err)
    {
        return res.render('download',{error:'something went wrong'});

    }

});


module.exports=router;