const campaigns=require('../models/campaignModel')
const jwt =require('jsonwebtoken')
//add campaign api
exports.addCampaignController=async(req,res)=>{
    console.log("inside addcampaignController");
    if(!req.payload){
        res.status(401).json("Unauthorized: JWT not verified")
        
        //get campaign details from req.body

         const {
        title,
        category,
        location,
        beneficiary,
        shortDescription,
        longDescription,
        goalAmount,
        minDonation,
        endDate
    } = req.body
    }
    //get uploaded files
    const image =req.files?.image?.[0]?.filename
    const documents =req?.files?.documents?.map(file=>file.filename)
    //get fundriser mail from jwt payload
    const fundriserMail=req.payload.userMail
     console.log(
        title,
        category,
        location,
        beneficiary,
        shortDescription,
        longDescription,
        goalAmount,
        minDonation,
        endDate,
        image,
        documents,
        fundriserMail
        
    )
    try{
        const existingCampaign = await campaigns.findOne({
            title,fundriserMail
        })
        if(existingCampaign){

        }else{
            const newCampaign =await campaigns.create({
                title,category,location,beneficiary,shortDescription,longDescription,goalAmount,minDonation,endDate,image,documents,fundriserMail
            })
            res.status(200).json(newCampaign)
        }

        
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }

    

}