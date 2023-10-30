const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    desc: {
        type: String,
        max: 500
    },
    img: {
        type: String,
    },
    likes: {
        type: Array,
        default: []
    },
    
},
    { timestamps: true }  // this will automatically manage when a document is created or updated
    // add two fields automatically: created_at, updated_at
);

module.exports = mongoose.model('posts', postSchema);