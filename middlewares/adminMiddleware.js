
const jwt= require('jsonwebtoken')
const adminMiddleware=(req,res,next)=>{
   console.log("inside adminMiddleware ")
   const authheader = req.headers['authorization']
   console.log(authheader)
   const token=authheader.split(" ")[1]
   
   if(token){
     try{
     const jwtResponse =jwt.verify(token, process.env.JWTSECRET)
       req.payload =jwtResponse.userMail
       req.role =jwtResponse.role
      if(jwtResponse.role=='admin'){
        next() //request allowed
      }
      else{
        res.status(403).json("Access denied: admin only")
      }
    }catch(err){
        res.status(401).json(err)
    }
   }else{
    res.status(401).json("Authorization failed ...token missing")
   }

}
module.exports=adminMiddleware
