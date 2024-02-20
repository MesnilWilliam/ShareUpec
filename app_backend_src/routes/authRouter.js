//Routes for Auth : http://localhost:PORT/auth
const express = require('express');
const passport = require('passport');
const authRouter = express.Router();
const authController = require('../controllers/authController.js');

//Redirect to Login Page
authRouter.route('/').get((req,res) => {
    res.redirect('/auth/login');
});

//Login Page
authRouter.route('/login').get((req,res) => {
    //Display Login Form
    res.status(200).send("Please fill the login form");
});

//Login User
authRouter.route('/login').post(passport.authenticate('local',{failureRedirect: '/auth/login'}),(req,res) => {
    //Logged In
    res.redirect('/dashboard/');
});

//Logout User
authRouter.route('/logout').get((req,res) => {
    //Logout with Passport
    //Passport add req.logout(Function) to Override Cookie on User Browser with dummy value thus invalidating the Session
    req.logout((err) => {
        if(err){
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = authRouter;
