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
                    req.user._id,
                    {
                        $push: {
                            playlist: newPlaylist
                        }
                    },
                    { new: true },
                    (err, user) => {
                        if (err) {
                            return nextCall(err)
                        }
                        let playlist = user.playlist.find(play=>play.name==body.name)
                        nextCall(null, playlist)
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
                message: 'Playlist created',
                data: response
            })
        })
    },

    addToPlaylist: (req, res) => {
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
                        _id: req.user._id,
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
                message: 'Video removed from playlist.',
                data: response
            })
        })
    },

    deletePlaylist: (req, res) => {
        async.waterfall([
            (nextCall) => {
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
    },

    getUserPlaylist : (req,res)=>{
        async.waterfall([
            (nextCall)=>{
                User.findById(req.user._id).populate('playlist.videos').exec((err,user)=>{
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
                    message : (err && err.message) || 'Oops! Failed to get user playlist'
                })
            }

            res.json({
                status:'success',
                message: 'User playlist',
                data: response
            })
        })
    }
}