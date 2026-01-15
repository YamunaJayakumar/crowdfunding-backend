const donations = require('../models/donationModel')
const campaigns = require('../models/campaignModel')

const stripe = require('stripe')(process.env.STRIPESECRET)
//make donation by user

exports.donationPaymentController = async (req, res) => {
  try {
    const { id } = req.params; // campaign id
    const { amount, donorName, donorEmail, isAnonymous } = req.body;
    const donorId = req.payload.userId; // logged-in user from JWT

    // 1️⃣ Validate campaign
    const campaign = await campaigns.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    if (campaign.status === "closed") {
      return res.status(403).json({ message: "Campaign is closed" });
    }
    if (amount <= 0) {
      return res.status(400).json({ message: "Invalid donation amount" });
    }

    // 2️⃣ Create donation in PENDING status
    const donation = await donations.create({
      campaignId: id,
      donorId, // ← crucial for dashboards
      donorName,
      donorEmail,
      isAnonymous,
      amount,
      paymentStatus: 'paid'
    });

    // 3️⃣ Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: campaign.title,
            description: "Donation to campaign"
          },
          unit_amount: Math.round(amount * 100) // Stripe expects cents
        },
        quantity: 1
      }],
      success_url: 'http://localhost:5173/user/payement-success',
      cancel_url: 'http://localhost:5173/user/payement-error',
    });

    // 4️⃣ Save Stripe session ID in donation
    donation.stripeSessionId = session.id;
    await donation.save();
     const updatedCampaign = await campaigns.findByIdAndUpdate(id, { $inc: { totalRaised: amount } }, { new: true })

         if (updatedCampaign.totalRaised >= updatedCampaign.goalAmount) {
            updatedCampaign.status = "closed";
            await updatedCampaign.save();
        }

    // 5️⃣ Return checkout URL to frontend
    res.status(200).json({ checkoutURL: session.url });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};
//get donation history by user
exports.getDonationHistoryController = async (req, res) => {
    console.log("inside getDonationHistoryController");

    const userId = req.payload.userId; // authenticated user

    try {
        const donationHistory = await donations.find({ donorId: userId })
            .populate("campaignId", "title category fundraiserMail goalAmount")
            .sort({ createdAt: -1 }); // latest donations first

        res.status(200).json(donationHistory);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};

