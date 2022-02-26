const express = require('express');
const auth = require('./auth')
const helper = require('../helpers/common')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const authenticate = require('../middlewares/authenticate')
const user = require('./user')
module.exports = app => {

    app.get('/', (req, res) => {
        return helper.sendResponse(res, {
            message: "Welcome to Node Server", 
            api_docs: `visit api documentation  localhost:${process.env.PORT}/api/docs`,
            success: true
        })
    });

    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument,{explorer: true}));
    app.use('/api/auth',auth)
    app.use('/api/user', authenticate, user)
}