//Controller for using Enrolleds Router
//Callbacks of Enrolleds Routes are defined using Arrow Syntax for readability
//Use JSON.stringify(Onject) to Print JSON for Console LOG

//Assume in Following Functions
//req.body should be Parsed JSON when Use BodyParser.json as MiddleWare
//req.params is JSON Object with Field from URL

//Build Response JSON
const jsonBuilder = require('../utils/jsonBuilder.js');

//Import Models for Database Interactions
const CustomError = require('../config/CustomError.js');
const CourseModel = require('../models/CourseModel.js');
const EnrolledModel = require('../models/EnrolledModel.js');
const parameterValidator = require('../utils/parameterValidator.js');
const dotenv = require('dotenv');
dotenv.config();

//@desc Add Logged User Enrollment To Course in database
//@route POST /my/enrollments/enroll/:course_id
//@access public
const addLoggedUserEnrollment = async (req,res,next) => {
    //Retreive Field course_id from req.params JSON Object
    const {course_id} = req.params;

    //Check course_id Numerical Value
    if(!parameterValidator.isResolvableToNumber(course_id)){
        return next(CustomError.badRequest("Could not proceed : Invalid Course ID"));
    }

    //No Inputs as UserID in Logged Passport and CourseID in Parameters
    const addedEnrollment = await EnrolledModel.create({
        user_id: req.user.id,
        course_id: course_id
    });

    //Check if somehow Enrollment Undefined
    if(!addedEnrollment){
        return next(CustomError.serverError("Error : Something Happened"));
    };

    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,`POST /my/enrollments/enroll/${course_id} on Enrolleds API : Added Enrollment for User ID ${addedEnrollment.user_id}`);
    res.status(201).json(jsonResponse);
};

//@desc Get All Enrolleds Courses For Logged User from database
//@route GET /courses/my/enrollments/all
//@access public
const getLoggedUserEnrollments = async (req,res,next) => {
    //Querry all Courses User Enrolled In
    const enrolledCourses = await CourseModel.findAll({
        include: {
            model: EnrolledModel,
            where: {user_id: req.user.id},
            required: true
        },
        order: [['name','ASC']],
        attributes: ['id','name','cycle'],
    });

    //Check if somehow Enrolled Courses Undefined
    if(!enrolledCourses){
        return next(CustomError.serverError('Something Happened'));
    };
    
    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,JSON.stringify(enrolledCourses, null, 2));
    res.status(200).json(jsonResponse);
}

//@desc Remove Logged User Enrollment For Course from database
//@route DELETE /my/enrollments/drop/:course_id
//@access public
const deleteLoggedUserEnrollment = async (req,res) => {
    //Retreive Field id from req.params JSON Object
    const {course_id} = req.params;

    //Check course_id Numerical Value
    if(!parameterValidator.isResolvableToNumber(course_id)){
        return next(CustomError.badRequest("Could not proceed : Invalid Course ID"));
    }

    //Remove One Course with id
    await EnrolledModel.destroy({
        where: {
            user_id: req.user.id,
            course_id: course_id
        }
    });

    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,`DELETE /my/enrollments/drop/${course_id} on Enrolled API : Deleted Enrollment`);
    res.status(204).json(jsonResponse);
};

//Authorize other Modules to make use of Callbacks defined here
module.exports = {
    addLoggedUserEnrollment,
    getLoggedUserEnrollments,
    deleteLoggedUserEnrollment
};
