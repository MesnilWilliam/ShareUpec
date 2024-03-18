//Connect to Database using Sequelize
//Sequelize is an Object Relational Manager to facilitate interaction to Relational Database, namely SQL based SGBD
//Instance of Sequelize Object represent Our Database and Connexion
//Instance of Model Object represent One Table from Database
//To link Instance of Model with Table in Database, use Model.sync()
//Sequelize Documentation : https://sequelize.org/
//Sequelize Simple SetUp for PostgreSQL : https://www.makeuseof.com/use-postgresql-with-sequelize-in-nodejs/
const {Sequelize} = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const databaseSequelizeConnexion = new Sequelize(process.env.PG_DATABASE,
    process.env.PG_USER,
    process.env.PG_PASSWORD,
    {
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        dialect: process.env.SGBD
    });

module.exports = databaseSequelizeConnexion;

//DataBase Representation
/*
USER: user_id [BIGINT], first_name [VARCHAR(100)], last_name [VARCHAR(100)], 1_email [VARCHAR(300)], password [VARCHAR(100)], role[SMALLINT], share_code [UUID], created_at [DATE], updated_at [DATE]

ENROLLED, 0N USER, 0N COURSE
:
MANAGE, 0N USER, 11 COURSE

:
COURSE: course_id [INT], name [VARCHAR(100)], cycle [ENUM('L1','L2','L3','M1','M2')], created_at [DATE], updated_at [DATE]
CONTAINS, 11 FILE, 0N COURSE
FILE: file_id [INT], name [VARCHAR(100)], extension [ENUM('pdf','png','jpg')], link [VARCHAR(500)], binary [BLOB], created_at [DATE], updated_at [DATE]
*/
