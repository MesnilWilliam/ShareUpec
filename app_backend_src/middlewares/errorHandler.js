//Callback/MiddleWare called when Error Thrown
//Allow to Handle Error with proper Message to Client if Needed
//Also add some Disclosure and Stop Print of LOGS on Production
//Documentation : https://expressjs.com/en/guide/error-handling.html
//Video : https://www.youtube.com/watch?v=DyqVqaf1KnA

//Import CustomError
const CustomError = require('../config/CustomError.js');

//TODO : Fix App Crash
const errorHandler = (err,req,res,next) => {
    //Case when Res already started setting Headers : Call next to forward error to Express Default Handler
    if(res.headersSent){
        return next(err);
    }

    //Retreive Status or assume Server Error 500
    const statusCode = err.statusCode ? err.statusCode : 500;
    const message = err.message ? err.message : "An Error Occurred";
    
    //Build Payload
    var payload = {
        statusCode: statusCode,
        message: message
    };

    //Debug Development Stack
    if(process.env.NODE_ENV === 'development'){
        payload = {...payload, stackTrace:err.stack};
    }

    res.status(statusCode).json(payload);
    return;
}

module.exports = errorHandler;
