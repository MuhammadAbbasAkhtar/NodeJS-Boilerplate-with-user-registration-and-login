const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const config =  require('../config/keys');

const authenticate = async params => {
    return Users.findOne({ email:params.email })
        .then(async user => {
            if(!user)
                throw new Error('Authentication failed. User not found.');
            if(!bcrypt.compareSync(params.password || '', user.password))
                throw new Error('Authentication failed. Wrong password.');
            if(!user.isVerified)
                throw new Error('Authentication failed. Account not verified')
            if(!user.isEnabled)
                throw new Error('Authentication failed. Account not active')
                
            const token = await generateToken(user, true)
            // user.refreshToken = refreshToken; //save the refresh token to db
            // user.save()
            return {token, user};
        })
}
const authenticateOnVerification = params => {
    return Users.findOne({ email:params.email})
    .then(user => {
        if(!user)
            throw new Error('Authentication failed. User not found.');
        if(!user.isVerified)
            throw new Error('Authentication failed. Account not verified')
        if(!user.isEnabled)
            throw new Error('Authentication failed. Account not active')
        // if(user.firstLogin)
        //     throw new Error('Authentication failed. Account already verified')
        const payload = {
            email: user.email,
            id: user.id,
            time: new Date(),
            firstName: user.firstName,
            lastName: user.lastName,
            username:user.username,
            role: user.role,
        }
        let refreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
            algorithm: config.REFRESH_TOKEN_ALGO,
            expiresIn: config.REFRESH_TOKEN_LIFE
        })
        Object.assign(payload, {refreshToken})
        var token = jwt.sign(payload, config.JWT_SECRET, {
            expiresIn: config.tokenExpireTime
        });
        return token;
    })
}

const generateToken = async (user, isTemp = false) => {
    const payload = { 
        email: user.email,
        id: user.id,
        time: new Date(),
        firstName: user.firstName,
        lastName: user.lastName,
        username:user.username,
        role: user.role,
    }
    if(!isTemp){
        let refreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
            algorithm: config.REFRESH_TOKEN_ALGO,
            expiresIn: config.REFRESH_TOKEN_LIFE
        })
        Object.assign(payload, {refreshToken})
    }
    const token = jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: isTemp ? config.tempTokenExpireTime: config.tokenExpireTime
    });
    return token
}
module.exports = {
    authenticate,
    authenticateOnVerification,
    generateToken
}