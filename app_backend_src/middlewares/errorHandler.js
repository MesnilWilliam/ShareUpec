//Callback/MiddleWare called when Error Thrown
//Allow to Handle Error with proper Message to Client if Needed
//Also add some Disclosure and Stop Print of LOGS on Production

//Codes
const VALIDATION_ERROR = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

//Titles
const VALIDATION_ERROR_TITLE = "Validation Error";
const UNAUTHORIZED_TITLE = "Unauhorized Access";
const FORBIDDEN_TITLE = "Forbidden Request";
const NOT_FOUND_TITLE = "Page Not Found";
const SERVER_ERROR_TITLE = "Server Error";

//TODO : Add Try/Catch to see if better and Fix App Crash
const errorHandler = (err,req,res,next) => {
    //Retreive Status or assume Server Error 500
    const statusCode = res.statusCode ? res.statusCode : SERVER_ERROR;
    var shouldSend = true;
    var payload = {};
    
    switch(statusCode){
        case VALIDATION_ERROR:
            payload = {
                title: VALIDATION_ERROR_TITLE,
                message: err.message
            };
            break;
        case UNAUTHORIZED:
            payload = {
                title: UNAUTHORIZED_TITLE,
                message: err.message
            };
            break;
        case FORBIDDEN:
            payload = {
                title: FORBIDDEN_TITLE,
                message: err.message
            };
            break;
        case NOT_FOUND:
            payload = {
                title: NOT_FOUND_TITLE,
                message: err.message
            };
            break;
        case SERVER_ERROR:
            payload = {
                title: SERVER_ERROR_TITLE,
                message: err.message
            };
            break;
        default:
            shouldSend = false;
    }

    if(process.env.NODE_ENV === 'development'){
        payload = {...payload, stackTrace:err.stack};
    }

    if(shouldSend){
        res.json(payload);
    }
    return next();
}

module.exports = errorHandler;
