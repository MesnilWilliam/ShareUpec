//Configure Passport and Strategies
//Callback for all used Strategies are Defined
//Then Strategie is added to Passport
//Passport can handle multiple Strategies : Local, Google...
//Info on Passport and Session : https://www.passportjs.org/concepts/authentication/sessions/
//Tick Function : https://nodejs.org/en/learn/asynchronous-work/understanding-processnexttick
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const databaseSequelizeConnexion = require('../database/databaseConnexion.js');
const UserModel = require('../models/UserModel.js');

//Passport.serialize(Function) create and send Cookie containing all data to uniquely identify Client
//User is instance of UserModel
passport.serializeUser((user,done) => {
    //Calling done(Error,Object) allow to create Cookie
    //If OK send No Error and important User Fields used to retreive later
    done(null,user.id);
});

//Passport.deserialize(Function) check Cookie from Client and all data are Queried from DB based on Cookie
passport.deserializeUser(async (id,done) => {
    //Querry One User with id from Cookie
    const user = await UserModel.findOne({
        where: {id: id},
        attributes: ['id','first_name','last_name','email']
    });
    //Calling done(Error,Object) allow to forward User
    //If OK send No Error and Forward User
    done(null,user);
});

//Passport.use(Strategy,Function) link Strategy with Authentication Function
//Calling Passport.authenticate(Strategy,Options) use Function defined here
passport.use(
    new LocalStrategy({
        //Options of LocalStrategy
        //Define Parameters Names send in POST Request for username and password
        //Set Option passReqToCallback as True when needed to use Request for Authentication Function
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: false
    }, async (email,password,done) => {
        //Authentication of LocalStrategy
        //Querry One User with id from Cookie
        const user = await UserModel.findOne({
            where: {email: email},
            attributes: ['id','email','password']
        });
        if(!user){
            //User Not Found
            done(null,false);
        }
        //User Found Check PassWord
        const matchPassword = await bcrypt.compare(password,user.password);
        if(!matchPassword){
            //Wrong Password
            done(null,false);
        }
        //User Email and Password OK
        done(null,user);
    })
);

module.exports = passport;
