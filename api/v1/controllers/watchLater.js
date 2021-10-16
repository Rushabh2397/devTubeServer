import async from 'async'
import moment from 'moment'
import { User } from '../../../models'
import mongoose from 'mongoose'



module.exports = {

    /**
     * Api to create new playlist
    */


    addToWatchLater: (req, res) => {
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
                            watch_later: body.video_id
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
                message: 'Video added to watch later.'
            })
        })
    },


    removeFromWatchLater: (req, res) => {
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
                            watch_later: body.video_id
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
                    message: (err && err.message) || 'Oops! Failed to remove video from watch later.'
                })
            }

            res.json({
                status: 'success',
                message: 'Video removed successfully.',
                data: response
            })
        })
    },
    getUserWatchLater : (req,res)=>{
        async.waterfall([
            (nextCall)=>{
                User.findById(req.user._id).populate('watch_later').exec((err,user)=>{
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
                message: 'User watch later list.',
                data: response
            })
        })
    }

}