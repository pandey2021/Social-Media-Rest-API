const dotevn = require('dotenv').config();
const jwt = require('jsonwebtoken');

let refreshTokens = [];

//middleware for authentication
function authenticate(req, res, next) {
    const authHeaders = req.headers.auth;
    if (authHeaders) {
        const token = authHeaders.split(" ")[1];
        if (!token) return res.status(401).send("Unauthorized access attempt");
        jwt.verify(token, process.env.accessSecretToken, (err, payload) => {
            if (err) {
                return res.status(403).send("Not a valid token");
            }
            req.payload = payload;
            next();
        });
    } else {
        res.status(401).send("Unauthorized access attempt");
    }
}

//generate access token

const generateAccessToken = (payload) => {
    const { iat, ...user } = payload;
    return jwt.sign(user, process.env.accessSecretToken, { expiresIn: "5m" });
}

// generate refresh token

const generateRefreshToken = (payload) => {
    const { iat, ...user } = payload;
    return jwt.sign(user, process.env.refreshSecretToken);
}

const saveRefreshToken = (refreshToken) => {
    refreshTokens.push(refreshToken)
}
const deleteRefreshToken = (refreshToken) => {
    refreshTokens.filter((token) => token !== refreshToken);
}
const isRefreshTokenAvailable = (refreshToken) => {
    return refreshTokens.includes(refreshToken);
}
module.exports = {
    authenticate, generateAccessToken, generateRefreshToken,
    saveRefreshToken, deleteRefreshToken, isRefreshTokenAvailable
};