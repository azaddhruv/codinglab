const jwt = require('jsonwebtoken');
const Question = require('./models/question');
const User = require('./models/user');

//authneticate toke and diffrentiate between roles
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  jwt.verify(token, process.env.SECRET, async (err, user) => {
    if (err) {
      console.log(err);
      return res
        .json({ status: 'failed', message: 'unauthorized' })
        .status(401);
    }

    const fuser = await User.findById(user._id);
    if (!fuser)
      return res
        .json({ status: 'failed', message: 'unauthorized' })
        .status(401);

    req.user = user;
    next();
  });
};

//this middleware checks the role, checks if the question exists, and check judge id to be same as user id
const authenticateRole = async (req, res, next) => {
  if (req.user.role !== 'admin')
    return res.json({ status: 'failed', message: 'Not an admin' });

  const { code } = req.body;
  const question = await Question.findOne({ code });

  if (!question)
    return res.json({ status: 'failed', message: 'Problem does not exist' });

  if (String(question.judge._id) !== String(req.user._id))
    return res.json({ status: 'failed', message: 'not master judge' });

  next();
};

module.exports = { authenticateToken, authenticateRole };
