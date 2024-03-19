//Routes for Course : http://localhost:PORT/courses
const express = require('express');
const enrolledsRouter = require('./enrolledsRouter.js');
const filesRouter = require('./filesRouter.js');
const coursesRouter = express.Router();
const coursesController = require('../controllers/coursesController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

//Use Enrolleds Router
coursesRouter.use('/',enrolledsRouter);

//Use Files Router
coursesRouter.use('/',filesRouter);

/**
* @openapi
* '/courses/':
*  get:
*     tags:
*     - Courses Controller
*     summary: Main Page of Courses Dashboard
*     parameters:
*      - first_name: User Name
*        in: session
*        description: The Name of the User
*        required: false
*     responses:
*      200:
*        description: Fetched Successfully
*/
coursesRouter.route('/').get(coursesController.getCoursesDashboard);

/**
* @openapi
* '/courses/all':
*  get:
*     tags:
*     - Courses Controller
*     summary: Get all Courses
*     responses:
*      200:
*        description: Fetched Successfully
*      500:
*        description: Server Error
*/
coursesRouter.route('/all').get(coursesController.getCourses);

/**
* @openapi
* '/courses/my/enrolled':
*  get:
*     tags:
*     - Courses Controller
*     summary: Get Logged User Enrolled Courses
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
coursesRouter.route('/my/enrolled').get(authMiddleware.checkAuthenticated,coursesController.getLoggedUserEnrolledCourses);

/**
* @openapi
* '/courses/my/owned':
*  get:
*     tags:
*     - Courses Controller
*     summary: Get Logged User Owned Courses
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
coursesRouter.route('/my/owned').get(authMiddleware.checkAuthenticated,coursesController.getLoggedUserOwnedCourses);

/**
* @openapi
* '/courses/token/{token}':
*  get:
*     tags:
*     - Courses Controller
*     summary: Get Courses Owned by User holding ShareToken
*     parameters:
*      - token: User ShareCode
*        in: path
*        description: The Inique UUID4 ShareCode of an User
*        required: true
*     responses:
*      200:
*        description: Fetched Successfully
*      400:
*        description: Bad request
*      500:
*        description: Server Error
*/
coursesRouter.route('/token/:token').get(coursesController.getCoursesByShareToken);

/**
* @openapi
* '/courses/my/create':
*  post:
*     tags:
*     - Courses Controller
*     summary: Add Course
*     requestBody:
*      required: true
*      content:
*        application/json:
*           schema:
*            type: object
*            required:
*              - name
*              - cycle
*            properties:
*              name:
*                type: string
*                default: undefined
*              cycle:
*                type: string
*                default: undefined
*     responses:
*      201:
*        description: Created
*      400:
*        description: Bad request
*      500:
*        description: Server Error
*/
coursesRouter.route('/my/create').post(authMiddleware.checkAuthenticated,coursesController.createLoggedUserCourse);

/**
* @openapi
* '/courses/{course_id}':
*  get:
*     tags:
*     - Courses Controller
*     summary: Get Course by ID
*     parameters:
*      - course_id: Course ID
*        in: path
*        description: The Inique ID of the Course
*        required: true
*     responses:
*      200:
*        description: Fetched Successfully
*      400:
*        description: Bad request
*      404:
*        description: Not Found
*/
coursesRouter.route('/:course_id').get(coursesController.getCourse);

/**
* @openapi
* '/courses/my/{course_id}':
*  put:
*     tags:
*     - Courses Controller
*     summary: Update Course by ID
*     requestBody:
*      required: true
*      content:
*        application/json:
*           schema:
*            type: object
*            properties:
*              name:
*                type: string
*                default: undefined
*              cycle:
*                type: string
*                default: undefined
*     responses:
*      200:
*        description: Modified
*      400:
*        description: Bad Request
*      404:
*        description: Not Found
*/
coursesRouter.route('/my/:course_id').patch(authMiddleware.checkAuthenticated,coursesController.updateLoggedUserCourse);

/**
* @openapi
* '/courses/my/{course_id}':
*  delete:
*     tags:
*     - Courses Controller
*     summary: Delete Course
*     parameters:
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
coursesRouter.route(`/my/:course_id`).delete(authMiddleware.checkAuthenticated,coursesController.deleteLoggedUserCourse);

module.exports = coursesRouter;
