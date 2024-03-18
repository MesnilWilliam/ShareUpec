//Routes for Enrolled : http://localhost:PORT/courses/enrolled
const express = require('express');
const enrolledsRouter = express.Router();
const enrolledsController = require('../controllers/enrolledsController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

//Add Enrolled Logged User To Course
enrolledsRouter.route('/my/enrollments/enroll/:course_id').post(authMiddleware.checkAuthenticated,enrolledsController.addLoggedUserEnrollment);

//Get all Enrolled Course For Logged User
enrolledsRouter.route('/my/enrollments/all').get(authMiddleware.checkAuthenticated,enrolledsController.getLoggedUserEnrollments);

//Remove Enrolled Logged User From Course
enrolledsRouter.route(`/my/enrollments/drop/:course_id`).delete(authMiddleware.checkAuthenticated,enrolledsController.deleteLoggedUserEnrollment);

module.exports = enrolledsRouter;
