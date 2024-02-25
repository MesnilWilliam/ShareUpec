const dotenv = require('dotenv');
dotenv.config();

//Allow Check Auth
const checkAuthenticated = (req,res,next) => {
    //Passport add req.isAuthenticated() to check if User Logged In
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/auth/login');
}

//Allow Check Auth And Admin
const checkAdmin = async (req,res,next) => {
    //Passport add req.isAuthenticated() to check if User Logged In
    if(req.isAuthenticated()){
        //User Authenticated : Allow If Admin
        if(req.user.role == process.env.ROLE_ADMIN){
            return next();
        }
    }
    res.redirect('/auth/login');
}

module.exports = {
    checkAuthenticated,
    checkAdmin
};
