const express = require('express');
const router = express.Router();
const axios = require('axios');

//models
const User = require('../models/user');
const Question = require('../models/question');
const Testcase = require('../models/testcase');

//middlewares
const { authenticateRole, authenticateToken } = require('../middleware');

router.get('/', async (req, res) => {
  const question = await Question.find(
    {},
    { _id: 1, name: 1, body: 1, code: 1 }
  );
  res.json({ question });
});

router.get('/admin', authenticateToken, async (req, res) => {
  const question = await User.findById(req.user._id).populate('questions');

  if (!question?.questions)
    return res.json({ status: 'failed', message: 'No question found' });
  res.json({ questions: question.questions });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const question = await Question.findById(id).populate('testcases');
  if (question) {
    res.json({ question });
  } else {
    res.send('not ok');
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.json({ status: 'failed', message: 'Not an admin' });
    const { code, name, body } = req.body;

    const response = await axios.post(
      `https://45b722ce.problems.sphere-engine.com/api/v3/problems?access_token=${process.env.PROBLEM_API_TOKEN}`,
      {
        code: code,
        name: name,
        body: body,
      }
    );
    const question = new Question({ code, name, body, judge: req.user._id });
    await question.save();
    const user = await User.findById(req.user._id);
    user.questions.push(question);
    await user.save();
    res.json({ status: 'success', message: 'Question created successfully' });
  } catch (error) {
    console.log('error', error);
    res.json({ status: 'failed', message: error.response.data.message });
  }
});

router.put('/', authenticateToken, authenticateRole, async (req, res) => {
  try {
    const { code, name, body } = req.body;
    const question = await Question.findOne({ code }).populate('judge');

    const updateQuestion = await Question.findByIdAndUpdate(question._id, {
      name,
      body,
    });

    const response = await axios.put(
      `https://45b722ce.problems.sphere-engine.com/api/v3/problems/${code}?access_token=${process.env.PROBLEM_API_TOKEN}`,
      {
        name,
        body,
      }
    );
    // console.log(response, 'response');
    return res.json({ status: 'success', message: 'question updated' });
  } catch (error) {
    console.log('error', error);
    if (error.response.data.message) {
      return res.json({
        status: 'failed',
        message: error.response.data.message,
      });
    }
    res.json({ status: 'failed', message: 'Something went wrong' });
  }
});

router.delete(
  '/:code',
  authenticateToken,

  async (req, res) => {
    try {
      const { code } = req.params;
      console.log(code);
      const question = await Question.findOne({ code }).populate('judge');
      console.log(question, 'question');

      await Question.findOneAndRemove({ code });
      res.json({
        status: 'success',
        message: `question ${code} deleted successfully`,
      });
    } catch (error) {
      console.log('error', error);
      if (error?.response?.data?.message) {
        return res.json({
          status: 'failed',
          message: error.response.data.message,
        });
      }
      res.json({ status: 'failed', message: 'Something went wrong' });
    }
  }
);

router.post(
  '/testcase',
  authenticateToken,
  authenticateRole,
  async (req, res) => {
    try {
      const { code, input, output, timelimit } = req.body;
      const question = await Question.findOne({ code });
      const response = await axios.post(
        `https://45b722ce.problems.sphere-engine.com/api/v3/problems/${code}/testcases?access_token=${process.env.PROBLEM_API_TOKEN}`,
        {
          code,
          input: input ? input : '',
          output,
          timelimit: timelimit ? timelimit : '10',
        }
      );
      console.log(response, 'response from sphere');
      if (!response.data.number && response.data.number !== 0)
        return res.json({ status: 'failed', message: 'Something went wrong' });

      const testcase = new Testcase({ input, output, timelimit });
      question.testcases.push(testcase);
      await question.save();
      await testcase.save();
      res.json({ status: 'success', message: 'testcase added successfully' });
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        return res.json({
          status: 'failed',
          message: error.response.data.message,
        });
      }
      res.json({ status: 'failed', message: 'Something went wrong' });
    }
  }
);

router.post('/submission', authenticateToken, async (req, res) => {
  try {
    const { problemCode, source, compilerId, compilerVersionId = 1 } = req.body;
    const response = await axios.post(
      `https://45b722ce.problems.sphere-engine.com/api/v3/submissions?access_token=${process.env.PROBLEM_API_TOKEN}`,
      { problemCode, source, compilerId, compilerVersionId }
    );
    console.log(response, 'response');

    if (!response.data.submissionId)
      return res.json({ status: 'failed', message: 'something went wrong' });

    let result;
    do {
      result = await axios.get(
        `https://45b722ce.problems.sphere-engine.com/api/v3/submissions/${response.data.submissionId}?access_token=${process.env.PROBLEM_API_TOKEN}`
      );
    } while (
      result.data.result.status === 'running...' ||
      result.data.result.status === 'running master judge...' ||
      result.data.result.status === 'compiling...'
    );

    res.json({ result: result.data.result });
  } catch (error) {
    console.log(error);
    if (error?.response?.data?.message) {
      return res.json({
        status: 'failed',
        message: error.response.data.message,
      });
    }
    res.json({ status: 'failed', message: 'Something went wrong' });
  }
});

module.exports = router;
