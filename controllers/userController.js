const users=require('../models/userModel')
const jwt=require('jsonwebtoken')
//register api
exports.registerController = async(req,res)=>{
    console.log("Inside Register controller");
    const {username,email,password}=req.body
    console.log(username,email,password);
    try{
        // check mail in model
        const existingUser = await users.findOne({email})
        
        if(existingUser){
            res.status(409).json("User Already exist!!! Please Login...")
            
        }
        else{
            const newUser = new users({
                username,email,password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    }catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }
    
    // res.status(200).json("Request Recieved")
    
}
//loginapi
exports.loginController=async(req,res)=>{
    console.log("inside loginController")
    const{email,password}=req.body
    console.log(email,password)
    try{
         // check mail in model
         const existingUser =await users.findOne({email})
         console.log(existingUser)
         console.log(existingUser)
         if(existingUser){
            if(password==existingUser.password){
                //token generation-jwt.sign(payload,secretKey)
                const token=jwt.sign({userMail:existingUser.email,role:existingUser.role},process.env.JWTSECRET)
                res.status(200).json({user:existingUser,token})

            }else{
                res.status(401).json("incorrect email/password")
            }

         }else{
            res.status(404).json("user does not exist")
         }

    }catch(err){
        console.log(err);
        res.status(500).json(err)
        
    }


}
//google sign in 
exports.googleLoginController=async(req,res)=>{
    console.log("inside googleLoginController")
    const{email,password,username,picture}=req.body
    console.log(email,password,username,picture)
    try{
        //check mail in model
        const existingUser=await users.findOne({email})
        if(existingUser){
            //login
            //generate token
            const token=jwt.sign({userMail:existingUser.email,role:existingUser.role},process.env.JWTSECRET)
            res.status(200).json({user:existingUser,token})

        }else{
            //register
            const newUser = await users.create({
                username,email,password,picture
            })
            const token=jwt.sign({userMail:newUser.email,role:newUser.role},process.env.JWTSECRET)
            res.status(200).json({user:newUser,token})
        }

    }catch(err){
        console.log(err);
        res.status(500).json(err)
        
    }

}
//update fundraiser profile
exports.updateFundraiserProfile=async(req,res)=>{
    console.log("inside updateFundraiserProfile ")
    const {id}=req.params
    const fundraiserMail=req.payload.userMail
    const {username,email,password,picture,role}=req.body
    const uploadImage =req.file? req.file.filename : picture
    console.log(id,username,email,password,uploadImage,role)
    try{
        
        const updateFundraiser=await users.findByIdAndUpdate({_id:id},{username,password,picture:uploadImage},{new:true})
        res.status(200).json(updateFundraiser)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}