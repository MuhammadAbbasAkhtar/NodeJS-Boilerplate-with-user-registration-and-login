
const helper = require('../helpers/common')
const userService = require('../services/userService')
const speakeasy = require('speakeasy')
const authService = require('../services/authService')
const myAccount = async (req, res) => {
    try{
        const account_details = await userService.getUserByIdWithfields(req.user._id, '-password -updatedAt -role -OTP_temp_secret -OTP_secret')
        if(!account_details) return helper.sendResponseMsg(res, "Account details could not be fetched", false)
        return helper.sendResponse(res, {account_details, success:true})
    } catch(e){
        helper.prettyLog(`catching ${e}`)
        helper.log2File(e.message,'error')
        return helper.sendResponse(res, 500, {message:e.message, success:false})
    }
}
const setupOTP = async (req, res) => {
    try{
        const temp_secret = speakeasy.generateSecret()
        await userService.add_OTP_temp_secret(req.user._id, temp_secret)
        var qrImage = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + temp_secret.otpauth_url;
        return helper.sendResponse(res, {secret:temp_secret, qrImage, success:true})
    }catch(e){
        helper.prettyLog(`catching ${e}`)
        helper.log2File(e.message,'error')
        return helper.sendResponse(res, 500, {message:e.message, success:false})
    }
}
const verifyOTP = async (req, res) => {
    try{
        const {token} = req.body
        const user = await userService.getOTPTempSecret(req.user._id)
        // console.log('user', user);
        const verified = speakeasy.totp.verify({
            secret:user.OTP_temp_secret.base32,
            encoding: 'base32',
            token
        })
        if(!verified) return helper.sendResponse(res, {message: "2FA setup failed! Please Setup again", success:false})
        
        await userService.add_OTP_secret(req.user._id, user.OTP_temp_secret);
        return helper.sendResponse(res, {message: "2FA successfully enabled", success:true})
        
    }catch(e){
        helper.prettyLog(`catching ${e}`)
        helper.log2File(e.message,'error')
        return helper.sendResponse(res, 500, {message:e.message, success:false})
    }
}
const verify2FA = async (req, res) => {
    try{
        var {token} = req.body
        const user = await userService.getOTPSecret(req.user._id)
        const verified = speakeasy.totp.verify({
            secret:user.OTP_secret.base32,
            encoding: 'base32',
            token
        })
        token = await authService.generateToken(user)
        
        if(!verified) return helper.sendResponse(res, {message: "2FA auth failed! Please enter code again", success:false})
        return helper.sendResponse(res, {token, success:true})
    } catch(e){
        helper.prettyLog(`catching ${e}`)
        helper.log2File(e.message,'error')
        return helper.sendResponse(res, 500, {message:e.message, success:false})
    }
}
module.exports = {
    myAccount,
    setupOTP,
    verifyOTP,
    verify2FA
}