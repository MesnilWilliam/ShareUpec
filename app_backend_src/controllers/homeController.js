//Controller for using Home Router
//Callbacks of Home Routes are defined using Arrow Syntax for readability
//Use JSON.stringify(Onject) to Print JSON for Console LOG

//Assume in Following Functions
//req.body should be Parsed JSON when Use BodyParser.json as MiddleWare
//req.params is JSON Object with Field from URL

//@desc Home Page
//@route GET /
//@access public
const getHome = (req,res) => {
    res.status(200).send("API ROOT : TRY SOMETHING FROM HERE");
};

//@desc About Page
//@route GET /about
//@access public
const getAbout = (req,res) => {
    res.status(200).send("Made for : UPEC | Made by : WM and MR | Made on : February 2024");
};

//Authorize other Modules to make use of Callbacks defined here
module.exports = {
    getHome,
    getAbout
};
