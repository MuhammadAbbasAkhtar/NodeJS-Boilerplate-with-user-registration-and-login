const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const {check} = require('express-validator');
const validate = require('../middlewares/validate');


router.get('/account', userController.myAccount)
router.put('/account/totp-setup', userController.setupOTP)
router.put('/account/totp-setup/verify',[
    check('token').not().isEmpty().withMessage('Please Enter code from Auth App'),
] ,validate, userController.verifyOTP)

router.put('/2fa/verify', [
    check('token').not().isEmpty().withMessage('Please Enter code from Auth App'),
], validate, userController.verify2FA)
module.exports = router; 