//Routes for Admin : http://localhost:PORT/admin
const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/adminController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

/**
* @openapi
* '/admin/users':
*  get:
*     tags:
*     - Admin Controller
*     summary: Get all Users
*     responses:
*      200:
*        description: Fetched Successfully
*      500:
*        description: Server Error
*/
adminRouter.route('/users').get(authMiddleware.checkAdmin,adminController.getUsers);

//
/**
* @openapi
* '/admin/users':
*  post:
*     tags:
*     - Admin Controller
*     summary: Add User
*     requestBody:
*      required: true
*      content:
*        application/json:
*           schema:
*            type: object
*            required:
*              - first_name
*              - last_name
*              - email
*              - password
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
*      201:
*        description: Created
*      400:
*        description: Bad Request
*      500:
*        description: Server Error
*/
adminRouter.route('/users').post(authMiddleware.checkAdmin,adminController.createUser);

/**
* @openapi
* 'admin/users/{user_id}':
*  get:
*     tags:
*     - Admin Controller
*     summary: Get User by ID
*     parameters:
*      - user_id: User ID
*        in: path
*        description: The Inique ID of the User
*        required: true
*     responses:
*      200:
*        description: Fetched Successfully
*      400:
*        description: Bad request
*      404:
*        description: Not Found
*/
adminRouter.route('/users/:user_id').get(authMiddleware.checkAdmin,adminController.getUser);

/**
* @openapi
* '/admin/users/{user_id}':
*  put:
*     tags:
*     - Admin Controller
*     summary: Update User by ID
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
*     responses:
*      200:
*        description: Modified
*      400:
*        description: Bad Request
*      500:
*        description: Server Error
*/
adminRouter.route('/users/:user_id').patch(authMiddleware.checkAdmin,adminController.updateUser);

/**
* @openapi
* '/admin/users/{user_id}':
*  delete:
*     tags:
*     - Admin Controller
*     summary: Delete User by ID
*     parameters:
*      - user_id: User ID
*        in: path
*        description: The Inique ID of the User
*        required: true
*     responses:
*      204:
*        description: Removed
*      400:
*        description: Bad request
*/
adminRouter.route(`/users/:user_id`).delete(authMiddleware.checkAdmin,adminController.deleteUser);

module.exports = adminRouter;
