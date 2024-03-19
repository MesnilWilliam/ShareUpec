//Routes for Logged User Dashboard : http://localhost:PORT/dashboard
//These Routes are made for Authenticated Users : checkAuthenticated ensure Users are Logged and can access Their Dashboard
const express = require('express');
const dashboardRouter = express.Router();
const dashboardController = require('../controllers/dashboardController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

/**
* @openapi
* '/dashboard/':
*  get:
*     tags:
*     - Dashboard Controller
*     summary: Main Page of Dashboard
*     parameters:
*      - first_name: User Name
*        in: session
*        description: The Name of the User
*        required: true
*     responses:
*      200:
*        description: Fetched Successfully
*/
dashboardRouter.route('/').get(authMiddleware.checkAuthenticated,dashboardController.getDashboard);

/**
* @openapi
* '/dashboard/profile':
*  get:
*     tags:
*     - Dashboard Controller
*     summary: User Profile Page
*     parameters:
*      - first_name: User Name
*        in: session
*        description: The Name of the User
*        required: true
*      - last_name: User Family Name
*        in: session
*        description: The Family Name of the User
*        required: true
*      - email: User Email
*        in: session
*        description: The Email of the User
*        required: true
*     responses:
*      200:
*        description: Fetched Successfully
*/
dashboardRouter.route('/profile').get(authMiddleware.checkAuthenticated,dashboardController.getProfile);

/**
* @openapi
* '/dashboard/profile/update':
*  put:
*     tags:
*     - Dashboard Controller
*     summary: Update User Profile
*     requestBody:
*      required: true
*      content:
*        application/json:
*           schema:
*            type: object
*            properties:
*              first_name:
*                type: string
*                default: undefined
*              last_name:
*                type: string
*                default: undefined
*              email:
*                type: string
*                default: undefined
*              password:
*                type: string
*                default: undefined
*     responses:
*      200:
*        description: Modified
*      400:
*        description: Bad Request
*      500:
*        description: Server Error
*/
dashboardRouter.route('/profile/update').patch(authMiddleware.checkAuthenticated,dashboardController.updateLoggedUser);

/**
* @openapi
* '/dashboard/profile/delete':
*  delete:
*     tags:
*     - Dashboard Controller
*     summary: Delete User Profile
*     parameters:
*      - id: User ID
*        in: session
*        description: The Inique ID of the User
*        required: true
*     responses:
*      204:
*        description: Removed
*      400:
*        description: Bad request
*/
dashboardRouter.route('/profile/delete').delete(authMiddleware.checkAuthenticated,dashboardController.deleteLoggedUser);

module.exports = dashboardRouter;
