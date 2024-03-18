//Controller for using Files Router
//Callbacks of Files Routes are defined using Arrow Syntax for readability
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
const FilesModel = require('../models/FileModel.js');
const parameterValidator = require('../utils/parameterValidator.js');
const fileDownload = require('../utils/fileDownload.js');
const dotenv = require('dotenv');
dotenv.config();

//@desc Get Files for Defined Course
//@route GET /:course_id/files
//@access public
const getFilesForCourse = async (req,res,next) => {
    //Retreive Field CourseID from req.params JSON Object
    const {course_id} = req.params;

    //Check course_id Numerical Value
    if(!parameterValidator.isResolvableToNumber(course_id)){
        return next(CustomError.badRequest("Could not proceed : Invalid Course ID"));
    }

    //Querry all Files for Course
    const files = await FilesModel.findAll({
        include: {
            model: CourseModel,
            where: {id: course_id},
            required: true
        },
        order: [['name','ASC']],
        attributes: ['id','name','extension','link','binary','course_id']
    });

    //Check if somehow Files Undefined
    if(!files){
        return next(CustomError.serverError('Something Happened'));
    };
    
    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,JSON.stringify(files, null, 2));
    res.status(200).json(jsonResponse);
}

//@desc Add File to Defined Course
//@route POST /:course_id/files/add
//@access public
const addLoggedUserCourseFile = async (req,res,next) => {
    //Retreive Field CourseID from req.params JSON Object
    const {course_id} = req.params;

    //Check course_id Numerical Value
    if(!parameterValidator.isResolvableToNumber(course_id)){
        return next(CustomError.badRequest("Could not proceed : Invalid Course ID"));
    }

    //Check User is Owner of Course
    const matchCourse = await CourseModel.findOne({
        where: {
            id: course_id,
            owner_id: req.user.id
        },
        attributes: ['id','owner_id']
    });

    if(!matchCourse || (matchCourse.owner_id != req.user.id)){
        return next(CustomError.forbidden('Forbidden : Can only add Files to Your own Courses'));
    }

    //Retreive Request Body data
    const formFile = {
        ...req.body
    };
    
    //Check all needed Fields are here
    if(!formFile.name || !formFile.extension || (!formFile.link && !formFile.binary)){
        return next(CustomError.badRequest("Could not proceed : Missing Value"));
    };

    //Check valid Extension
    if(!parameterValidator.isDeclaredFileExtensionValid(formFile.extension)){
        return next(CustomError.badRequest("Could not proceed : Extension Unsupported"));
    }

    //Check valid Extension
    if(formFile.link && !parameterValidator.isFileExtensionValid(formFile.link,formFile.extension)){
        return next(CustomError.badRequest("Could not proceed : Extension"));
    }

    //Only use Needed Fields to let AutoGen Fill ID and then some
    const addedFile = await FileModel.create({
        name: formFile.name,
        extension: formFile.extension,
        link: formFile.link,
        binary: formFile.binary,
        course_id: course_id
    });

    //Check if somehow File Undefined
    if(!addedFile){
        return next(CustomError.serverError("Error : Something Happened"));
    };

    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,`POST /${course_id}/files/add on Files API : Created File with ID ${addedFile.id}`);
    res.status(201).json(jsonResponse);
};

//@desc Get File with id for Defined Course from database
//@route GET /:course_id/files/:file_id
//@access public
const getFileForCourse = async (req,res,next) => {
    //Retreive Fields ID from req.params JSON Object
    const {course_id,file_id} = req.params;

    //Check course_id Numerical Value
    if(!parameterValidator.isResolvableToNumber(course_id)){
        return next(CustomError.badRequest("Could not proceed : Invalid Course ID"));
    }

    //Check file_id Numerical Value
    if(!parameterValidator.isResolvableToNumber(file_id)){
        return next(CustomError.badRequest("Could not proceed : Invalid File ID"));
    }

    //Querry One File with id for Course
    const file = await FilesModel.findOne({
        where: {id: file_id},
        include: {
            model: CourseModel,
            where: {id: course_id},
            required: true
        },
        attributes: ['id','name','extension','link','binary','course_id']
    });

    //Check if File Found
    if(!file){
        return next(CustomError.notFound("Unregistered File"));
    };

    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,JSON.stringify(file, null, 2));
    res.status(200).json(jsonResponse);
};

