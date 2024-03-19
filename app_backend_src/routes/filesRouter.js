//Routes for Files : http://localhost:PORT/courses/files
const express = require('express');
const filesRouter = express.Router();
const filesController = require('../controllers/filesController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

/**
* @openapi
* '/courses/{course_id}/files':
*  get:
*     tags:
*     - Files Controller
*     summary: Get all Files for Defined Course
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
*      500:
*        description: Server Error
*/
filesRouter.route('/:course_id/files').get(filesController.getFilesForCourse);

/**
* @openapi
* '/courses/{course_id}/files/add':
*  post:
*     tags:
*     - Files Controller
*     summary: Add Files to Defined Course
*     requestBody:
*      required: true
*      content:
*        application/json:
*           schema:
*            type: object
*            required:
*              - name
*              - extension
*            properties:
*              name:
*                type: string
*                default: undefined
*              extension:
*                type: string
*                default: undefined
*              link:
*                type: url
*                default: undefined
*              binary:
*                type: blob
*                default: undefined
*     responses:
*      201:
*        description: Created
*      400:
*        description: Bad request
*      403:
*        description: Forbidden
*      500:
*        description: Server Error
*/
filesRouter.route('/:course_id/files/add').post(authMiddleware.checkAuthenticated,filesController.addLoggedUserCourseFile);

/**
* @openapi
* '/courses/{course_id}/files/{file_id}:
*  get:
*     tags:
*     - Files Controller
*     summary: Get File by ID for Defined Course
*     parameters:
*      - course_id: Course ID
*        in: path
*        description: The Inique ID of the Course
*        required: true
*      - file_id: File ID
*        in: path
*        description: The Inique ID of the File
*        required: true
*     responses:
*      200:
*        description: Fetched Successfully
*      400:
*        description: Bad request
*      404:
*        description: Not Found
*/
filesRouter.route('/:course_id/files/:file_id').get(filesController.getFileForCourse);

/**
* @openapi
* '/courses/{course_id}/files/{file_id}/download:
*  get:
*     tags:
*     - Files Controller
*     summary: Download File by ID from Defined Course
*     parameters:
*      - course_id: Course ID
*        in: path
*        description: The Inique ID of the Course
*        required: true
*      - file_id: File ID
*        in: path
*        description: The Inique ID of the File
*        required: true
*     responses:
*      200:
*        description: Fetched Successfully
*      400:
*        description: Bad request
*      403:
*        description: Forbidden
*      404:
*        description: Not Found
*/
filesRouter.route('/:course_id/files/:file_id/download').get(filesController.downloadFile);

/**
* @openapi
* '/courses/{course_id}/files/{file_id}':
*  put:
*     tags:
*     - Files Controller
*     summary: Update File by ID for Defined Course
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
*              extension:
*                type: string
*                default: undefined
*              link:
*                type: url
*                default: undefined
*              binary:
*                type: blob
*                default: undefined
*     responses:
*      200:
*        description: Modified
*      400:
*        description: Bad Request
*      403:
*        description: Forbidden
*      404:
*        description: Not Found
*/
filesRouter.route('/:course_id/files/:file_id').patch(authMiddleware.checkAuthenticated,filesController.updateLoggedUserCourseFile);

/**
* @openapi
* '/courses/{course_id}/files/{file_id}':
*  delete:
*     tags:
*     - Files Controller
*     summary: Delete File from Defined Course
*     parameters:
*      - course_id: Course ID
*        in: path
*        description: The Inique ID of the Course
*        required: true
*      - file_id: File ID
*        in: path
*        description: The Inique ID of the File
*        required: true
*     responses:
*      204:
*        description: Removed
*      400:
*        description: Bad request
*      403:
*        description: Forbidden
*/
filesRouter.route(`/:course_id/files/:file_id`).delete(authMiddleware.checkAuthenticated,filesController.deleteLoggedUserCourseFile);

module.exports = filesRouter;
