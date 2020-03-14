'use strict'
/**
 * @author Anil Bomma
 * Module dependencies.
 */

const logger = require('../../../utils/logger');
const userService = require('../services/user.server.services');


module.exports.saveUser = (req, res) => {
    try {
        if (!Object.keys(req.body).length) {
            return res.status(400).send({
                status: 400,
                message: 'bad request user details required to save user'
            });
        }
        userService.saveUser(req.body, (err, response) => {
            if (err) {
                logger.error('saveUser function has error', err ? err.message : err)
                res.status(err.status || err.statusCode || err.code || 500).send({ message: err });
            } else {
                logger.info('saveVendor function has executed successfully')
                res.send({ "status": 200, "response": response });
            }
        });
    } catch (ex) {
        logger.error('saveUser function has exception occured');
        res.send(ex);
    }
};