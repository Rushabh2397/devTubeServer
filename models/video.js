const { Schema, model } = require('mongoose')
const moment = require('moment');
const { encrypt } = require('../utils/encryDecry')


const userSchema = new Schema({

    title: {
        type: String
    },
    url:{
      type: String
    },
    creator: {
        type: String
    },
    length: {
        type: String
    },
    keywords:{
        type: Array
    },
    description:{
       type: String 
    },
    created_at: {
        type: Date
    }
}, { collection: 'video' })

userSchema.pre('save', function (next) {
    let user = this;
    user.password = encrypt(user.password);
    user.created_at = user.updated_at = moment().unix() * 1000;
    next()
})

module.exports = model(userSchema.options.collection, userSchema)