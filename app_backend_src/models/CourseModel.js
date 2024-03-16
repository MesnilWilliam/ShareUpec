//Model to Link with Database using Sequelize
//Sequelize is an Object Relational Manager to facilitate interaction to Relational Database, namely SQL based SGBD
//Instance of Sequelize Object represent Our Database and Connexion
//Instance of Model Object represent One Table from Database
//Akin to Mongoose, define Model with Field Name:{Type,Option}
//To link Instance of Model with Table in Database, use Model.sync()
//Sequelize Documentation : https://sequelize.org/
//Sequelize Simple SetUp for PostgreSQL : https://www.makeuseof.com/use-postgresql-with-sequelize-in-nodejs/
//Model : https://sequelize.org/docs/v7/other-topics/legacy-model-definitions/
const {Sequelize, DataTypes} = require('sequelize');
const databaseSequelizeConnexion = require('../database/databaseConnexion.js');
const dotenv = require('dotenv');
dotenv.config();

//Used to manage what Files belong to what Course
//Foreign Key : https://sequelize.org/docs/v6/core-concepts/assocs/
//Foreign Key : https://stackoverflow.com/questions/14169655/sequelize-js-foreign-key
const CourseModel = databaseSequelizeConnexion.define(process.env.COURSES_NAME,{
    id:{
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    cycle:{
        type: DataTypes.ENUM({
            values: [process.env.CYCLE_1,
                process.env.CYCLE_2,
                process.env.CYCLE_3,
                process.env.CYCLE_4,
                process.env.CYCLE_5]
        }),
        allowNull: false
    },
    owner_id:{
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: process.env.USERS_NAME, //Table name
            key: 'id', //Column name in Table
        }
    }
});

CourseModel.sync();

module.exports = CourseModel;
