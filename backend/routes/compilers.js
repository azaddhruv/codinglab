const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  const response = await axios.get(
    `https://45b722ce.problems.sphere-engine.com/api/v3/compilers?access_token=${process.env.PROBLEM_API_TOKEN}`
  );
  res.json({ response: response.data });
});

module.exports = router;
