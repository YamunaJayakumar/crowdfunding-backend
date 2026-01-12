const withdrawals = require('../models/withdrawModel')
const campaigns = require('../models/campaignModel')
//request withdrawal
exports.withdrwalRequestController = async (req, res) => {
    console.log("inside withdrwalRequestController ")
    //campaign fetch
    //withdrwal request creation
    const fundraiserId = req.payload.userId
    const fundraiserMail = req.payload.userMail
    const { id } = req.params
    const { bankDetails } = req.body

    try {
        const campaign = await campaigns.findById(id)
        console.log(campaign)
        //campaign status-closed
        if (!campaign || campaign.status !== "closed") {
            return res.status(400).json({ message: "Campaign not eligible for withdrawal" });
        }
        if (campaign.isWithdrawn == true) {
            return res.status(400).json("Campaign already withdrawn");


        }
        //crete withdrwal request
        const withdrawal = await withdrawals.create({
            campaignId: id, fundraiserId, fundraiserMail: fundraiserMail, amount: campaign.totalRaised, bankDetails
        })
        campaign.isWithdrawn = true;
        await campaign.save();
        res.status(200).json({ message: "Withdrawal requested", withdrawal })




    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }


}

//get status of withdrawal
exports.getWithdrwalStatusController = async (req, res) => {
    console.log("inisde getWithdrwalStatusController")
    //get the fundraiserid
    const id = req.payload.userId
    //fetch their withdrawal
    try {
        const withdrawalHistory = await withdrawals.find({ fundraiserId: id }).populate("campaignId", "title category").sort({ createdAt: -1 })
        res.status(200).json(withdrawalHistory)
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }


    //send it to frontend

}