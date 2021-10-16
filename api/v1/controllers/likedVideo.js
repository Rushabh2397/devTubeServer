import async from 'async'
import moment from 'moment'
import { User } from '../../../models'
import mongoose from 'mongoose'



module.exports = {

    /**
     * Api to create new playlist
    */


    addToLikedVideos: (req, res) => {
        async.waterfall([
            (nextCall) => {
                if (!req.body.video_id) {
                    return nextCall({
                        message: 'Video id is required.'
                    })
                }
                nextCall(null, req.body)
            },
            (body, nextCall) => {
                User.findOneAndUpdate(
                    {
                        _id: req.user._id
                    },
                    {
                        $addToSet: {
                            liked_videos: body.video_id
                        }
                    }
                    , (err, user) => {
                        if (err) {
                            return nextCall(err)
                        }
                        nextCall(null, body, user)
                    }
                )
            }

        ], (err, response) => {
            if (err) {
                return res.status(400).json({
                    message: (err && err.message) || 'Oops! Failed to add video to liked videos.'
                })
            }

            res.json({
                status: 'success',
                message: 'Video added to liked videos.'
            })
        })
    },


    removeFromLikedVideos: (req, res) => {
        async.waterfall([
            (nextCall) => {
                if (!req.body.video_id) {
                    return nextCall({
                        message: 'Video id is required.'
                    })
                }

                nextCall(null, req.body)
            },
            (body, nextCall) => {
                User.findOneAndUpdate(
                    {
                        _id: req.user._id
                    },
                    {
                        $pull: {
                            liked_videos: body.video_id
                        }
                    },
                    { new: true }
                ).exec((err, user) => {
                    if (err) {
                        return nextCall(err)
                    }
                    nextCall(null, user)
                })
            }

        ], (err, response) => {
            if (err) {
                return res.status(400).json({
                    message: (err && err.message) || 'Oops! Failed to remove video from playlist.'
                })
            }

            res.json({
                status: 'success',
                message: 'Video removed successfully.',
                data: response
            })
        })
    },

    getUserLikedVideos : (req,res)=>{
        async.waterfall([
            (nextCall)=>{
                User.findById(req.user._id).populate('liked_videos').exec((err,user)=>{
                    if(err){
                        return nextCall(err)
                    }
                    const response = {
                        playlist : user.playlist,
                        likedVideos : user.liked_videos,
                        watch_later : user.watch_later
                    }
                    nextCall(null,response)
                })
            }
        ],(err,response)=>{
            if(err){
                return res.status(400).json({
                    message : (err && err.message) || 'Oops! Failed to get user liked videos.'
                })
            }

            res.json({
                status:'success',
                message: 'User liked video list.',
                data: response
            })
        })
    }
}