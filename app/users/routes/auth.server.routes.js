'use strict'
/**
 * @author Anil Bomma
 * Module dependencies.
 */

module.exports = function(app) {
    var authController = require('../controllers/auth.server.controller');
    app.route('/api/auth/login').post(authController.login);
    app.route('/api/auth/logout').get(authController.logout);

};