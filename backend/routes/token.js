const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  const { accessToken } = req.body;
  jwt.verify(accessToken, process.env.SECRET, async (err, user) => {
    if (err) {
      console.log(err);
      return res
        .json({ status: 'failed', message: 'unauthorized' })
        .status(401);
    } else {
      const fuser = await User.findById(user._id);
      if (!fuser)
        return res
          .json({ status: 'failed', message: 'unauthorized' })
          .status(401);

      return res.json({
        status: 'success',
        message: 'token verified',
        accessToken,
        email: user.email,
        role: user.role,
      });
    }
  });
});

module.exports = router;
