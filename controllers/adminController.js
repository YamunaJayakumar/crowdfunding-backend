const campaigns = require('../models/campaignModel')

const users=require('../models/userModel')

//admin profile edit
exports.updateAdminProfileController=async(req,res)=>{
    console.log("inside updateAdminProfileController")
    const {id}=req.params
    const {username,password}=req.body
    const picture=req.file.filename
    try{
        const admin = await users.findByIdAndUpdate({_id:id},{username:username,password:password,picture:picture},{new:true})
        res.status(200).json(admin)

    }
    catch(error){
        console.log(error)
        res.status(500).json(error)
    }

}
//get all campaign by admin
exports.getAllCampaignAdminController=async(req,res)=>{
    console.log("inisde getAllCampaignAdminController ")
    try{
        const allCampaigns = await campaigns.find()
        res.status(200).json(allCampaigns)
    }
    catch(error){
        console.log(error)
        res.status(500).json(error)
    }
}
exports.getPendingCampaignController=async(req,res)=>{
    console.log("inside getPendingCampaignController ")
     try{
        const pendingCampaigns = await campaigns.find({status:"pending"})
       
        res.status(200).json(pendingCampaigns)
    }
    catch(error){
        console.log(error)
        res.status(500).json(error)
    }
}
//get campaign By id
exports.getCampaignByIdController=async(req,res)=>{
    console.log("inside getCampaignByIdController")
    const {id} =req.params
    try{
        const viewCampaign = await campaigns.findOne({_id:id})
        res.status(200).json(viewCampaign)

    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }

}
//approve camapign
exports.approveCampaignController= async(req,res)=>{
    console.log("inside approveCampaignController")
    const{id}=req.params
    try{
        const campaign = await campaigns.findById(id)
        if(campaign.status =="pending"){
            campaign.status = "approved"

            await campaign.save()
            res.status(200).json(campaign)
        }
        else{
            res.status(400).json("only pending Campaigns can be approved")
        }
      
        
    }catch(error){
        console.log(error)
        res.status(500).json(error)
    }

}
//approve camapign
exports.rejectCampaignController= async(req,res)=>{
    console.log("inside approveCampaignController")
    const{id}=req.params
    try{
        const campaign = await campaigns.findById(id)
        if(campaign.status =="pending"){
            campaign.status = "rejected"

            await campaign.save()
            res.status(200).json(campaign)
        }
        else{
            res.status(400).json("only pending Campaigns can be rejected")
        }
      
        
    }catch(error){
        console.log(error)
        res.status(500).json(error)
    }

}

