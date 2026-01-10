const campaigns = require('../models/campaignModel')

const users=require('../models/userModel')

//admin profile edit
exports.updateAdminProfileController=async(req,res)=>{
    console.log("inside updateAdminProfileController")
    const Adminmail=req.payload
    console.log(Adminmail)
    const {username,password,picture}=req.body
    const uploadImg=req.file?req.file.filename:picture
    console.log(username,password,uploadImg)
    try{
        const adminprofile = await users.findOneAndUpdate({email:Adminmail},{username:username,password:password,picture:uploadImg},{new:true})
        res.status(200).json(adminprofile)

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
        const allCampaigns = await campaigns.find().populate("fundraiserId","username")
        console.log(allCampaigns)
        res.status(200).json(allCampaigns)
    }
    catch(error){
        console.log(error)
        res.status(500).json(error)
    }
}
//get all pending Campaign
exports.getPendingCampaignController=async(req,res)=>{
    console.log("inside getPendingCampaignController ")
     try{
        const pendingCampaigns = await campaigns.find({status:"pending"}).populate("fundraiserId","username")
        console.log(pendingCampaigns)
       
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
        const viewCampaign = await campaigns.findOne({_id:id}).populate("fundraiserId","username")
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
        const campaign = await campaigns.findById(id).populate("fundraiserId","username")
        if(campaign.status =="pending"){
            campaign.status = "active"

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
//reject camapign
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

