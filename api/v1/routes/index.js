import express from 'express'
const router = express.Router()
import  userAuthenticated from '../middlewares/userAuthenticated'
import isUserPresent from '../middlewares/isUserPresent'
import UserController from '../controllers/user'
import PlaylistController from '../controllers/playlist'
import LikedVideoController from '../controllers/likedVideo'
import WatchLaterController from '../controllers/watchLater'
const Validation = require('../../../validations')


router.all('/api/*',userAuthenticated,isUserPresent);

router.post('/auth/signup',Validation.register(),UserController.register)
router.post('/auth/login',Validation.login(),UserController.login)


// Playlist Api's
router.post('/api/create_playlist',PlaylistController.createPlaylist)
router.put('/api/add_to_playlist',PlaylistController.addToPlaylist)
router.put('/api/remove_from_playlist',PlaylistController.removeFromPlaylist)
router.post('/api/delete_playlist',PlaylistController.deletePlaylist)
router.get('/api/get_user_playlist',PlaylistController.getUserPlaylist)


// Liked Video Api's

router.put('/api/add_to_liked_videos',LikedVideoController.addToLikedVideos)
router.put('/api/remove_from_liked_videos',LikedVideoController.removeFromLikedVideos)
router.get('/api/get_user_liked_videos',LikedVideoController.getUserLikedVideos)

// Watch Later Video Api's
router.put('/api/add_to_watch_later',WatchLaterController.addToWatchLater)
router.put('/api/remove_from_watch_later',WatchLaterController.removeFromWatchLater)
router.get('/api/get_user_watch_later',WatchLaterController.getUserWatchLater)

// User Api's

router.get('/auth/get_all_videos',UserController.getAllVideos)
router.post('/auth/get_single_video',UserController.getSingleVideo)
router.get('/api/get_user_choices',UserController.getUserChoices)
router.post('/auth/search',UserController.searchVideo)



module.exports = router