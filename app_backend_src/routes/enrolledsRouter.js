//Routes for Enrolled : http://localhost:PORT/courses/enrolled
const express = require('express');
const enrolledsRouter = express.Router();
const enrolledsController = require('../controllers/enrolledsController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

/**
* @openapi
* '/courses/my/enrollments/enroll/{course_id}':
*  post:
*     tags:
*     - Enrolleds Controller
*     summary: Add Enrolled Logged User To Course
*     parameters:
*      - id: User ID
*        in: session
*        description: The Inique ID of the User
*        required: true
*      - course_id: Course ID
*        in: path
*        description: The Inique ID of the Course
*        required: true
*     requestBody:
*      required: false
*      content:
*        application/json:
*           schema:
*            type: object
*     responses:
*      201:
*        description: Created
*      400:
*        description: Bad Request
*      500:
*        description: Server Error
*/
enrolledsRouter.route('/my/enrollments/enroll/:course_id').post(authMiddleware.checkAuthenticated,enrolledsController.addLoggedUserEnrollment);

/**
* @openapi
* '/courses/my/enrollments/all':
*  get:
*     tags:
*     - Enrolleds Controller
*     summary: Get all Enrolled Course For Logged User
*     parameters:
*      - id: User ID
*        in: session
*        description: The Inique ID of the User
*        required: true
*     responses:
*      200:
*        description: Fetched Successfully
*      500:
*        description: Server Error
*/
enrolledsRouter.route('/my/enrollments/all').get(authMiddleware.checkAuthenticated,enrolledsController.getLoggedUserEnrollments);

/**
* @openapi
* '/courses/my/enrollments/drop/{course_id}':
*  delete:
*     tags:
*     - Enrolleds Controller
*     summary: Remove Enrolled Logged User From Course
*     parameters:
*      - id: User ID
*        in: session
*        description: The Inique ID of the User
*        required: true
*      - course_id: Course ID
*        in: path
*        description: The Inique ID of the Course
*        required: true
*     responses:
*      204:
*        description: Removed
*      400:
*        description: Bad request
*/
enrolledsRouter.route(`/my/enrollments/drop/:course_id`).delete(authMiddleware.checkAuthenticated,enrolledsController.deleteLoggedUserEnrollment);

module.exports = enrolledsRouter;
