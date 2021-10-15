import async from 'async'
import moment from 'moment'
import { User } from '../../../models'
import mongoose from 'mongoose'



module.exports = {

    /**
     * Api to create new playlist
    */

    createPlaylist: (req, res) => {
        async.waterfall([
            (nextCall) => {
                //req.user._id="615f0eb05ec36ea7621230f7"
                if (!req.body.name) {
                    return nextCall({
                        message: 'Playlist name is required.'
                    })
                }

                nextCall(null, req.body)
            },
            (body, nextCall) => {
                let newPlaylist = {
                    name: body.name,
                    videos: [],
                    created_at: moment().unix() * 1000
                }
                User.findByIdAndUpdate(
                    "615f0eb05ec36ea7621230f7",
                    {
                        $push: {
                            playlist: newPlaylist
                        }
                    },
                    { new: true },
                    (err, playlist) => {
                        if (err) {
                            return nextCall(err)
                        }
                        nextCall(null, null)
                    }
                )
            }
        ], (err, response) => {
            if (err) {
                return res.status(400).json({
                    message: (err && err.message) || 'Oops! Failed to create new playlist'
                })
            }

            res.json({
                status: 'success',
                message: 'Playlist created'
            })
        })
    },

    addToPlaylist: (req, res) => {
        console.log("body",req.body)
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
                        _id: mongoose.Types.ObjectId("615f0eb05ec36ea7621230f7"),
                        "playlist._id": body.playlist_id
                    },
                    {
                        $addToSet: {
                            "playlist.$.videos": body.video_id
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
                    message: (err && err.message) || 'Oops! Failed to add video to playlist.'
                })
            }

            res.json({
                status: 'success',
                message: 'Video to added.'
            })
        })
    },


    removeFromPlaylist: (req, res) => {
        async.waterfall([
            (nextCall) => {
                req.user = { _id: "615f0eb05ec36ea7621230f7" }
                if (!req.body.playlist_id || !req.body.video_id) {
                    return nextCall({
                        message: 'Playlist/Video id is required.'
                    })
                }

                nextCall(null, req.body)
            },
            (body, nextCall) => {
                User.findOneAndUpdate(
                    {
                        _id: req.user._id,
                        "playlist._id": body.playlist_id
                    },
                    {
                        $pull: {
                            "playlist.$.videos": body.video_id
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

    deletePlaylist: (req, res) => {
        async.waterfall([
            (nextCall) => {
                req.user = { _id: "615f0eb05ec36ea7621230f7" }
                if (!req.body.playlist_id) {
                    return nextCall({
                        message: 'Playlist id is required.'
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
                            "playlist":{_id:body.playlist_id} 
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
                    message: (err && err.message) || 'Oops! Failed to delete playlist.'
                })
            }

            res.json({
                status: 'success',
                message: 'Playlist deleted successfully.',
                data: response
            })
        })
    }
}