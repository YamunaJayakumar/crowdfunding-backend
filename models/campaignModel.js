const mongoose = require('mongoose')
const campaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    beneficiary: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    longDescription: {
        type: String,
        required: true
    },
    goalAmount: {
        type: Number,
        required: true,
        min: [1, "Goal amount must be greater than 0"]
    },
    minDonation: {
        type: Number,
        min: [0, "Minimum donation cannot be negative"],
        default: 0
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: value => value > new Date(),
            message: "End date must be in the future"
        }

    },
    image: {
        type: String,

    },
    documents: {
        type: [String],
        required: true
    },
    status: {
        type: String,
        default: "pending"
    },
    promotionRequest: {
        type: Boolean,
        default: false
    },
    totalRaised: {
        type: Number,
        default: 0
    },
    fundraiserMail: {
        type: String,
        required: true
    },
    fundraiserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    isWithdrawn: {
        type: Boolean,
        default: false
    },

    withdrawnAmount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})
const campaigns = mongoose.model("campaigns", campaignSchema)
module.exports = campaigns