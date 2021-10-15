const { Schema, model } = require('mongoose')
const moment = require('moment');
const { encrypt } = require('../utils/encryDecry')


const videoSchema = new Schema({

    title: {
        type: String
    },
    url: {
        type: String
    },
    channel_name: {
        type: String
    },
    channel_image: {
        type: String
    },
    thumbnail: {
        type: String
    },
    length: {
        type: String
    },
    keywords: {
        type: Array
    },
    description: {
        type: String
    },
    created_at: {
        type: Date
    }
}, { collection: 'video' })

videoSchema.pre('save', function (next) {
    let video = this;
    //user.password = encrypt(user.password);
    video.created_at = moment().unix() * 1000;
    next()
})

module.exports = model(videoSchema.options.collection, videoSchema)