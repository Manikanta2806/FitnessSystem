const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    body_type: { type: String, required: true },
    assignedTrainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
