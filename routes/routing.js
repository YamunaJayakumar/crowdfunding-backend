const express =require('express')
const userController =require('../controllers/userController')
const jwtmiddleware =require('../middlewares/jwtmiddleware')
const campaignController =require('../controllers/campaignController')
const router=new express.Router()
const multerMiddleware =require('../middlewares/multerMiddleware')

//register
router.post('/register',userController.registerController)
//login
router.post('/login',userController.loginController)
//google-login
router.post('/google/sign-in',userController.googleLoginController)
//-------------------------authorised---------------------------------
//add campaign
router.post('/fundriser/campaign/create',jwtmiddleware,multerMiddleware.fields([
    {name:'image',maxCount:1},{name:'documents',maxCount:3}]),campaignController.addCampaignController)
module.exports=router