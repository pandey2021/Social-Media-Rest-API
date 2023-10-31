const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const dotevn = require('dotenv');
const jwt = require('jsonwebtoken');
const app = express();
require('./config');
const jwt_token = require('./jwt_token/token');
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotevn.config();    // this will help to separate env variable from code and place them in .env file

app.use(express.json());    // to stringfy the post/put body request
app.use(helmet());          // to add header for security purpose
app.use(morgan("common"));  // to log http request information



app.use("/posts", jwt_token.authenticate, postRoute);
app.use("/auth", authRoute);
app.use("/user", jwt_token.authenticate, userRoute);    // direct this to userRoute

app.post("/api/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.status(401).send("please provide token");
    if (!jwt_token.isRefreshTokenAvailable(refreshToken)) return res.status(403).send("not a valid token");
    jwt.verify(refreshToken, process.env.refreshSecretToken, (err, payload) => {
        if (err) {
            return res.status(400).send(err);
        }

        const newAccessToken = jwt_token.generateAccessToken(payload);
        const newRefreshToken = jwt_token.generateRefreshToken(payload);
        jwt_token.deleteRefreshToken(refreshToken);
        jwt_token.saveRefreshToken(newRefreshToken);
        res.status(200).send({ "accessToken": newAccessToken, "refreshToken": newRefreshToken });
    });
})

app.listen(8080);