const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  testcases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Testcase' }],
  judge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
