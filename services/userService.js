const User = require('../models/user');
var ObjectID = require('mongoose').Types.ObjectId; 

const hiddedField =  ['-password' ]

const addUser = async data => { return await new User(data).save() }

const getUserByEmail = async email => { return User.findOne({email}) }

const getUserByID = async id => {return await User.findById(id)}

const getUserByIdWithfields = async (id, fields) => { return await User.findById(id).select(fields) }

const getUserByEmailWithFields = async (email, fields) => { return await User.findOne({email}).select(fields) }

const updateUser = async (id, update,select) => {
    return await User.findOneAndUpdate({_id: ObjectID(id)}, update, {
        new: true
    }).select(select)
}

const generateVerificationToken = async (user) => {
    const token = user.generateVerificationToken()
    return await token.save() 
}

const getUserByField = async field => {
    return await User.findOne(field)
}
const add_OTP_temp_secret = async (id, secret) => {
    return await User.findByIdAndUpdate(id, {
        OTP_temp_secret:secret,
        // useOTP:true
    }, {new: true})
}
const getOTPTempSecret = async id => {
    return await User.findById(id).select('OTP_temp_secret')
}
const getOTPSecret = async id => {
    return await User.findById(id).select('OTP_secret')
}
const add_OTP_secret = async (id, secret) => {
    return await User.findByIdAndUpdate(id, {
        OTP_secret:secret,
        useOTP:true,
        OTP_temp_secret:null
    }, {new: true})
}
module.exports = {
    addUser,
    getUserByEmail,
    getUserByID,
    getUserByIdWithfields,
    updateUser,
    generateVerificationToken,
    getUserByField,
    getUserByEmailWithFields,
    add_OTP_temp_secret,
    getOTPTempSecret,
    add_OTP_secret,
    getOTPSecret,
}
