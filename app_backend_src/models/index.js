//SQL Where Sequelize : https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
//SQL Join Sequelize : https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/
//SQL Join Sequelize On SO : https://stackoverflow.com/questions/20460270/how-to-make-join-queries-using-sequelize-on-node-js
const UserModel = require('./UserModel.js');
const CourseModel = require('./CourseModel.js');
const EnrolledModel = require('./EnrolledModel.js');
const FileModel = require('./FileModel.js');

//Zero to Many using Enrolled
UserModel.belongsToMany(CourseModel,{through: EnrolledModel, foreignKey: "user_id"});
CourseModel.belongsToMany(UserModel,{through: EnrolledModel, foreignKey: "course_id"});

//One to Many
CourseModel.hasMany(FileModel,{foreignKey: "course_id"});

//One to One
FileModel.belongsTo(CourseModel,{foreignKey: "course_id"});

//One to Many
EnrolledModel.hasMany(UserModel,{foreignKey: "id"});
EnrolledModel.hasMany(CourseModel,{foreignKey: "id"});

//One to Many
UserModel.belongsTo(EnrolledModel,{foreignKey: "id"});
CourseModel.belongsTo(EnrolledModel,{foreignKey: "id"});

UserModel.sync();
CourseModel.sync();
EnrolledModel.sync();
FileModel.sync();

module.exports = {
    UserModel,
    CourseModel,
    EnrolledModel,
    FileModel
}
