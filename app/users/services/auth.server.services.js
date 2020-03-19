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

const User = require("../modals/user.server.modal");


let login = async(userInfo) => {

    try {
        if (!userInfo.email || !userInfo.password) {
            return ({
                status: 400,
                message: "bad request. missing username/password"
            });
        }

        let userData = await dsMgr.findOne(User, { email: userInfo.email }, '');
        if (userData == null) {
            throw ({
                status: 400,
                message: "bad request. inavlid username/password"
            });
        }
        return userData;

    } catch (err) {
        logger.error("error while executing login code: " + err);
        throw err;
    }

}

let logout = () => {

}

module.exports.login = login;
module.exports.logout = logout;