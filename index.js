require('dotenv').config()
const express = require('express')
const cors=require('cors')
const router =require('./routes/routing')
require('./config/db')
const fundriserServer=express()
fundriserServer.use(cors())
fundriserServer.use(express.json())
fundriserServer.use(router)
fundriserServer.use('/uploads',express.static('./uploads'))

const PORT=3000
fundriserServer.listen(PORT,()=>{
    console.log("fundriser-server started");
    
})
fundriserServer.get('/',(req,res)=>{
    res.status(200).send(`<h1>fundriser-server started</h1>`)

})