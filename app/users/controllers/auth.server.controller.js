'use strict'
/**
 * @author Anil Bomma
 * Module dependencies.
 */

const logger = require('../../../utils/logger');
const authService = require('../services/auth.server.services');

// used to handle login hadler
let login = async(req, res) => {
    try {
        if (!Object.keys(req.body).length) {
            return res.status(400).send({
                status: 400,
                message: 'bad request user details required to save user'
            });
        }

        let authResult = await authService.login(req.body);
        logger.info('login function has executed successfully', authResult)
        res.send({ "status": 200, "response": authResult });

    } catch (err) {
        logger.error('login function has error: ' + JSON.stringify(err));
        res.status(err.status || err.statusCode || 500).send(err);
    }
};

// used to handle logout hadler
let logout = (req, res) => {

    try {

        authService.logout((err, res) => {
            if (err) {
                logger.error('login function has error', err ? err.message : err)
                res.status(err.status || err.statusCode || err.code || 500).send({ message: err });
            } else {
                logger.info('login function has executed successfully')
                res.send({ "status": 200, "response": response });
            }
        })

    } catch (err) {
        logger.error('login function has error: ' + err);
        res.send(err);
    }
}

module.exports.login = login;
module.exports.logout = logout;