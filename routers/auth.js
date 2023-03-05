const express = require('express');

const router = express.Router();
const {createOrloginUser, verifyPhoneOtp, resendOtp, checkAuth }  = require('../controllers/auth');
const { checkAuthentication } = require('../middlewares/auth');

router.post('/login', createOrloginUser);
router.post('/otp_verify', verifyPhoneOtp);
router.get('/opt_resend', resendOtp);
router.get('/check', checkAuthentication, checkAuth);

module.exports = router;
