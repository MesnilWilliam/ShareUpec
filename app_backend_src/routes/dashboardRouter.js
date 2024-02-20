//Routes for Logged User Dashboard : http://localhost:PORT/dashboard
const express = require('express');
const dashboardRouter = express.Router();
const dashboardController = require('../controllers/dashboardController.js')
const checkAuthenticated = require('../middlewares/authMiddleware.js')

//Main Page of Dashboard
dashboardRouter.route('/').get(checkAuthenticated,(req,res) => {
    res.status(200).send(`Welcome, ${req.user.first_name}`);
});

//User Profile
dashboardRouter.route('/profile').get(checkAuthenticated,(req,res) => {
    res.status(200).send(`UName: ${req.user.first_name} | ULastName: ${req.user.last_name} | UEmail: ${req.user.email}`);
});

module.exports = dashboardRouter;
