'use strict'
/**
 * @author Anil Bomma
 * Module dependencies.
 */

const async = require('async');
const bcrypt = require('bcrypt');

const logger = require("../../../utils/logger");
const util = require("../../../utils/util");
const dsMgr = require("../../../utils/dsMgr");

const User = require("../modals/user.server.modal")

const validateUser = (userObj, cb) => {
    if (!userObj.email) {
        cb(undefined, false)
    } else if (!userObj.password) {
        cb(undefined, false)
    } else if (!userObj.firstName) {
        cb(undefined, false)
    } else if (!userObj.lastName) {
        cb(undefined, false)
    } else {
        cb(undefined, true)
    }
}

module.exports.saveUser = (userObj, cb) => {
    try {
        async.waterfall([
            // validate user object 
            (callback) => {
                validateUser(userObj, (err, validate) => {
                    if (validate) {
                        callback(undefined, userObj)
                    } else {
                        callback({ status: 400, message: 'bad request user details missing' })
                    }
                })
            },
            (userData, callback) => {
                bcrypt.hash(userData.password, 5, function(err, bcryptedPassword) {
                    userData.password = bcryptedPassword
                    callback(undefined, userData);
                });
            },
            async(userData, callback) => {
                try {

                    const user = new User({
                        userId: util.uuid(),
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        displayName: userData.firstName + " " + userData.lastName,
                        email: userData.email,
                        password: userData.password,
                        createdBy: 'admin'
                    });

                    return await dsMgr.save(user);

                } catch (err) {
                    console.log("err:", err);
                    callback(err);
                }
            }
        ], function(error, response) {
            if (error) {
                cb(error)
            } else {
                cb(undefined, response)
            }
        })
    } catch (ex) {
        logger.error('saveUser function has exception occured');
        cb(ex);
    }
}