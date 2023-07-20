const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  const foundUser = await User.find({ email });
  if (foundUser && foundUser.length) {
    return res.json({ status: 'failed', message: 'user already exists' });
  }
  const hashedPassowrd = await bcrypt.hash(password, 12);
  const user = new User({ name, email, password: hashedPassowrd, role });
  await user.save();
  const accessToken = jwt.sign(
    { email, role, _id: user._id },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
  res.json({
    status: 'success',
    message: 'User Created',
    accessToken,
    email,
    role,
  });
});

router.post('/login', async (req, res) => {
  console.log('incoming login request');
  const { email, password } = req.body;
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    return res.json({
      status: 'failed',
      message: 'email or password is incorrect',
    });
  }
  const matchPassword = await bcrypt.compare(password, foundUser.password);
  if (!matchPassword) {
    return res.json({
      status: 'failed',
      message: 'email or password is incorrect',
    });
  }

  const accessToken = jwt.sign(
    { email, role: foundUser.role, _id: foundUser._id },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
  res.json({
    status: 'success',
    message: 'User Logged in',
    accessToken,
    email,
    role: foundUser.role,
  });
});

module.exports = router;