const downloadFile = async (req,res,next) => {
    //Retreive Fields ID from req.params JSON Object
    const {course_id,file_id} = req.params;

    //Check course_id Numerical Value
    if(!parameterValidator.isResolvableToNumber(course_id)){
        return next(CustomError.badRequest("Could not proceed : Invalid Course ID"));
    }

    //Check file_id Numerical Value
    if(!parameterValidator.isResolvableToNumber(file_id)){
        return next(CustomError.badRequest("Could not proceed : Invalid File ID"));
    }

    //Querry One File with id for Course
    const file = await FilesModel.findOne({
        where: {id: file_id},
        include: {
            model: CourseModel,
            where: {id: course_id},
            required: true
        },
        attributes: ['id','name','extension','link','binary','course_id']
    });

    //Check if File Found
    if(!file){
        return next(CustomError.notFound("Unregistered File"));
    };

    //Check if File by Link
    if(file.link){
        //Check if File Extension Valid
        if(!parameterValidator.isFileExtensionValid(file.link,file.extension)){
            return next(CustomError.forbidden("File Extension Mismatch : Cancelling Download"));
        }

        //Check if Downloaded
        if(!await fileDownload.downloadFromURL(file.link)){
            return next(CustomError.serverError("Error : Something Happened"));
        }

        const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,`Downloaded in User Home Directory's ${proces.env.DOWNLOAD_DIRECTORY} Folder`);
        res.status(200).json(jsonResponse);
    }

    //Check if File by Binary
    if(file.binary){
        //Check if File Extension Valid
        if(!parameterValidator.isFileExtensionValid(file.name,file.extension)){
            return next(CustomError.forbidden("File Extension Mismatch : Cancelling Download"));
        }

        //Check if Downloaded
        /*if(!await fileDownload.downloadFromBinary(file.binary)){
            return next(CustomError.serverError("Error : Something Happened"));
        }*/

        return next(CustomError.serverError("Error : Unsupported Operation Binary Download"));
    }

    return next(CustomError.notFound("Error : File Content Not Found"));
}

//@desc Update File with id for Course in database
//@route PATCH /:course_id/files/:file_id
//@access public
const updateLoggedUserCourseFile = async (req,res,next) => {
    //Retreive Fields ID from req.params JSON Object
    const {course_id,file_id} = req.params;

    //Check course_id Numerical Value
    if(!parameterValidator.isResolvableToNumber(course_id)){
        return next(CustomError.badRequest("Could not proceed : Invalid Course ID"));
    }

    //Check file_id Numerical Value
    if(!parameterValidator.isResolvableToNumber(file_id)){
        return next(CustomError.badRequest("Could not proceed : Invalid File ID"));
    }

    //Check User is Owner of Course
    const matchCourse = await CourseModel.findOne({
        where: {
            id: course_id,
            owner_id: req.user.id
        },
        attributes: ['id','owner_id']
    });

    if(!matchCourse || (matchCourse.owner_id != req.user.id)){
        return next(CustomError.forbidden('Forbidden : Can only update Files to Your own Courses'));
    }

    //Get potential Fields to Change
    const {name,extension,link,binary} = req.body;

    //Querry One File with id for Course
    //As Update, Querry ALL Fields : Can be further secured
    const file = await FilesModel.findOne({
        where: {id: file_id},
        include: {
            model: CourseModel,
            where: {id: course_id},
            required: true
        }
    });

    //Check if File Found
    if(!file){
        return next(CustomError.notFound("Unregistered File"));
    };

    //If Field Set, apply change
    if(name) file.name = name;
    if(parameterValidator.isDeclaredFileExtensionValid(extension)) file.extension = extension;
    if(link || binary){
        if(parameterValidator.isFileExtensionValid(link,file.extension)) file.link = link;
        if(binary) file.binary = binary;
    }

    //Apply Any Changes
    await file.save();

    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,`PATCH /${course_id}/files/${file_id} on Files API : Update Done`);
    res.status(200).json(jsonResponse);
};

//@desc Delete File with id for Course from database
//@route DELETE /:courses/files/:file_id
//@access public
const deleteLoggedUserCourseFile = async (req,res) => {
    //Retreive Fields ID from req.params JSON Object
    const {course_id,file_id} = req.params;

    //Check course_id Numerical Value
    if(!parameterValidator.isResolvableToNumber(course_id)){
        return next(CustomError.badRequest("Could not proceed : Invalid Course ID"));
    }

    //Check file_id Numerical Value
    if(!parameterValidator.isResolvableToNumber(file_id)){
        return next(CustomError.badRequest("Could not proceed : Invalid File ID"));
    }

    //Check User is Owner of Course
    const matchCourse = await CourseModel.findOne({
        where: {
            id: course_id,
            owner_id: req.user.id
        },
        attributes: ['id','owner_id']
    });

    if(!matchCourse || (matchCourse.owner_id != req.user.id)){
        return next(CustomError.forbidden('Forbidden : Can only delete Files to Your own Courses'));
    }

    //Remove One File with id
    await FileModel.destroy({
        where: {
            id: file_id,
            course_id: course_id
        }
    });

    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,`DELETE /${course_id}/files/${file_id} on FIles API : Deleted File`);
    res.status(204).json(jsonResponse);
};

//Authorize other Modules to make use of Callbacks defined here
module.exports = {
    getFilesForCourse,
    addLoggedUserCourseFile,
    getFileForCourse,
    downloadFile,
    updateLoggedUserCourseFile,
    deleteLoggedUserCourseFile
};
