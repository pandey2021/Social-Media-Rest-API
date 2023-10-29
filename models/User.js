const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 20
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 10
    },
    gender: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    desc: {
        type: String,
        max: 50
    },
    from: {
        type: String,
        max: 30
    },
    relationship: {
        type: Number,
        enum: [1, 2, 3]
    }
},
    { timestamps: true }  // this will automatically manage when a document is created or updated
    // add two fields automatically: created_at, updated_at
);

module.exports = mongoose.model('users', userSchema);