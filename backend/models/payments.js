const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan_name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount must be positive"],
    },
    membership_type: {
      type: String,
      required: true,
      enum: ["basic", "standard", "premium", "trainer_assisted"],
    },
    transaction_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    assigned_trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    payment_status: {
      type: String,
      default: "successful",
      enum: ["successful", "failed", "pending"],
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
