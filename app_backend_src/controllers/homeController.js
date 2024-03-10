//Controller for using Home Router
//Callbacks of Home Routes are defined using Arrow Syntax for readability
//Use JSON.stringify(Onject) to Print JSON for Console LOG

//Assume in Following Functions
//req.body should be Parsed JSON when Use BodyParser.json as MiddleWare
//req.params is JSON Object with Field from URL

//Build Response JSON
const jsonBuilder = require('../utils/jsonBuilder.js');

//@desc Home Page
//@route GET /
//@access public
const getHome = (req,res) => {
    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,"API ROOT : TRY SOMETHING FROM HERE");
    res.status(200).json(jsonResponse);
};

//@desc About Page
//@route GET /about
//@access public
const getAbout = (req,res) => {
    const jsonResponse = jsonBuilder.simpleResponse(req.originalUrl,"Made for : UPEC | Made by : WM and MR | Made on : February 2024");
    res.status(200).json(jsonResponse);
};

//Authorize other Modules to make use of Callbacks defined here
module.exports = {
    getHome,
    getAbout
};
