const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Customer = require('../models/customer');
const Trainer = require('../models/trainer');
const { generateToken } = require('../config/jwt');
const upload = require('../middleware/Upload');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Register Route
router.post('/register', upload.single('profilePicture'), async (req, res) => {
  try {
    const {
      username, email, password, mobile, role,
      experience, age, weight, height, body_type,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const profile_picture = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/profile_pictures/${req.file.filename}`
      : null;

    const user = new User({
      username, email, password: hashedPassword, mobile, role, profile_picture
    });
    await user.save();

    if (role === 'trainer') {
      if (!experience || !age) return res.status(400).json({ error: 'Experience and age are required for trainers' });
      const trainer = new Trainer({ user_id: user._id, experience, age, customers: [] });
      await trainer.save();
    } else if (role === 'customer') {
      if (!weight || !height || !body_type) return res.status(400).json({ error: 'Weight, height, and body type are required for customers' });
      const customer = new Customer({ user_id: user._id, weight, height, body_type });
      await customer.save();
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    let isTrainer = false;
    if (user.role === 'trainer') {
      const trainer = await Trainer.findOne({ user_id: user._id });
      isTrainer = !!trainer;
    }

    const token = generateToken({ userId: user._id, role: user.role });
    res.json({ token, role: user.role, isTrainer, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Basic User Info
router.get('/getuser/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('username email role');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Full Profile
router.get('/:id/full-profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    let fullProfile = {
      ...user,
      membershipPlan: user.membershipPlan || '',
      membershipExpiry: user.membershipExpiry || '',
      hasPaid: user.paymentStatus || '',
    };

    if (user.role === 'customer') {
      const cust = await Customer.findOne({ user_id: user._id })
        .populate({
          path: 'assignedTrainer',
          populate: {
            path: 'user_id',
            model: 'User',
            select: 'username'
          }
        })
        .lean();

      if (cust) {
        fullProfile = {
          ...fullProfile,
          weight: cust.weight,
          height: cust.height,
          body_type: cust.body_type,
          assigned_trainer: cust.assignedTrainer?.user_id?.username || null,
        };
      }

    } else if (user.role === 'trainer') {
      const tr = await Trainer.findOne({ user_id: user._id })
        .populate({
          path: 'customers',
          model: 'Customer',
          populate: {
            path: 'user_id',
            model: 'User',
            select: 'username email'
          }
        })
        .lean();

      if (tr) {
        fullProfile = {
          ...fullProfile,
          experience: tr.experience,
          age: tr.age,
          specialization: tr.specialization,
          customers: tr.customers.map(c => ({
            username: c.user_id?.username || '',
            email: c.user_id?.email || '',
          })),
          numberOfCustomers: tr.customers.length  // 👈 Add this line
        };
      }
    }

    res.json({ fullProfile });
  } catch (error) {
    console.error("Error in full-profile route:", error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});





// Update Full Profile
router.put('/:id/full-profile/update', verifyToken, async (req, res) => {
  try {
    const { userData, profileData } = req.body;
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(userId, userData, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.role === 'customer') {
      await Customer.findOneAndUpdate({ user_id: userId }, profileData, { new: true });
    } else if (user.role === 'trainer') {
      await Trainer.findOneAndUpdate({ user_id: userId }, profileData, { new: true });
    }

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// Delete User
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await Customer.findOneAndDelete({ user_id: userId });
    await Trainer.findOneAndDelete({ user_id: userId });

    res.status(200).json({ message: 'User and related profiles deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

module.exports = router;
