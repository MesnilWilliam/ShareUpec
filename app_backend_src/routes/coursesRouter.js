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

//Main Page of Courses Dashboard
coursesRouter.route('/').get(coursesController.getCoursesDashboard);

//Get all Courses
coursesRouter.route('/all').get(coursesController.getCourses);

//Get Logged User Followed Courses
coursesRouter.route('/my/enrolled').get(authMiddleware.checkAuthenticated,coursesController.getLoggedUserEnrolledCourses);

//Get Logged User Owned Courses
coursesRouter.route('/my/owned').get(authMiddleware.checkAuthenticated,coursesController.getLoggedUserOwnedCourses);

//Get Courses Owned by User holding ShareToken
coursesRouter.route('/token/:token').get(coursesController.getCoursesByShareToken);

//Add Course
coursesRouter.route('/my/create').post(authMiddleware.checkAuthenticated,coursesController.createLoggedUserCourse);

//Get Course by ID
coursesRouter.route('/:course_id').get(coursesController.getCourse);

//Update Course by ID
coursesRouter.route('/my/:course_id').patch(authMiddleware.checkAuthenticated,coursesController.updateLoggedUserCourse);

//Delete Course
coursesRouter.route(`/my/:course_id`).delete(authMiddleware.checkAuthenticated,coursesController.deleteLoggedUserCourse);

module.exports = coursesRouter;
