const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const dotevn = require('dotenv');
const app = express();
require('./config');
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotevn.config();    // this will help to separate env variable from code and place them in .env file


//middleware
app.use(express.json());    // to stringfy the post/put body request
app.use(helmet());          // to add header for security purpose
app.use(morgan("common"));  // to log http request information

app.use("/posts", postRoute);
app.use("/auth", authRoute);
app.use("/user", userRoute);    // direct this to userRoute

app.listen(8080);