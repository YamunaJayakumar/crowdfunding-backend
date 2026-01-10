const campaigns=require('../models/campaignModel')

//add campaign api
exports.addCampaignController=async(req,res)=>{
    console.log("inside addcampaignController");
    if(!req.payload){
        res.status(401).json("Unauthorized: JWT not verified")
    }
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
        endDate,
        status
        
    } = req.body
    
    //get uploaded files
    const image =req.files?.image?.[0]?.filename
    const documents =req.files?.documents?.map(file=>file.filename)
    //get fundriser mail from jwt payload
    const fundraiserMail=req.payload.userMail
    const fundraiserId = req.payload.userId
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
        fundraiserMail,
        fundraiserId
        
    )
    try{
        const existingCampaign = await campaigns.findOne({
            title,fundraiserMail
        })
        if(existingCampaign){
            res.status(409).json("campaign already exists")

        }else{
            const newCampaign =await campaigns.create({
                title,category,location,beneficiary,shortDescription,longDescription,goalAmount,minDonation,endDate,image,documents,fundraiserMail,fundraiserId,status
            })
            res.status(200).json(newCampaign)
        }

        
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }

    

}
//edit campaign api
exports.editCampaignController=async(req,res)=>{
    console.log("inside editCampaignController")
    //fundrisermail,id
    const fundraiserMail=req.payload.userMail
    const {id}=req.params
    try{
        const campaign =await campaigns.findOne({_id:id,fundraiserMail})
        //check campaign exists
        if(!campaign){
             res.status(404).json("campaign not exists")
             }else{
                 if(campaign.status=="active"){
                    //partially edit
                    campaign.shortDescription =req.body.shortDescription
                    campaign.longDescription=req.body.longDescription
                    
                    await campaign.save()
                    res.status(200).json(campaign)

                
            }
            else if(campaign.status == "pending"){
                //edit all fields
                Object.keys(req.body).forEach(field=>
                    campaign[field]=req.body[field]

                )
                //update files if uploaded
                if(req.files?.image?.[0]?.filename){
                    campaign.image =req.files.image[0].filename

                }
                if(req.files?.documents){
                    campaign.documents=req.files.documents.map(f=>f.filename)
                }
                await campaign.save()
                res.status(200).json(campaign)


                
            }
            else if (campaign.status=="closed"){
                res.status(403).json("campaign closed")
            }
           
        }
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
    

}
//get a campaign
exports.getACampignController=async(req,res)=>{
    console.log("inside getAcampaignController");
    const{id}=req.params
    const fundraiserMail=req.payload.userMail
    try{
        const viewcampaign = await campaigns.findOne({_id:id,fundraiserMail})
         if (!viewcampaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }
        res.status(200).json(viewcampaign)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }

    
}
//get all campaign-fundraiser
exports.fundraiserGetAllCampaignController=async(req,res)=>{
    console.log("inside fundraiserGetAllCampaignController")
    const fundraiserMail=req.payload.userMail
    
        try{
            const allCampaigns = await campaigns.find({fundraiserMail})
            res.status(200).json(allCampaigns)

        }
        catch(err){
            console.log(err);
            res.status(500).json(err)
            
        }
}
//delete campaign
exports.fundraiserRemoveCampaignController=async(req,res)=>{
    console.log("inside fundraiserRemoveCampaignController")
    
    const fundraiserMail=req.payload.userMail
    const {id}=req.params
    try{
        const campaign=await campaigns.findOne({_id:id,fundraiserMail})
        if(!campaign){
           return res.status(404).json("campaign not found")

        }
        
       if(campaign.status !=="pending"){
             return  res.status(403).json("Only pending campaigns can be deleted")
        }

            await campaigns.findByIdAndDelete(id)
            res.status(200).json('campaign deleted successfully')

        


    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}
//get all active campaign-unauthorised
exports.getAllActiveCampaignController=async(req,res)=>{
    console.log("inside getAllActiveCampaignController ")
     try{
        const activeCampaigns =await campaigns.find({status:"active"}).sort({ createdAt: -1 }).populate("fundraiserId","username")
        if(activeCampaigns.length>0){
            res.status(200).json(activeCampaigns)
        }else{
            res.status(404).json("no active camapigns are present")
        }
     }
     catch(err){
        console.log(err)
        res.status(500).json(err)
     }

}
//view a active campaign
exports.viewCampaignController=async(req,res)=>{
    console.log("inside viewCampaignController ")
    const {id}=req.params
    
     try{
        const campaign =await campaigns.findById(id).populate("fundraiserId","username")
        console.log(campaign)
        if(!campaign){
            return res.status(404).json("campaign not found")
        }
        if(campaign.status !="active"){
            return res.status(403).json("campaign is not active")
        }
        
            res.status(200).json(campaign)
        
     }
     catch(err){
        console.log(err)
        res.status(500).json(err)
     }

}
//view latest campaigns
exports.LatestCampaignController=async(req,res)=>{
    console.log("inside  LatestCampaignController")
    const {id}=req.params
    
     try{
        const campaign =await campaigns.find({ status: "active" }).populate("fundraiserId","username").sort({ createdAt: -1 }).limit(4)
        console.log(campaign)
        
            res.status(200).json(campaign)
        
     }
     catch(err){
        console.log(err)
        res.status(500).json(err)
     }

}