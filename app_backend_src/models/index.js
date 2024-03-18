//SQL Where Sequelize : https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
//SQL Join Sequelize : https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/
//SQL Join Sequelize On SO : https://stackoverflow.com/questions/20460270/how-to-make-join-queries-using-sequelize-on-node-js
const UserModel = require('./UserModel.js');
const CourseModel = require('./CourseModel.js');
const EnrolledModel = require('./EnrolledModel.js');
const FileModel = require('./FileModel.js');

module.exports = {
    UserModel,
    CourseModel,
    EnrolledModel,
    FileModel
}
