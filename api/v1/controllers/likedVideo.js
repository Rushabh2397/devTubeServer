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
                        _id: mongoose.Types.ObjectId("615f0eb05ec36ea7621230f7")
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
                req.user = { _id: "615f0eb05ec36ea7621230f7" }
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
    }
}