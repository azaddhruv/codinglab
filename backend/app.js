const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('cors');
//dotenv
require('dotenv').config();

//routes
const userRoutes = require('./routes/user');
const questionRoutes = require('./routes/question');
const compilersRoutes = require('./routes/compilers');
const tokenRoutes = require('./routes/token');

//middlewares
const { authenticateToken, authenticateRole } = require('./middleware');

//mongoose connect
mongoose.connect(`${process.env.MONGO_DB_URI}`);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  console.log('request recieved');
  res.send('Server Working');
});

//all routes
app.use('/', userRoutes);
app.use('/question', questionRoutes);
app.use('/compilers', compilersRoutes);
app.use('/verify-token', tokenRoutes);

app.listen(4000, () => {
  console.log('started listining on port 4000');
});
