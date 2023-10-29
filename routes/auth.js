const router = require('express').Router();
require('../models/User');
const User = require('../models/User');
const bcrypt = require('bcrypt');


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

        //save the user
        const data = await User.insertMany(newUser);
        res.status(200).send(data);
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

        res.status(200).send(userInfo);
    } catch (err) {
        res.status(500).send(err);
    }
});


module.exports = router;