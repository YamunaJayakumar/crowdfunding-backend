const campaigns = require('../models/campaignModel')
const donations= require('../models/donationModel')
const users=require('../models/userModel')
const withdrawals=require('../models/withdrawModel')

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
        
        if (!campaign) {
            return res.status(404).json("Campaign not found");
        }
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
//get all donation history
exports.adminDonationHistoryController=async(req,res)=>{
    console.log("inisde adminDonationHistoryController ")
    try{
        const donationHistory = await donations.find().populate("campaignId", "title category fundraiserMail")
        console.log(donationHistory)
        res.status(200).json(donationHistory)
    }
    catch(error){
        console.log(error)
        res.status(500).json(error)
    }
}
//get all pending withdrwal request
exports.allPendingWithdrawalController =async(req,res)=>{
    console.log("inside allPendingWithdrawalController")
    try{
          const pendingWithdrawals =await withdrawals.find({status:"pending"}).populate("campaignId","title category totalRaised").populate("fundraiserId","username email")
          res.status(200).json(pendingWithdrawals)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
    

}
//approve or reject withdrawl request
// exports.approveWithdrawalController = async (req, res) => {
//     console.log("inside approveWithdrawalController");

//     const { id } = req.params;          // withdrawal id
//     const { action } = req.body;        // "approved" | "rejected"

//     try {
//         const withdrawal = await withdrawals.findById(id);

//         if (!withdrawal) {
//             return res.status(404).json({ message: "Withdrawal request not found" });
//         }

//         if (withdrawal.status !== "pending") {
//             return res.status(400).json({
//                 message: "This withdrawal request is already processed"
//             });
//         }

//         // ================= APPROVE =================
//         if (action === "approved") {
//             const campaign = await campaigns.findById(withdrawal.campaignId);

//             if (!campaign) {
//                 return res.status(404).json({ message: "Campaign not found" });
//             }

//             // Double safety
//             if (campaign.isWithdrawn) {
//                 return res.status(400).json({
//                     message: "Campaign funds already withdrawn"
//                 });
//             }

//             withdrawal.status = "approved";
//             withdrawal.processedAt = new Date();

//             campaign.isWithdrawn = true;
//             campaign.withdrawnAmount = withdrawal.amount;
//             campaign.status = "withdrawn";

//             await campaign.save();
//         }

//         // ================= REJECT =================
//         else if (action === "rejected") {
//             withdrawal.status = "rejected";
//             withdrawal.processedAt = new Date();
//         }

//         // ================= INVALID =================
//         else {
//             return res.status(400).json({
//                 message: "Invalid action. Use 'approved' or 'rejected'"
//             });
//         }

//         await withdrawal.save();

//         res.status(200).json({
//             message: `Withdrawal ${withdrawal.status} successfully`,
//             withdrawal
//         });

//     } catch (err) {
//         console.log(err);
//         res.status(500).json(err);
//     }
// };
// approve or reject withdrawal request
exports.approveWithdrawalController = async (req, res) => {
  console.log("inside approveWithdrawalController");
  console.log("params:", req.params);
  console.log("body:", req.body);

  const { id } = req.params;
  const { action } = req.body;

  try {
    const withdrawal = await withdrawals.findById(id);
    console.log("withdrawal:", withdrawal);

    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal request not found" });
    }

    if (withdrawal.status.toLowerCase() !== "pending") {
      return res.status(400).json({
        message: "This withdrawal request is already processed",
        currentStatus: withdrawal.status
      });
    }

    if (action === "approved") {

      const campaign = await campaigns.findById(withdrawal.campaignId);
      console.log("campaign:", campaign);

      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      if (campaign.isWithdrawn) {
        return res.status(400).json({
          message: "Campaign funds already withdrawn"
        });
      }

      withdrawal.status = "approved";
      withdrawal.processedAt = new Date();

      campaign.isWithdrawn = true;
      campaign.withdrawnAmount = withdrawal.amount;
      campaign.status = "closed";

      await campaign.save();
    }
    else if (action === "rejected") {
      withdrawal.status = "rejected";
      withdrawal.processedAt = new Date();
    }
    else {
      return res.status(400).json({
        message: "Invalid action",
        received: action
      });
    }

    await withdrawal.save();

    return res.status(200).json({
      message: `Withdrawal ${withdrawal.status} successfully`,
      withdrawal
    });

  } catch (err) {
    console.error("APPROVAL ERROR:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message
    });
  }
};



