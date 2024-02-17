//Routes for HomePage : http://localhost:PORT
const express = require('express');
const homeRouter = express.Router();
const homeController = require('../controllers/homeController.js')

//Home Page of App
homeRouter.route('/').get(homeController.getHome);

//About Page
homeRouter.route('/about').get(homeController.getAbout);

module.exports = homeRouter;
