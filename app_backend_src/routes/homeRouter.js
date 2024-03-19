//Routes for HomePage : http://localhost:PORT
const express = require('express');
const homeRouter = express.Router();
const homeController = require('../controllers/homeController.js')

/**
* @openapi
* '/':
*  get:
*     tags:
*     - Home Controller
*     summary: Home Page of App
*     responses:
*      200:
*        description: Fetched Successfully
*/
homeRouter.route('/').get(homeController.getHome);

/**
* @openapi
* '/about':
*  get:
*     tags:
*     - Home Controller
*     summary: About Page
*     responses:
*      200:
*        description: Fetched Successfully
*/
homeRouter.route('/about').get(homeController.getAbout);

module.exports = homeRouter;
