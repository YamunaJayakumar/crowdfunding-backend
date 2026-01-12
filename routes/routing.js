const express =require('express')
const userController =require('../controllers/userController')
const jwtmiddleware =require('../middlewares/jwtmiddleware')
const campaignController =require('../controllers/campaignController')
const router=new express.Router()
const multerMiddleware =require('../middlewares/multerMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const adminController=require('../controllers/adminController')
const donationController =require('../controllers/donationController')
const withdrawalController=require('../controllers/withdrawalController')



//register
router.post('/register',userController.registerController)
//login
router.post('/login',userController.loginController)
//google-login
router.post('/google/sign-in',userController.googleLoginController)

//view one campaign
router.get('/campaign/view/:id',campaignController.viewCampaignController)
//make donation
router.post('/campaign/:id/donate',jwtmiddleware,donationController.donationPaymentController)
//get latest campaign
// router.get('/campaign/latest',campaignController.getLatestCampaignForUserController)


//get all active campaign
router.get('/campaigns/acive/all',jwtmiddleware,campaignController.getAllActiveCampaignForUserController)
//get latest campaign
router.get('/campaign/latest',jwtmiddleware,campaignController.getLatestCampaignForUserController)
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
//request withdrwal
router.post('/withdraw/:id/request',jwtmiddleware,withdrawalController.withdrwalRequestController)
//get withdrawal history
router.get('/:id/withdrawal/history',jwtmiddleware,withdrawalController.getWithdrwalStatusController)
//get donation history
router.get('/:id/donation/history',jwtmiddleware,donationController.getDonationHistoryController )

//------------------------------------------------authorised admin------------------------------------------------------------------


//edit admin profile
router.put('/admin/profile/edit',adminMiddleware,multerMiddleware.single('picture'),adminController.updateAdminProfileController)
//get all campaign by admin
router.get('/admin/campaign/all',adminMiddleware,adminController.getAllCampaignAdminController)
//getPending Campaign
router.get('/admin/campaign/pending',adminMiddleware,adminController.getPendingCampaignController)
//admin-get Camapign By id
router.get('/admin/:id/view',adminMiddleware,adminController.getCampaignByIdController)
//admin-approve Campaign
router.put('/admin/:id/approve',adminMiddleware,adminController.approveCampaignController)
//admin-reject Campaign
router.put('/admin/:id/reject',adminMiddleware,adminController.rejectCampaignController)
//donation history
router.get('/admin/donations/history',adminMiddleware,adminController.adminDonationHistoryController)
//get all pending Withdrawal request
router.get('/admin/withdrawal/all',adminMiddleware,adminController.allPendingWithdrawalController)
//approve withdrwal Controller
router.put('/admin/withdrawal/:id/approve',adminMiddleware,adminController.approveWithdrawalController)



module.exports=router