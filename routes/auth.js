const router = require('express').Router();
require('../models/User');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require("../jwt_token/token")

//REGISTER
router.post("/register", async (req, res) => {
    try {
        // Usually if we didn't hashed the password, then password of the user is visible 
        // in the database which is bad for security purpose.
        // salt: a random value combined with the password before hashing
        // 10: round to generate salt: more round-> more computation
        // second function generates the hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        //create newuser
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
            gender: req.body.gender
        });
        const accessToken = jwt.generateAccessToken(newUser._doc);
        const refreshToken = jwt.generateRefreshToken(newUser._doc);
        jwt.saveRefreshToken(refreshToken);
        //save the user
        const data = await User.insertMany(newUser);
        res.status(200).send({data, accessToken, refreshToken});
    } catch (err) {
        res.status(500).send(err);
    }

});

//LOGIN
//Note: We are not checking for if username field is empty. this can be validated in html
router.post("/login", async (req, res) => {
    try {
        const username = req.body.username;
        const userpass = req.body.password;
        const userInfo = await User.findOne({ "username": username });
        !userInfo && res.status(404).send("user not found");
        const isValidLogin = await bcrypt.compare(userpass, userInfo.password);
        !isValidLogin && res.status(400).send("incorrect username or password");
        // jwt.deleteRefreshToken(refreshToken);
        const accessToken = jwt.generateAccessToken(userInfo._doc);
        const refreshToken = jwt.generateRefreshToken(userInfo._doc);
        jwt.saveRefreshToken(refreshToken);
        res.status(200).send({userInfo,accessToken,refreshToken});
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/logout", jwt.authenticate, (req,res)=>{
    try{
        const refreshToken = req.body.refreshToken;
        jwt.deleteRefreshToken(refreshToken);
        res.status(200).send(req.payload.username + " logout successfully");
    }catch(err){
        res.status(500).send(err);
    }
})

module.exports = router;