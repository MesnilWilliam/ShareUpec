//Controller for using Courses Router
//Callbacks of Courses Routes are defined using Arrow Syntax for readability
//Use JSON.stringify(Onject) to Print JSON for Console LOG

//Assume in Following Functions
//req.body should be Parsed JSON when Use BodyParser.json as MiddleWare
//req.params is JSON Object with Field from URL

//Build Response JSON
const jsonBuilder = require('../utils/jsonBuilder.js');

//Import Models for Database Interactions
const CustomError = require('../config/CustomError.js');
const UserModel = require('../models/UserModel.js');
const CourseModel = require('../models/CourseModel.js');
const EnrolledModel = require('../models/EnrolledModel.js');
const parameterValidator = require('../utils/parameterValidator.js');
const dotenv = require('dotenv');
dotenv.config();

//@desc Get Dashboard Course Page for Any User
//@route GET /courses
//@access public
const getCoursesDashboard = async (req,res,next) => {
    message = `What Courses are You searching for ?`
    if(req.user.first_name){
        message = `What Courses are You searching for, ${req.user.first_name} ?`
    }
    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,message);
    res.status(200).json(jsonResponse);
}

//@desc Get All Courses from database
//@route GET /courses/all
//@access public
const getCourses = async (req,res,next) => {
    //Querry all Courses
    const courses = await CourseModel.findAll({
        order: [['name','ASC']],
        attributes: ['id','name','cycle']
    });

    //Check if somehow Courses Undefined
    if(!courses){
        return next(CustomError.serverError('Something Happened'));
    };
    
    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,JSON.stringify(courses, null, 2));
    res.status(200).json(jsonResponse);
}

//@desc Get Logged User Enrolled Courses from database
//@route GET /courses/my/enrolled
//@access public
const getLoggedUserEnrolledCourses = async (req,res,next) => {
    //Querry all CoursesID User Enrolled In
    const enrolledPairs = await EnrolledModel.findAll({
        where: {user_id: req.user.id}
    });

    //Check if somehow Enrolled Courses Undefined
    if(!enrolledPairs){
        return next(CustomError.serverError('Something Happened'));
    };

    var coursesID = [];
    for(enrolledPair of enrolledPairs){
        coursesID.push(enrolledPair.course_id);
    }

    //Querry all Courses User Enrolled In
    const enrolledCourses = await CourseModel.findAll({
        where: {id: coursesID}
    });

    //Check if somehow Enrolled Courses Undefined
    if(!enrolledCourses){
        return next(CustomError.serverError('Something Happened'));
    };
    
    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,JSON.stringify(enrolledCourses, null, 2));
    res.status(200).json(jsonResponse);
}

//@desc Get Logged User Owned Courses from database
//@route GET /courses/my/owned
//@access public
const getLoggedUserOwnedCourses = async (req,res,next) => {
    //Querry all Courses User Follows
    const ownedCourses = await CourseModel.findAll({
        where: {owner_id: req.user.id},
        order: [['name','ASC']],
        attributes: ['id','name','cycle'],
    });

    //Check if somehow Owned Courses Undefined
    if(!ownedCourses){
        return next(CustomError.serverError('Something Happened'));
    };
    
    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,JSON.stringify(ownedCourses, null, 2));
    res.status(200).json(jsonResponse);
}

//@desc Get Courses Owned by User holding Token from database
//@route GET /courses/token/:token
//@access public
const getCoursesByShareToken = async (req,res,next) => {
    //Retreive Field Token from req.params JSON Object
    const {token} = req.params;

    //Check ShareCode
    if(!parameterValidator.isShareCodeValid(token)){
        return next(CustomError.badRequest("Error : Invalid ShareCode"))
    }

    //Querry User holding this Token
    const tokenHolder = await UserModel.findOne({
        where: {share_code: token},
        attributes: ['id']
    });

    //Check if somehow User Undefined
    if(!tokenHolder){
        return next(CustomError.serverError('Something Happened'));
    };

    //Querry all Courses By TokenHolder
    const tokenCourses = await CourseModel.findAll({
        where: {owner_id: tokenHolder.id},
        order: [['name','ASC']],
        attributes: ['id','name','cycle'],
    });

    //Check if somehow Token Courses Undefined
    if(!tokenCourses){
        return next(CustomError.serverError('Something Happened'));
    };
    
    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,JSON.stringify(tokenCourses, null, 2));
    res.status(200).json(jsonResponse);
}

