//Routes for Files : http://localhost:PORT/courses/files
const express = require('express');
const filesRouter = express.Router();
const filesController = require('../controllers/filesController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

//Get all Files for Defined Course
filesRouter.route('/:course_id/files').get(filesController.getFilesForCourse);

//Add Files
filesRouter.route('/:course_id/files/add').post(authMiddleware.checkAuthenticated,filesController.addLoggedUserCourseFile);

//Get File by ID
filesRouter.route('/:course_id/files/:file_id').get(filesController.getFileForCourse);

//Download File by ID
filesRouter.route('/:course_id/files/:file_id/download').get(filesController.downloadFile);

//Update File by ID
filesRouter.route('/:course_id/files/:file_id').patch(authMiddleware.checkAuthenticated,filesController.updateLoggedUserCourseFile);

//Delete File
filesRouter.route(`/:course_id/files/:file_id`).delete(authMiddleware.checkAuthenticated,filesController.deleteLoggedUserCourseFile);

module.exports = filesRouter;
