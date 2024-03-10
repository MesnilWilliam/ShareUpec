//Routes for Logged User Dashboard : http://localhost:PORT/dashboard
//These Routes are made for Authenticated Users : checkAuthenticated ensure Users are Logged and can access Their Dashboard
const express = require('express');
const dashboardRouter = express.Router();
const dashboardController = require('../controllers/dashboardController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

//Main Page of Dashboard
dashboardRouter.route('/').get(authMiddleware.checkAuthenticated,dashboardController.getDashboard);

//User Profile
dashboardRouter.route('/profile').get(authMiddleware.checkAuthenticated,dashboardController.getProfile);

module.exports = dashboardRouter;
