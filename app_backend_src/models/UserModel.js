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

const roleUser = process.env.ROLE_USER || 0;

//Admin mostly takes place inside the DB still User.role can Allow Admin to Act on DB from App
const UserModel = databaseSequelizeConnexion.define(process.env.USERS_NAME,{
    id:{
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    first_name:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    last_name:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email:{
        type: DataTypes.STRING(300),
        allowNull: false,
        unique: true
    },
    password:{
        type: DataTypes.STRING(300),
        allowNull: false
    },
    role:{
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: roleUser
    },
    share_code:{
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4 // Or DataTypes.UUIDV1
    }
});

UserModel.sync();

module.exports = UserModel;
