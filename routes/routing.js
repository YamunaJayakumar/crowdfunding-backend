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
router.post('/fundraiser/campaign/create',jwtmiddleware,multerMiddleware.fields([
    {name:'image', maxCount:1},{name:'documents',maxCount:3}]),campaignController.addCampaignController)
//edit campaign
router.put('/fundraiser/campaign/:id/edit',jwtmiddleware,multerMiddleware.fields([
    {name:'image', maxCount:1},{name:'documents',maxCount:3}]),campaignController.editCampaignController)
//get all campaign-fundraiser
router.get('/fundraiser/campaign/all',jwtmiddleware,campaignController.fundraiserGetAllCampaignController)
//get a campaign
router.get('/fundraiser/campaign/:id/view',jwtmiddleware,campaignController.getACampignController)
//delete campaign-fundraiser
router.delete('/fundraiser/:id',jwtmiddleware,campaignController.fundraiserRemoveCampaignController)
//update fundraiserProfile
router.put("/fundraiser/:id/edit",jwtmiddleware,multerMiddleware.single('picture'),userController.updateFundraiserProfile)

module.exports=router