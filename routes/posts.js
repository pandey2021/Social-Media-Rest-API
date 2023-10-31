const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const Post = require('../models/Posts');
const User = require('../models/User');


//create a post
router.post("/create", async (req, res) => {
    try {
        let newPost = new Post({
            userId: req.body.userId,
            desc: req.body.desc,
            img: req.body.img,
        });
        const data = await Post.insertMany(newPost);
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send(err);

    }
});


//update a post
router.put("/update/:id", async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (post.userId === req.payload._id) {
            try {
                const data = await Post.updateOne(
                    { _id: new mongoose.Types.ObjectId(req.params.id) },
                    { $set: req.body }
                );
                res.status(200).send(data);
            } catch (err) {
                res.status(500).send(err);

            }
        } else {
            res.status(403).send("can't update others post");
        }
    } catch (err) {
        res.status(500).send(err);
    }

});


//delete a post
router.delete("/delete/:id", async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        console.log(post.userId, req.body.userId);
        if (post.userId === req.payload._id) {
            try {
                const data = await post.deleteOne();
                res.status(200).send(data);
            } catch (err) {
                res.status(500).send(err);

            }
        } else {
            res.status(403).send("can't delete others post");
        }
    } catch (err) {
        res.status(500).send(err);
    }

});


//like a post
router.put("/like/:id", async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        console.log(post.likes.includes(req.body.userId));
        if (!post.likes.includes(req.body.userId)) {
            const data = await post.updateOne({ $push: { "likes": req.body.userId } });
            res.status(200).send(data);
        } else {
            const data = await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).send(data);
        }
    } catch (err) {
        res.status(500).send(err);
    }
})
//get a post

router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).send(post);
    } catch (err) {
        res.status(500).send(err);
    }
});


//get timeline post
router.get('/timeline/all', async (req, res) => {

    try {
        let currentUser = await User.findById(req.body.id);
        const userpost = await Post.find({ userId: req.body.id });
        let friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        res.status(200).send(userpost.concat(...friendPosts));
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;