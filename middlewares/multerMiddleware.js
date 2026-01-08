const multer=require("multer")

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads')

    },
    filename:(req,res,cb)=>{
        cb(null,`Image-${Date.now()}-${file.originalname}`)

    }
})
const fileFilter=(req,filw,cb)=>{
    //only jpg,png,webp
    if(file.mimetype=='image/jpg' || file.mimetype=="image/jpeg"|| file.mimetype=="image/png" || file.mimetype=="image/webp"){
        cb(null,true)

    }
    else{
        cb(null,fasle)
    }

}
multerMiddleware =multer({
    storage,fileFilter
})
module.exports=multerMiddleware