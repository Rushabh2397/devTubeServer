import express from 'express'
const router = express.Router()
import  userAuthenticated from '../middlewares/userAuthenticated'
import isUserPresent from '../middlewares/isUserPresent'
import AdminController from '../controllers/admin'


router.all('api/*',userAuthenticated,isUserPresent);


// Admin's api

router.post('/auth/add_video',AdminController.addVideo)
router.put('/api/updateVideoDetail',AdminController.updateVideoDetail)
router.post('/api/delete_video',AdminController.deleteVideo)







module.exports = router