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

//Used to represent the Files
//Use Link when Files should be refered to by Link : Best Practice
//Use Binary when Files should be stored in DataBase : Not Best Practice
//Foreign Key : https://sequelize.org/docs/v6/core-concepts/assocs/
//Foreign Key : https://stackoverflow.com/questions/14169655/sequelize-js-foreign-key
const FileModel = databaseSequelizeConnexion.define(process.env.FILES_NAME,{
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
    extension:{
        type: DataTypes.ENUM({
            values: [process.env.EXTENSION_1,
                process.env.EXTENSION_2,
                process.env.EXTENSION_3]
        }),
        allowNull: false
    },
    link:{
        type: DataTypes.STRING(500),
        allowNull: true
    },
    binary:{
        type: DataTypes.BLOB('long'),
        allowNull: true
    },
    course_id:{
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: process.env.COURSES_NAME, //Table name
            key: 'id', //Column name in Table
        }
    }
});

FileModel.sync();

module.exports = FileModel;
