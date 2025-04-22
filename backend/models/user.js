const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  role: { type: String, enum: ['customer', 'trainer', 'admin'], required: true },
  profile_picture: { type: String },

  membershipPlan: { type: String, default: '' },
  membershipExpiry: { type: Date },
  paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
