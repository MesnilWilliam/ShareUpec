//Controller for using Dashboard Router
//Callbacks of Dashboard Routes are defined using Arrow Syntax for readability
//Use JSON.stringify(Onject) to Print JSON for Console LOG

//Assume in Following Functions
//req.body should be Parsed JSON when Use BodyParser.json as MiddleWare
//req.params is JSON Object with Field from URL
//req.user is defined as Passport Check for Authenticated User in Dashboard Routes

//These Functions should all be On Routes only accessed by Authenticated User
//If User Authentication cannont be established, They are taken to Login Page and Therefor Functions defined Here are not Called

//@desc Get Dashboard Home Page for Authenticated User in req.user
//@route GET /dashboard
//@access public
const getDashboard = (req,res) => {
    res.status(200).send(`Welcome, ${req.user.first_name}`);
};

//@desc Get Profile Info for for Authenticated User in req.user
//@route GET /dashboard/profile
//@access public
const getProfile = (req,res) => {
    res.status(200).send(`UName: ${req.user.first_name} | ULastName: ${req.user.last_name} | UEmail: ${req.user.email}`);
};

//Authorize other Modules to make use of Callbacks defined here
module.exports = {
    getDashboard,
    getProfile
};
