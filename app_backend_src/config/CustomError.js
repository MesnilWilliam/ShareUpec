//Class to define HTTP Error
//Documentation : https://expressjs.com/en/guide/error-handling.html
//Video : https://www.youtube.com/watch?v=DyqVqaf1KnA
class CustomError extends Error{
    constructor(statusCode,message){
        super(message);
        this.statusCode = statusCode;

        //Constructor of Error does not need to be on Trace
        Error.captureStackTrace(this,CustomError);
    }

    static badRequest(message){
        return new CustomError(400,message);
    }

    static unauthorized(message){
        return new CustomError(401,message);
    }

    static forbidden(message){
        return new CustomError(403,message);
    }

    static notFound(message){
        return new CustomError(404,message);
    }

    static serverError(message){
        return new CustomError(500,message);
    }
}

module.exports = CustomError;
