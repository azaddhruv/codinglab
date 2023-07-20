const mongoose = require('mongoose');

const testcaseSchema = new mongoose.Schema({
  input: {
    type: String,
  },
  output: {
    type: String,
    required: true,
  },
  timelimit: {
    type: String,
  },
});

const Testcase = mongoose.model('Testcase', testcaseSchema);

module.exports = Testcase;
