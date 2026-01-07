const express =require('express')
const userController =require('../controllers/userController')
const router=new express.Router()

//register
router.post('/register',userController.registerController)
//login
router.post('/login',userController.loginController)
//google-login
router.post('/google/sign-in',userController.googleLoginController)
module.exports=router