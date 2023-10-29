const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
console.log(process.env.mongoDB_URL);
mongoose.connect(process.env.mongoDB_URL);
