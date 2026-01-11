const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "campaigns",
    required: true
  },
  fundraiserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  fundraiserMail: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  bankDetails: {
    accountHolderName: {
      type: String,
      required: true
    },
    accountNumber: {
      type: String,
      required: true
    },
    ifscCode: {
      type: String,
      required: true
    },
    bankName: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  adminRemark: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

const withdrawals = mongoose.model("withdrawals", withdrawSchema);
module.exports = withdrawals;
