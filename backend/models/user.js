const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    require: true,
    enum: ['admin', 'participant'],
  },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
