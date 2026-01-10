const donations = require('../models/donationModel')
const campaigns = require('../models/campaignModel')
const stripe = require('stripe')(process.env.STRIPESECRET)

exports.donationPaymentController = async (req, res) => {
    console.log("inside donationPaymentController")
    const { id } = req.params
    const { amount, donorName, donorEmail, isAnonymous } = req.body;
    try {
        //validate campaign
        const campaign = await campaigns.findById(id)
        if (!campaign) {
            return res.status(404).json("campaign not found")
        }
        if (amount <= 0) {
            return res.status(400).json("invalid donation amount")
        }
        //create donation pending
        const donation = await donations.create({
            campaignId: id,
            amount,
            isAnonymous,
            paymentStatus: 'paid',
            donorName,
            donorEmail

        })
        
        //create stripe checkout session
        const line_items = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: campaign.title,
                    description: "Donation to campaign"

                },
                unit_amount: Math.round(amount * 100)

            },
            quantity: 1

        }]
        const session = await stripe.checkout.sessions.create({

            line_items,
            mode: 'payment',
            success_url: 'http://localhost:5173/user/payement-success',
            cancel_url: 'http://localhost:5173/user/payement-error',
            payment_method_types: ['card']

        });

        // 5️⃣ Save session ID
        donation.stripeSessionId = session.id;
        await donation.save();

        //update campaigns-totalraised
        const updatedCampaign = await campaigns.findByIdAndUpdate(id, { $inc: { totalRaised: amount } }, { new: true })

         if (updatedCampaign.totalRaised >= updatedCampaign.goalAmount) {
            updatedCampaign.status = "closed";
            await updatedCampaign.save();
        }

        
        console.log(session)
        res.status(200).json({ checkoutURL: session.url })


        //save stripe sessionID
        //send checkout url

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}