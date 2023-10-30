const mongoose = require('mongoose');
const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// update a user
// can update all details
router.put("/update/:id", async (req, res) => {
    if (req.params.id == req.payload._id || req.payload.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                res.status(500).send(err);
            }
        }
        try {
            let data = await User.updateOne(
                { "_id": new mongoose.Types.ObjectId(req.params.id) },
                {
                    $set: req.body
                }
            );
            res.status(200).send(data);
        } catch (err) {
            res.status(500).send(err);
        }
    } else {
        res.status(403).send("you can only update your info");
    }
});

// delete a user
router.delete("/delete/:id", async (req, res) => {
    if (req.params.id == req.payload._id || req.payload.isAdmin) {
        try {
            let data = await User.deleteOne(
                { "_id": new mongoose.Types.ObjectId(req.params.id) }
            );
            res.status(200).send(data);
        } catch (err) {
            res.status(500).send(err);
        }
    } else {
        res.status(403).send("you can only delete your account");
    }
});

// get a user

router.get("/find/:id", async (req, res) => {
    try {
        const data = await User.findById(req.params.id);
        // a way to hide unncessary details known as object destructuring
        const { password, updatedAt, createdAt, ...other } = data._doc;
        res.status(200).send(other);
    } catch (err) {
        res.status(500).send(err);
    }
});
// follow a user

router.put("/:id/follow", async (req, res) => {
    if (req.params.id !== req.payload._id) {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.id);
        if (!currentUser.followings.includes(user._id)) {
            try {
                await user.updateOne({ $push: { followers: req.body.id } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).send("updated successfully");
            } catch (err) {
                res.status(403).send(err);
            }
        } else {
            res.status(403).send("already followed");
            console.log("already followed");
        }
    } else {
        res.status(403).send("can't follow himself");
    }
});
// unfollow a user

router.put("/:id/unfollow", async (req, res) => {
    if (req.params.id !== req.payload._id) {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.id);
        if (currentUser.followings.includes(user._id)) {
            // console.log("how are this happening?")
            try {
                await user.updateOne({ $pull: { followers: req.body.id } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).send("updated successfully");
            } catch (err) {
                console.log(err);
                res.status(403).send(err);
            }
        } else {
            res.status(403).send("already unfollowed");
            console.log("already unfollowed");
        }
    } else {
        res.status(403).send("can't unfollow himself");
    }
});
module.exports = router;