import express from 'express'
const router = express.Router()
import  userAuthenticated from '../middlewares/userAuthenticated'
import isUserPresent from '../middlewares/isUserPresent'
import UserController from '../controllers/user'
import PlaylistController from '../controllers/playlist'
import LikedVideoController from '../controllers/likedVideo'
const Validation = require('../../../validations')


router.all('api/*',userAuthenticated,isUserPresent);

router.post('/auth/signup',UserController.register)
router.post('/auth/login',Validation.login(),UserController.login)


// Playlist Api's
router.post('/auth/create_playlist',PlaylistController.createPlaylist)
router.put('/auth/add_to_playlist',PlaylistController.addToPlaylist)
router.put('/auth/remove_from_playlist',PlaylistController.removeFromPlaylist)
router.post('/auth/delete_playlist',PlaylistController.deletePlaylist)

// Liked Video Api's

router.put('/auth/add_to_liked_videos',LikedVideoController.addToLikedVideos)
router.put('/auth/remove_from_liked_videos',LikedVideoController.removeFromLikedVideos)


// User Api's

router.get('/auth/get_all_videos',UserController.getAllVideos)
router.post('/auth/get_single_video',UserController.getSingleVideo)
router.get('/auth/get_user_choices',UserController.getUserChoices)



module.exports = router