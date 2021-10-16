import async from 'async';
import moment from 'moment'
import mongoose from 'mongoose'
import { User, Video } from '../../../models'
const { decrypt, encrypt } = require('../../../utils/encryDecry')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('../../../config')


module.exports = {

    register: (req, res) => {
        async.waterfall([
            (nextCall) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return nextCall({ message: errors.errors[0].msg });
                }
                nextCall(null, req.body)
            },
            (body, nextCall) => {
                User.findOne({ email: body.email }, (err, user) => {
                    if (err) {
                        nextCall(err)
                    } else if (user) {
                        nextCall({ message: 'Email already exist.' })
                    } else {
                        nextCall(null, body)
                    }
                })
            },
            (body, nextCall) => {
                req.body.email = req.body.email.toLowerCase();
                let user = new User(body)
                user.save((err, data) => {
                    if (err) {
                        return nextCall(err)
                    }
                    nextCall(null, data)
                })
            }
        ], (err, response) => {
            if (err) {
                return res.status(400).json({
                    message: (err && err.message) || 'Oops! Failed to register user. '
                })
            }

            res.json({
                status: 'success',
                message: 'User registered successfully.',
                data: response
            })
        })
    },
    login: (req, res) => {
        async.waterfall([
            (nextCall) => {
                req.body.email = req.body.email.toLowerCase();
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return nextCall({ message: errors.errors[0].msg });
                }
                nextCall(null, req.body)
            },
            (body, nextCall) => {
                User.findOne({ email: body.email }, (err, user) => {
                    if (err) {
                        return nextCall(err)
                    } else if (!user) {
                        return nextCall({ message: 'Please check your username and password.' })
                    } else {
                        let result = decrypt(body.password, user.password)
                        if (result) {
                            nextCall(null, user)
                        } else {
                            return nextCall({ message: 'Please check your username and password.' })
                        }
                    }
                })
            },
            (user, nextCall) => {
                let jwtData = {
                    _id: user._id,
                    email: user.email
                }
                user = user.toJSON()
                user.token = jwt.sign(jwtData, config.secret, {
                    expiresIn: 60 * 60 * 24
                })
                delete user['password']
                nextCall(null, user)
            }
        ], (err, response) => {
            if (err) {
                return res.status(400).json({
                    message: (err && err.message) || 'Oops! Failed to login. '
                })
            }

            res.json({
                status: 'success',
                message: 'User logged in successfully.',
                data: response
            })
        })
    },

    getAllVideos: (req, res) => {
        console.log("req".req.body)
        async.waterfall([
            (nextCall) => {
                Video.find({}, (err, videos) => {
                    if (err) {
                        console.log("err",err)
                        return nextCall(err)
                    }
                    nextCall(null, videos)
                })
            }
        ], (err, response) => {
            if (err) {
                console.log("err",err)
                return res.status(400).json({
                    message: (err && err.message) || 'Oops! Failed to get videos. '
                })
            }

            res.json({
                status: 'success',
                message: 'Video list',
                data: response
            })
        })
    },

    getSingleVideo: (req, res) => {
        async.waterfall([
            (nextCall) => {
                Video.findById(req.body.video_id, (err, video) => {
                    if (err) {
                        return nextCall(err)
                    }
                    nextCall(null, video)
                })
            }
        ], (err, response) => {
            if (err) {
                return res.status(400).json({
                    message: (err && err.message) || 'Oops! Failed to get video. '
                })
            }

            res.json({
                status: 'success',
                message: 'Video Info',
                data: response
            })
        })
    },

    getUserChoices : (req, res) => {
        async.waterfall([
            (nextCall) => {
                User.findById(req.user._id).exec((err, user) => {
                    if (err) {
                        return nextCall(err)
                    }
                    const response = {
                        playlist : user.playlist,
                        likedVideos : user.liked_videos,
                        watch_later : user.watch_later
                    }
                    nextCall(null, response)
                })
            }
        ], (err, response) => {
            if (err) {
                return res.status(400).json({
                    message: (err && err.message) || 'Oops! Failed to get video. '
                })
            }

            res.json({
                status: 'success',
                message: 'Video Info',
                data: response
            })
        })
    },

    searchVideo  : (req,res)=>{
        async.waterfall([
            (nextCall)=>{
                let aggregateQuery = [];

                let regex = new RegExp(req.body.searchTerm, 'i')
          
                let search = {
                    $or: [
                        {
                          'title': regex
                        },
                        {
                          'channel_name': regex
                        },
                        {
                            'keywords': regex
                        }
                      ]
                }
          
                aggregateQuery.push({
                    '$match': search
                })

                Video.aggregate(aggregateQuery).exec((err,list)=>{
                    if(err){
                        return nextCall(err)
                    }
                    nextCall(null,list)
                })
            }
        ],(err,response)=>{
            if (err) {
                return res.status(400).json({
                    message: (err && err.message) || 'Oops! Failed to perform search. '
                })
            }

            res.json({
                status: 'success',
                message: 'Search Result',
                data: response
            })
        })
    }

}