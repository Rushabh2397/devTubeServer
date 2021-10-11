import async from 'async'
import { response } from 'express'
import { Video } from '../../../models'



module.exports = {


    addVideo: (req, res) => {
        async.waterfall([
            (nextCall) => {
                if (!req.body.url || !req.body.title || !req.body.description || !req.body.creator || !req.body.description) {
                    return nextCall({
                        message: 'Missing Parameter'
                    })
                }
                nextCall(null, req.body)
            },
            (body, nextCall) => {
                let newVideo = new Video(body);
                newVideo.save((err, video) => {
                    if (err) {
                        return nextCall(err)
                    }

                    nextCall(null, video)
                })
            }
        ], (err, response) => {
            if (err) {
                return res.status(400).json({
                    message: (err && err.message) || 'Oops! Failed to saved the video info.'
                })
            }

            res.json({
                status: 'success',
                message: 'Video information',
                data: response
            })
        })
    },

    updateVideoDetail: (req, res) => {
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
                Video.findById(body.video_id, (err, video) => {
                    if (err) {
                        return nextCall(err)
                    } else if (video) {
                        nextCall(null, video)
                    } else {
                        nextCall({
                            message: 'Video not found.'
                        })
                    }
                })
            },
            (body, video, nextCall) => {
                Video.findByIdAndUpdate(
                    body.video_id,
                    {
                        title: body.title ? body.title : video.title,
                        url: body.url ? body.url : video.url,
                        length: body.length ? body.length : video.length,
                        keywords: body.keywords ? body.keywords : video.keywords,
                        description: body.description ? body.description : video.description
                    },
                    { new: true },
                    (err, updatedVideInfo) => {
                        if (err) {
                            return nextCall(err)
                        }

                        nextCall(null, updatedVideInfo)
                    }
                )
            }
        ], (err, response) => {
            if (err) {
                return res.status(400).json({
                    message: (err && err.message) || 'Oops! Failed to saved the video info.'
                })
            }

            res.json({
                status: 'success',
                message: 'Video information',
                data: response
            })
        })
    },

    deleteVideo: (req, res) => {
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
                Video.findByIdAndDelete(body.video_id, (err) => {
                    if (err) {
                        return nextCall(err)
                    }
                    nextCall(null, null)
                })
            }
        ], (err, response) => {
            if (err) {
                return res.status(400).json({
                    message: (err && err.message) || 'Oops! Failed to delete the video.'
                })
            }

            res.json({
                status: 'success',
                message: 'Video deleted successfully.'
            })
        })
    }
}