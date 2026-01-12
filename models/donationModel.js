const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "campaigns",
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 1
    },
     donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },

    donorName: {
      type: String,
      trim: true
    },

    donorEmail: {
      type: String,
      trim: true,
      lowercase: true
    },

    isAnonymous: {
      type: Boolean,
      default: false
    },

    stripeSessionId: {
      type: String
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

const donations = mongoose.model("donations", donationSchema);

module.exports = donations;
