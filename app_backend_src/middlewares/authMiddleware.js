//Allow Check Auth
const checkAuthenticated = (req,res,next) => {
    //Passport add req.isAuthenticated() to check if User Logged In
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/auth/login');
}

module.exports = checkAuthenticated;