//@desc Create and add Course to database
//@route POST /courses/my/create
//@access public
const createLoggedUserCourse = async (req,res,next) => {
    //Retreive Request Body data
    const formCourse = {
        ...req.body
    };
    
    //Check all needed Fields are here
    if(!formCourse.name || !formCourse.cycle){
        return next(CustomError.badRequest("Could not proceed : Missing Value"));
    };

    //Check Cycle Valid
    if(!parameterValidator.isCycleValid(formCourse.cycle)){
        return next(CustomError.badRequest("Error : Cycle out of range"));
    }

    //Only use Needed Fields to let AutoGen Fill ID and then some
    const addedCourse = await CourseModel.create({
        name: formCourse.name,
        cycle: formCourse.cycle,
        owner_id: req.user.id,
    });

    //Check if somehow Course Undefined
    if(!addedCourse){
        return next(CustomError.serverError("Error : Something Happened"));
    };

    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,`POST /course/my/create on Courses API : Created Course with ID ${addedCourse.id}`);
    res.status(201).json(jsonResponse);
};

//@desc Get Course with id from database
//@route GET /courses/:course_id
//@access public
const getCourse = async (req,res,next) => {
    //Retreive Field course_id from req.params JSON Object
    const {course_id} = req.params;

    //Check course_id Numerical Value
    if(!parameterValidator.isResolvableToNumber(course_id)){
        return next(CustomError.badRequest("Could not proceed : Invalid Course ID"));
    }

    //Querry One Course with id
    const course = await CourseModel.findOne({
        where: {id: course_id},
        attributes: ['id','name','cycle']
    });

    //Check if Course Found
    if(!course){
        return next(CustomError.notFound("Unregistered Course"));
    };

    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,JSON.stringify(course, null, 2));
    res.status(200).json(jsonResponse);
};

//@desc Update Course with id in database
//@route PATCH /courses/my/:course_id
//@access public
const updateLoggedUserCourse = async (req,res,next) => {
    //Retreive Field course_id from req.params JSON Object
    const {course_id} = req.params;

    //Check course_id Numerical Value
    if(!parameterValidator.isResolvableToNumber(course_id)){
        return next(CustomError.badRequest("Could not proceed : Invalid Course ID"));
    }

    //Get potential Fields to Change
    const {name,cycle} = req.body;

    //Querry One Course with id
    //As Update, Querry ALL Fields : Can be further secured
    const course = await CourseModel.findOne({
        where: {id: course_id}
    });

    //Check if Course Found
    if(!course){
        return next(CustomError.notFound("Unregistered Course"));
    };

    //If Field Set, apply change
    if(name) course.name = name;
    if(parameterValidator.isCycleValid(cycle)) course.cycle = cycle;

    //Apply Any Changes
    await course.save();

    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,`PATCH /courses/my/${course_id} on Courses API : Update Done`);
    res.status(200).json(jsonResponse);
};

//@desc Delete Course with id from database
//@route DELETE /courses/my/:course_id
//@access public
const deleteLoggedUserCourse = async (req,res) => {
    //Retreive Field course_id from req.params JSON Object
    const {course_id} = req.params;

    //Check course_id Numerical Value
    if(!parameterValidator.isResolvableToNumber(course_id)){
        return next(CustomError.badRequest("Could not proceed : Invalid Course ID"));
    }

    //Remove One Course with id
    await CourseModel.destroy({
        where: {id: course_id}
    });

    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,`DELETE /courses/my/${course_id} on Courses API : Deleted Course`);
    res.status(204).json(jsonResponse);
};

//Authorize other Modules to make use of Callbacks defined here
module.exports = {
    getCoursesDashboard,
    getCourses,
    getLoggedUserEnrolledCourses,
    getLoggedUserOwnedCourses,
    getCoursesByShareToken,
    createLoggedUserCourse,
    getCourse,
    updateLoggedUserCourse,
    deleteLoggedUserCourse
};
