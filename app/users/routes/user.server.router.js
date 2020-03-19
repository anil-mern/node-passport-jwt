'use strict'
/**
 * @author Anil Bomma
 * Module dependencies.
 */

module.exports = function(app) {
    var userController = require('../controllers/user.server.controller');
    app.route('/api/user/register').post(userController.saveUser);
};