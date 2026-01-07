const mongoose =require('mongoose')
const conncetionString=process.env.DBCONNECTION
mongoose.connect(conncetionString).then(res=>{
    console.log("mongoDB connction successfull");
    
}).catch(err=>{
    console.log("database connction failed");
    console.log(err); 
})